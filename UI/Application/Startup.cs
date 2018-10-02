﻿// <copyright file="Startup.cs" company="RenetConsulting Inc.">
// Copyright (c) RenetConsulting Inc.. All rights reserved.
// </copyright>

namespace Application
{
    using System;
    using System.IO.Compression;
    using System.Linq;
    using System.Threading.Tasks;
    using Application.DataAccess;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using Application.Providers;
    using AspNet.Security.OAuth.Validation;
    using AspNet.Security.OpenIdConnect.Primitives;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.ResponseCompression;
    using Microsoft.AspNetCore.SpaServices.AngularCli;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Net.Http.Headers;
    using OpenIddict.Abstractions;

    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            this.Environment = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            this.Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        private IHostingEnvironment Environment { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppSettings>(this.Configuration.GetSection("AppSettings"));

            // Add framework services.
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            // Add SSL for Production
            if (!this.Environment.IsDevelopment())
            {
                // Require SSL
                services.Configure<MvcOptions>(options => options.Filters.Add(new RequireHttpsAttribute()));
            }

            services.AddDbContext<DataContext>(options =>
            {
                // Configure the context to use Microsoft SQL Server.
                options.UseSqlServer(this.Configuration["Data:ConnectionString"], o => o.MigrationsAssembly("Application"));

                // Register the entity sets needed by OpenIddict.
                // Note: use the generic overload if you need
                // to replace the default OpenIddict entities.
                options.UseOpenIddict();
            });

            // add identity
            services.AddDefaultIdentity<ApplicationUser>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            // Configure Identity to use the same JWT claims as OpenIddict instead
            // of the legacy WS-Federation claims it uses by default (ClaimTypes),
            // which saves you from doing the mapping in your authorization controller.
            services.Configure<IdentityOptions>(options =>
            {
                // User settings
                options.User.RequireUniqueEmail = true;

                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 5;

                // SignIn settings
                options.SignIn.RequireConfirmedEmail = true;

                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

            //services.AddOpenIddict()
            //    .AddCore(options =>
            //    {
            //        options.UseEntityFrameworkCore().UseDbContext<DataContext>();
            //    })
            //    .AddServer(options =>
            //    {

            //        options.UseRollingTokens();

            //        // Note: to use JWT access tokens instead of the default encrypted format, the following lines are required:
            //        // options.UseJsonWebTokens();
            //    });

            services.AddOpenIddict()

                // Register the OpenIddict core services.
                .AddCore(options =>
                {
                    // Configure OpenIddict to use the Entity Framework Core stores and models.
                    options.UseEntityFrameworkCore()
                           .UseDbContext<DataContext>();
                })

                // Register the OpenIddict server handler.
                .AddServer(options =>
                {
                    // Register the ASP.NET Core MVC services used by OpenIddict.
                    // Note: if you don't call this method, you won't be able to
                    // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
                    options.UseMvc();

                    // Enable the authorization, logout, token and userinfo endpoints.
                    options.EnableTokenEndpoint("/connect/token");

                    // Note: the Mvc.Client sample only uses the code flow and the password flow, but you
                    // can enable the other flows if you need to support implicit or client credentials.
                    options.AllowPasswordFlow()
                           .AllowRefreshTokenFlow()
                           .AllowCustomFlow("external_identity_token");

                    // Mark the "email", "profile" and "roles" scopes as supported scopes.
                    options.RegisterScopes(
                        OpenIdConnectConstants.Scopes.OpenId,
                        OpenIdConnectConstants.Scopes.Email,
                        OpenIdConnectConstants.Scopes.Profile,
                        OpenIdConnectConstants.Scopes.OfflineAccess,
                        OpenIddictConstants.Scopes.Roles);

                    // During development, you can disable the HTTPS requirement.
                    if (this.Environment.IsDevelopment())
                    {
                        options.DisableHttpsRequirement();
                    }

                    // Note: to use JWT access tokens instead of the default
                    // encrypted format, the following lines are required:
                    //
                    // options.UseJsonWebTokens();
                    // options.AddEphemeralSigningKey();

                    // Note: if you don't want to specify a client_id when sending
                    // a token or revocation request, uncomment the following line:
                    options.AcceptAnonymousClients();

                    options.UseRollingTokens();
                });

            // Register the OAuth2 validation handler.
            services.AddAuthentication(options => options.DefaultAuthenticateScheme = OAuthValidationDefaults.AuthenticationScheme)
                .AddOAuthValidation();

            // Resolve dependencies
            services.AddScoped<IGlobalRepository, GlobalRepository>();

            services.AddResponseCompression(options =>
            {
                options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
                new[] { "text/javascript", "image/svg+xml", "application/manifest+json" });
                options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
                options.EnableForHttps = true;
            });

            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(this.Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");

#if !NoHttps
                app.UseHsts();
            }

            app.UseHttpsRedirection();
#else
            }

#endif

            // The UseResponseCompression should be first before UseStaticFiles/UseSpaStaticFiles.
            // The order is important for all type compression.
            app.UseResponseCompression();

            app.UseAuthentication();

            app.UseStaticFiles(StaticFileOptions(env));

            app.UseSpaStaticFiles(StaticFileOptions(env));

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
        }

        private static StaticFileOptions StaticFileOptions(IHostingEnvironment env)
        {
            return new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    string durationInSeconds = "max-age=31536000, immutable"; // 60 * 60 * 24 * 365 (days);

                    if (!ctx.File.IsDirectory && !string.IsNullOrEmpty(ctx.File.Name) && ctx.File.Name.EndsWith(".json", System.StringComparison.OrdinalIgnoreCase))
                    {
                        if (env.IsDevelopment())
                        {
                            durationInSeconds = "max-age=1"; // 1 sec
                        }
                        else
                        {
                            durationInSeconds = "max-age=360"; // 60 * 6 (min);
                        }
                    }

                    if (!ctx.Context.Response.Headers.ContainsKey(HeaderNames.CacheControl))
                    {
                        ctx.Context.Response.Headers.Add(HeaderNames.CacheControl, durationInSeconds);
                    }
                    else
                    {
                        ctx.Context.Response.Headers[HeaderNames.CacheControl] = durationInSeconds;
                    }

                    if (!ctx.File.IsDirectory && !string.IsNullOrEmpty(ctx.File.Name))
                    {
                        if (ctx.File.Name.EndsWith(".js", System.StringComparison.OrdinalIgnoreCase) || ctx.File.Name.EndsWith(".css", System.StringComparison.OrdinalIgnoreCase))
                        {
                            ctx.Context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                        }

                        if (ctx.File.Name.EndsWith(".js", System.StringComparison.OrdinalIgnoreCase))
                        {
                            ctx.Context.Response.Headers[HeaderNames.ContentType] = "text/javascript";
                        }
                        else if (ctx.File.Name.EndsWith("site.webmanifest", System.StringComparison.OrdinalIgnoreCase))
                        {
                            ctx.Context.Response.Headers[HeaderNames.ContentType] = "application/manifest+json";
                        }
                    }
                }
            };
        }
    }
}
