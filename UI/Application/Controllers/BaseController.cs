// <copyright file="BaseController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using Application;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    [ApiController]
    public class BaseController : ControllerBase
    {
        public BaseController(IOptions<AppSettings> appSettings, ILogger logger)
        {
            this.AppSettings = appSettings.Value;
            this.Logger = logger;
        }

        protected AppSettings AppSettings { get; private set; }

        protected ILogger Logger { get; private set; }
    }
}
