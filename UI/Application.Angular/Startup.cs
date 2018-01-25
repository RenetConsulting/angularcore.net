namespace Application
{
    using System;
    using System.Security.Principal;
    using Application.DataAccess;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using AspNet.Security.OpenIdConnect.Primitives;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.SpaServices.Webpack;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.DependencyInjection;

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

            //// Add Entity Framework with OpenIdDict
            //services.AddEntityFramework()
            //    .AddEntityFrameworkSqlServer()
            //    .AddDbContext<DataContext>(
            //        options =>
            //        {
            //            options.UseSqlServer(this.Configuration["Data:ConnectionString"], o => o.MigrationsAssembly("Application"));
            //            options.UseOpenIddict();
            //        },
            //        ServiceLifetime.Scoped);

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
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            // Register the OAuth2 validation handler.
            services.AddAuthentication()
                .AddOAuthValidation();

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

                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            // Register the OpenIddict services.
            // Note: use the generic overload if you need
            // to replace the default OpenIddict entities.
            services.AddOpenIddict(options =>
            {
                // Register the Entity Framework stores.
                options.AddEntityFrameworkCoreStores<DataContext>();

                // Register the ASP.NET Core MVC binder used by OpenIddict.
                // Note: if you don't call this method, you won't be able to
                // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
                options.AddMvcBinders();

                // Enable the token endpoint (required to use the password flow).
                options.EnableTokenEndpoint("/connect/token");

                // Allow client applications to use the grant_type=password flow.
                options.AllowPasswordFlow();

                // Allow client applications to use the grant_type=resfresh_token flow.
                options.AllowRefreshTokenFlow();

                // During development, you can disable the HTTPS requirement.
                options.DisableHttpsRequirement();

                options.UseRollingTokens();
            });

            // Add framework services.
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            });

            services.AddNodeServices();

            services.AddScoped<IGlobalRepository, GlobalRepository>();

            // Removed SSL for Development
            if (!this.Environment.IsDevelopment())
            {
                // Require SSL
                services.Configure<MvcOptions>(options =>
                {
                    options.Filters.Add(new RequireHttpsAttribute());
                });
            }

            this.RegisterOpenIddictServices(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(this.Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseStaticFiles();

            app.UseMvc();

            //app.UseStaticFiles(new StaticFileOptions
            //{
            //    OnPrepareResponse = ctx =>
            //    {
            //        string durationInSeconds = "max-age=1209600"; // 60 * 60 * 24 * 14 (days);

            //        if (!ctx.File.IsDirectory && !string.IsNullOrEmpty(ctx.File.Name) && ctx.File.Name.EndsWith(".json", System.StringComparison.OrdinalIgnoreCase))
            //        {
            //            if (env.IsDevelopment())
            //            {
            //                durationInSeconds = "max-age=1"; // 1 sec
            //            }
            //            else
            //            {
            //                durationInSeconds = "max-age=360"; // 60 * 6 (min);
            //            }
            //        }

            //        if (!ctx.Context.Response.Headers.ContainsKey(HeaderNames.CacheControl))
            //        {
            //            ctx.Context.Response.Headers.Add(HeaderNames.CacheControl, durationInSeconds);
            //        }
            //        else
            //        {
            //            ctx.Context.Response.Headers[HeaderNames.CacheControl] = durationInSeconds;
            //        }
            //    }
            //});

            

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                // should be before UseMvc
                app.UseStatusCodePagesWithReExecute("/Home/Error");
            }

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });

            // // Create DB on startup
            // using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            // {
            //    using (var context = serviceScope.ServiceProvider.GetService<DataContext>())
            //    {
            //        context.Database.Migrate();
            //        int result = context.Initialize().Result;
            //        loggerFactory.CreateLogger("DataBase").LogInformation("Database initialized with {0} records", result);
            //    }
            // }
        }

        private void RegisterOpenIddictServices(IServiceCollection services)
        {
            // Register the OpenIddict services.
            var openIddictBuilder = services.AddOpenIddict()

                // Register the Entity Framework stores.
                .AddEntityFrameworkCoreStores<DataContext>()

                // Register the ASP.NET Core MVC binder used by OpenIddict.
                // Note: if you don't call this method, you won't be able to
                // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
                .AddMvcBinders()

                // Enable the token endpoint.
                .EnableTokenEndpoint("/connect/token")

                // Enable the password and the refresh token flows.
                .AllowPasswordFlow()
                .AllowRefreshTokenFlow()

                // Register a new ephemeral key, that is discarded when the application
                // shuts down. Tokens signed using this key are automatically invalidated.
                // This method should only be used during development.
                .AddEphemeralSigningKey();

            // Removed SSL for Development
            if (this.Environment.IsDevelopment())
            {
                openIddictBuilder.DisableHttpsRequirement();
            }
        }
    }
}
