using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Renet.CoreCaptcha;
using System.Reflection;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureAppConfiguration((context, builder) =>
    {
        var assemblyLocation = Assembly.GetExecutingAssembly().Location;
        var path = Path.GetFullPath(Path.GetDirectoryName(assemblyLocation) ?? string.Empty);

        builder
              .SetBasePath(path)
              .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
              .AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: false)
              .AddEnvironmentVariables();

        context.Configuration = builder.Build(); // Set the configuration for the context
    })
    .ConfigureServices((context, services) =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddScoped<ICoreCaptcha, CoreCaptcha>();
        services.Configure<CoreCaptchaConfig>(context.Configuration.GetSection("CoreCaptcha"));
    })
    .Build();

host.Run();
