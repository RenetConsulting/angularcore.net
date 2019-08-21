using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Renet.CoreCaptcha;
using System;
using System.Net;

namespace CoreCaptchaAzure
{
    public  class CaptchaValidate
    {
        ICoreCaptcha CoreCaptcha { get; set; }

        ILogger Logger { get; set; }

        public CaptchaValidate(ICoreCaptcha coreCaptcha, ILogger<CaptchaCreate> logger)
        {
            this.CoreCaptcha = coreCaptcha;
            this.Logger = logger;
        }

        public static readonly string ClientId = Environment.GetEnvironmentVariable("ClientId");

        [FunctionName("CaptchaValidate")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]HttpRequest req)
        {
            this.Logger.LogInformation("CaptchaValidate trigger function processed a request.");

            HttpStatusCode response = this.CoreCaptcha.CaptchaValidate(Logger, req.GetQueryParameterDictionary());

            return new StatusCodeResult((int)response);
        }
    }
}
