// <copyright file="Startup.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// </copyright>

namespace Application
{
    using System;
    using System.IO.Compression;
    using System.Linq;
    using System.Security.Principal;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.Communications;
    using Application.Business.Helpers;
    using Application.DataAccess;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using AspNet.Security.OAuth.Validation;
    using AspNet.Security.OpenIdConnect.Primitives;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
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
    using SendGrid;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

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
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConfiguration(this.Configuration.GetSection("Logging"));
                loggingBuilder.AddConsole();
                loggingBuilder.AddDebug();
                loggingBuilder.AddAzureWebAppDiagnostics();
            });

            services.Configure<AppSettings>(this.Configuration.GetSection("AppSettings"));

            // Add framework services.
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

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
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddRoles<ApplicationRole>()
                .AddRoleManager<RoleManager<ApplicationRole>>()
                .AddUserManager<ApplicationUserManager<ApplicationUser>>()
                .AddSignInManager<ApplicationSignInManager<ApplicationUser>>()
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
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;

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
            string apiKey = this.Configuration["AppSettings:SendGridKey"];
            services.AddScoped<ISendGridClient>(f => new SendGridClient(apiKey));
            services.AddScoped<IMailClient, MailClient>();
            services.AddScoped<CoreCaptchaFilter>();

            services.AddTransient<IPrincipal>(
                provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);

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
            services.AddNodeServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            // The UseResponseCompression should be first before UseStaticFiles/UseSpaStaticFiles.
            // The order is important for all type compression.
            app.UseResponseCompression();

            app.UseAuthentication();

            app.UseStaticFiles(StaticFileOptions(env));

            app.UseSpaStaticFiles(StaticFileOptions(env));

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
                else
                {
                    // SSR is enabled only in production
                    spa.UseSpaPrerendering(options =>
                    {
                        options.BootModulePath = $"{spa.Options.SourcePath}/dist-server/main.js";
                        options.ExcludeUrls = new[] { "/sockjs-node" };
                    });
                }
            });

            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<DataContext>())
                {
                    try
                    {
                        context.Database.Migrate();

                        int result = context.Initialize().Result;
                    }
                    catch
                    {
                        throw;
                    }
                }
            }
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
