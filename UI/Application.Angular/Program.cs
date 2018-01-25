using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application
{
    using System;
    using Application.DataAccess;
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;

    public class Program
    {
        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);

            //using (var scope = host.Services.CreateScope())
            //{
            //    var services = scope.ServiceProvider;

            //    using (var context = services.GetService<DataContext>())
            //    {
            //        try
            //        {
            //            context.Database.Migrate();

            //            ApplicationInitializer applicationInitializer = services.GetService<ApplicationInitializer>();

            //            int appresult = applicationInitializer.Initialize().Result;

            //            int result = context.Initialize().Result;
            //        }
            //        catch (Exception ex)
            //        {
            //            var logger = services.GetRequiredService<ILogger<Program>>();
            //            logger.LogCritical(1000, ex, ex.Message);
            //        }
            //    }
            //}

            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
