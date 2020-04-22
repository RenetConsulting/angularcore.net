// -----------------------------------------------------------------------
// <copyright file="CaptchaCreate.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------
namespace CoreCaptchaAzure
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Renet.CoreCaptcha;

    public class CaptchaCreate
    {
        private readonly string clientId;

        private readonly ICoreCaptcha coreCaptcha;

        private readonly ILogger logger;

        private readonly IOptions<CoreCaptchaConfig> config;

        public CaptchaCreate(ICoreCaptcha coreCaptcha, ILogger<CaptchaCreate> logger, IOptions<CoreCaptchaConfig> config)
        {
            this.coreCaptcha = coreCaptcha;
            this.logger = logger;
            this.config = config;
            this.clientId = this.config.Value?.ClientId;
        }

        [FunctionName("CaptchaCreate")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = null)]HttpRequest req, ExecutionContext context)
        {
            this.logger.LogInformation("CaptchaCreateHandler trigger function processed a request.");

            CoreCaptchaCreateResponse response = await this.coreCaptcha.CaptchaCreateAsync(this.logger, this.clientId, 5, req.GetQueryParameterDictionary(), context.FunctionAppDirectory);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var headers = req.HttpContext.Response.Headers;
                foreach (var element in response.Headers)
                {
                    if (headers.ContainsKey(element.Key))
                    {
                        headers[element.Key] = element.Value;
                    }
                    else
                    {
                        headers.Add(element.Key, element.Value);
                    }
                }

                return new JsonResult(response.CaptchaModel) { StatusCode = (int)response.StatusCode };
            }
            else
            {
                return new StatusCodeResult((int)response.StatusCode);
            }
        }
    }
}
