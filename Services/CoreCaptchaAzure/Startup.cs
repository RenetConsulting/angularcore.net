//[assembly: Microsoft.Azure.WebJobs.Hosting.WebJobsStartup(typeof(CoreCaptchaAzure.Startup))]
[assembly: Microsoft.Azure.Functions.Extensions.DependencyInjection.FunctionsStartup(typeof(CoreCaptchaAzure.Startup))]
namespace CoreCaptchaAzure
{
    using Microsoft.Azure.Functions.Extensions.DependencyInjection;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Renet.CoreCaptcha;
    using System;

    public class Startup : FunctionsStartup //IWebJobsStartup
    {
        public Startup()
        {

        }
            public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

        public IConfiguration Configuration { get; private set; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConfiguration(this.Configuration.GetSection("Logging"));
                loggingBuilder.AddConsole();
//                loggingBuilder.AddDebug();
                loggingBuilder.AddAzureWebAppDiagnostics();
            });

            services.AddScoped<ICoreCaptcha, CoreCaptcha>();
        }

        //public void Configure(IWebJobsBuilder builder)
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var config = new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            this.Configuration = config.Build();

            this.ConfigureServices(builder.Services);
        }
    }
}