// -----------------------------------------------------------------------
// <copyright file="CaptchaValidate.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------
namespace CoreCaptchaAzure
{
    using System.Net;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Extensions.Logging;
    using Renet.CoreCaptcha;

    public class CaptchaValidate
    {
        private readonly ICoreCaptcha coreCaptcha;

        private readonly ILogger logger;

        public CaptchaValidate(ICoreCaptcha coreCaptcha, ILogger<CaptchaCreate> logger)
        {
            this.coreCaptcha = coreCaptcha;
            this.logger = logger;
        }

        [FunctionName("CaptchaValidate")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]HttpRequest req)
        {
            this.logger.LogInformation("CaptchaValidate trigger function processed a request.");

            HttpStatusCode response = this.coreCaptcha.CaptchaValidate(this.logger, req.GetQueryParameterDictionary());

            return new StatusCodeResult((int)response);
        }
    }
}
