namespace Application.Angular
{
    using System;
    using Application.DataAccess;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using AspNet.Security.OpenIdConnect.Primitives;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Infrastructure;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Net.Http.Headers;
    using Microsoft.AspNetCore.SpaServices.Webpack;

    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            this.Environment = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            this.Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        private IHostingEnvironment Environment { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add Entity Framework with OpenIdDict
            services.AddEntityFramework()
                .AddEntityFrameworkSqlServer()
                .AddDbContext<DataContext>(
                    options =>
                    {
                        options.UseSqlServer(this.Configuration["Data:ConnectionString"], o => o.MigrationsAssembly("Application.Angular"));
                        options.UseOpenIddict();
                    },
                    ServiceLifetime.Scoped);

            // Add Identity
            services.AddIdentity<ApplicationUser, IdentityRole>(
                options =>
                {
                    options.Password.RequiredLength = 6;
                    options.Password.RequireDigit = true;
                    options.Password.RequireNonAlphanumeric = true;
                    options.User.RequireUniqueEmail = true;
                    options.SignIn.RequireConfirmedEmail = true;
                    options.Lockout.DefaultLockoutTimeSpan = new TimeSpan(0, 3, 0);
                    options.Lockout.MaxFailedAccessAttempts = 5;
                })
              .AddEntityFrameworkStores<DataContext>()
              .AddDefaultTokenProviders();

            services.AddAuthentication();

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

            app.UseMvc();

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    string durationInSeconds = "max-age=1209600"; // 60 * 60 * 24 * 14 (days);

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

                }
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });

                app.MapWhen(x => !x.Request.Path.Value.StartsWith("/swagger"), builder =>
                {
                    builder.UseMvc(routes =>
                    {
                        routes.MapSpaFallbackRoute(
                            name: "spa-fallback",
                            defaults: new { controller = "Home", action = "Index" });
                    });
                });
            }
            else
            {
                app.UseMvc(routes =>
                {
                    routes.MapRoute(
                        name: "default",
                        template: "{controller=Home}/{action=Index}/{id?}");

                    routes.MapSpaFallbackRoute(
                        name: "spa-fallback",
                        defaults: new { controller = "Home", action = "Index" });
                });
                app.UseExceptionHandler("/Home/Error");
            }
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
