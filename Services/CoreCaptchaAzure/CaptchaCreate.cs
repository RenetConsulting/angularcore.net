
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;
using Renet.CoreCaptcha;
using System;
using System.Threading.Tasks;

namespace CoreCaptchaAzure
{
    public  class CaptchaCreate
    {
        ICoreCaptcha CoreCaptcha { get; set; }

        ILogger Logger { get; set; }

        public CaptchaCreate(ICoreCaptcha coreCaptcha, ILogger<CaptchaCreate> logger)
        {
            this.CoreCaptcha = coreCaptcha;
            this.Logger = logger;
        }

        public static readonly string ClientId = Environment.GetEnvironmentVariable("ClientId");

        [FunctionName("CaptchaCreate")]
        public async  Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]HttpRequest req, ExecutionContext context)
        {

            this.Logger.LogInformation("CaptchaCreateHandler trigger function processed a request.");
            
            CoreCaptchaCreateResponse response = await this.CoreCaptcha.CaptchaCreate(Logger, ClientId, 5, req.GetQueryParameterDictionary(), context.FunctionAppDirectory);

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                foreach (var element in response.Headers)
                {
                    req.HttpContext.Response.Headers.Add(element.Key, element.Value);
                }

                return new OkObjectResult(response.Body);
            }
            else
            {
                return new StatusCodeResult((int)response.StatusCode);
            }
        }
    }
}
