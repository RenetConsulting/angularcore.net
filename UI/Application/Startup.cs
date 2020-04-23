// <copyright file="Startup.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// </copyright>

namespace Application
{
    using System;
    using System.Diagnostics;
    using System.IO.Compression;
    using System.Linq;
    using System.Security.Principal;
    using System.Text.Json;
    using System.Text.Json.Serialization;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.Communications;
    using Application.Business.CoreCaptcha;
    using Application.Business.Interfaces;
    using Application.Business.Services;
    using Application.DataAccess;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using Application.Services;
    using AspNet.Security.OAuth.Validation;
    using AspNet.Security.OpenIdConnect.Primitives;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.ResponseCompression;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Net.Http.Headers;
    using OpenIddict.Abstractions;
    using SendGrid;

    public class Startup
    {
        private readonly ILogger logger;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            this.Configuration = configuration;
            this.Environment = env;
            this.logger = GetEarlyInitializationLogger();
        }

        private ILogger GetEarlyInitializationLogger()
        {
            // var instrumentationKey = this.Configuration.GetValue<string>("ApplicationInsights:InstrumentationKey");
            using var loggerFactory = LoggerFactory.Create(LoggingBuilder());
            //    builder =>
            //{
            //    builder.AddConsole();
            //    //builder.AddApplicationInsights(instrumentationKey);
            //});

            return loggerFactory.CreateLogger("Initialization");
        }
        private Action<ILoggingBuilder> LoggingBuilder()
        {
            return loggingBuilder =>
            {
                loggingBuilder.AddConfiguration(this.Configuration.GetSection("Logging"));
                loggingBuilder.AddConsole();
                loggingBuilder.AddDebug();
                loggingBuilder.AddAzureWebAppDiagnostics();
            };
        }

        public IConfiguration Configuration { get; }

        private IWebHostEnvironment Environment { get; set; }

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

            services.AddCors(options =>
            {
                options.AddPolicy(
                    "CorsPolicy",
                    builder => builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            // Add framework services.
            services.AddMvc().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
            .AddMvcOptions(o => o.EnableEndpointRouting = false);

            // TODO: Review need
            services.AddSignalR();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist/angular";
            });

            services.AddDbContext<DataContext>(options =>
            {
                string dsd = this.Configuration["Data:ConnectionString"];

                // Configure the context to use Microsoft SQL Server.
                options.UseSqlServer(this.Configuration["Data:ConnectionString"], o => o.MigrationsAssembly("Application"));

                // Register the entity sets needed by OpenIddict.
                // Note: use the generic overload if you need
                // to replace the default OpenIddict entities.
                options.UseOpenIddict();

                options.EnableSensitiveDataLogging();
            });

            // add identity
            services.AddIdentity<ApplicationUser, ApplicationRole>()
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
                           .AllowCustomFlow("external_identity_token")
                           .AllowRefreshTokenFlow();

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
            services.AddScoped<ApplicationSignInManager<ApplicationUser>>();
            services.AddScoped<IGlobalRepository, GlobalRepository>();
            string apiKey = this.Configuration["AppSettings:SendGridKey"];
            services.AddScoped<ISendGridClient>(f => new SendGridClient(apiKey));
            services.AddScoped<IMailClient, MailClient>();
            services.AddScoped<IAzureBlobManager, AzureBlobManager>();
            services.AddScoped<IBlogService, BlogService>();
            services.AddScoped<IFileManager, AzureFileManager>();
            services.AddScoped<IApplicationUserManager<ApplicationUser>, ApplicationUserManager<ApplicationUser>>();

            services.Configure<CoreCaptchaSettings>(this.Configuration.GetSection("CoreCaptcha"));

            // The simple call:
            // services.AddScoped(f => new CoreCaptchaFilter(
            //    f.GetService<IConfiguration>(),
            //    f.GetService<ILogger<CoreCaptchaFilter>>(),
            //    f.GetService<IOptions<CoreCaptchaSettings>>(),
            //    hash: "hash",
            //    captcha: "captcha"));
            // This call required for the decorator [ServiceFilter(typeof(CoreCaptchaFilter))]
            services.AddScoped<CoreCaptchaFilter>();

            services.AddScoped<ICoreCaptcha, CoreCaptchaFilter>();

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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
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

            // calls to UseAuthentication, UseAuthorization, and UseCors must appear between the calls to UseRouting and UseEndpoints to be effective.
            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseStaticFiles(StaticFileOptions(env));

            app.UseSpaStaticFiles(StaticFileOptions(env));

            app.UseCors("CorsPolicy");

            app.UseEndpoints(routes =>
            {
                routes.MapHub<BlogHubBase>("/Blog");
                routes.MapDefaultControllerRoute();
            });

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
                    this.logger?.LogInformation("Environment:Development. Starting UseProxyToSpaDevelopmentServer");

                    // use: npm start --sourceMap=true
                    // See: https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/angular?view=aspnetcore-3.1&tabs=visual-studio
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
                else
                {
                    this.logger?.LogInformation("Environment:Production.");
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

        // TODO: Need to review adding date to signalR
        /*
        private static void ProcessDateTimeWithCustomConverter()
        {
            JsonSerializerOptions options = new JsonSerializerOptions();
            options.Converters.Add(new DateTimeConverterUsingDateTimeParse());

            string testDateTimeStr = "04-10-2008 6:30 AM";
            string testDateTimeJson = @"""" + testDateTimeStr + @"""";

            DateTime resultDateTime = JsonSerializer.Deserialize<DateTime>(testDateTimeJson, options);
            Console.WriteLine(resultDateTime);

            string resultDateTimeJson = JsonSerializer.Serialize(DateTime.Parse(testDateTimeStr), options);
            Console.WriteLine(Regex.Unescape(resultDateTimeJson));
        }
        */
        private static StaticFileOptions StaticFileOptions(IWebHostEnvironment env)
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
