namespace CoreCaptchaAWS
{
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using System;

    public abstract class Function
    {
        protected ILogger Logger { get; set; }

        protected IServiceProvider ServiceProvider { get; private set; }

        public Function()
        {
            Startup startup = new Startup();

            var services = new ServiceCollection();

            startup.ConfigureServices(services);

            this.ServiceProvider = services.BuildServiceProvider();

            Logger = this.ServiceProvider.GetRequiredService<ILogger<Function>>();
        }

        public Function(ILogger logger)
        {
            this.Logger = logger;
            //this.ServiceProvider = serviceProvider;
        }
    }
}
