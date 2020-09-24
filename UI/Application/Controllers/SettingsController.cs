// <copyright file="SettingsController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System.Threading.Tasks;
    using Application.Business.CoreCaptcha;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : BaseController
    {
        private CoreCaptchaSettings CoreCaptchaSettings { get; set; }

        public SettingsController(IOptions<AppSettings> appSettings, IOptions<CoreCaptchaSettings> settings, ILogger<AccountController> logger)
            : base(appSettings, logger)
        {
            this.CoreCaptchaSettings = settings.Value;
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            var options = new
            {
                this.AppSettings.FacebookAppId,
                this.AppSettings.GoogleClientId,
                CoreCaptchaUrl = this.CoreCaptchaSettings.CreateUrl,
            };

            return await Task.FromResult(this.Ok(options));
        }
    }
}