// -----------------------------------------------------------------------
// <copyright file="Startup.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------

[assembly: Microsoft.Azure.Functions.Extensions.DependencyInjection.FunctionsStartup(typeof(CoreCaptchaAzure.Startup))]

namespace CoreCaptchaAzure
{
    using System;
    using System.IO;
    using Microsoft.Azure.Functions.Extensions.DependencyInjection;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Renet.CoreCaptcha;

    public class Startup : FunctionsStartup
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
                loggingBuilder.AddAzureWebAppDiagnostics();

                // Do not add Debug. The local execution will failed. [loggingBuilder.AddDebug();]
            });

            services.AddScoped<ICoreCaptcha, CoreCaptcha>();

            // Add our Config object so it can be injected
            services.Configure<CoreCaptchaConfig>(this.Configuration.GetSection("CoreCaptcha"));
        }

        public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
        {
            FunctionsHostBuilderContext context = builder.GetContext();

            // Note that these files are not automatically copied on build or publish. 
            // See the csproj file to for the correct setup.
            builder.ConfigurationBuilder
                .SetBasePath(context.ApplicationRootPath)
                .AddJsonFile(Path.Combine(context.ApplicationRootPath, "appsettings.json"), optional: true, reloadOnChange: false)
                .AddJsonFile(Path.Combine(context.ApplicationRootPath, $"appsettings.{context.EnvironmentName}.json"), optional: true, reloadOnChange: false)
                .AddEnvironmentVariables();
        }

        public override void Configure(IFunctionsHostBuilder builder)
        {
            FunctionsHostBuilderContext context = builder.GetContext();
            this.Configuration = context.Configuration;
            this.ConfigureServices(builder.Services);
        }
    }
}