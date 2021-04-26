// -----------------------------------------------------------------------
// <copyright file="Function.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------
namespace CoreCaptchaAWS
{
    using System;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;

    public abstract class Function
    {
        public Function()
        {
            Startup startup = new Startup();

            var services = new ServiceCollection();

            startup.ConfigureServices(services);

            this.ServiceProvider = services.BuildServiceProvider();

            this.Logger = this.ServiceProvider.GetRequiredService<ILogger<Function>>();
        }

        public Function(ILogger logger)
        {
            this.Logger = logger;
        }

        protected ILogger Logger { get; set; }

        protected IServiceProvider ServiceProvider { get; private set; }
    }
}
