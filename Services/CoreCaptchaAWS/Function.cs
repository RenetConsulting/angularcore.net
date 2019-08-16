namespace CloudCoreCaptcha
{
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;

    public abstract class Function
    {
        protected ILogger Logger { get; set; }

        protected ServiceProvider ServiceProvider { get; private set; }

        public Function()
        {
            Startup startup = new Startup();

            var services = new ServiceCollection();

            startup.ConfigureServices(services);

            this.ServiceProvider = services.BuildServiceProvider(); 

            Logger  = this.ServiceProvider.GetRequiredService<ILogger<Function>>();
            
        }
    }
}
