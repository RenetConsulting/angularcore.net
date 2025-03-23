namespace CoreCaptchaAzure
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.Functions.Worker;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Primitives;
    using Renet.CoreCaptcha;
    using System.Net;

    public class CaptchaValidate(ICoreCaptcha coreCaptcha, ILogger<CaptchaCreate> logger)
    {
        private readonly ILogger<CaptchaCreate> _logger = logger;

        private readonly ICoreCaptcha _coreCaptcha = coreCaptcha;

        [Function("CaptchaValidate")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
        {
            _logger.LogInformation("CaptchaValidate trigger function processed a request.");

            HttpStatusCode response = _coreCaptcha.CaptchaValidate(_logger, req.Query);

            req.HttpContext.Response.Headers.Append("Access-Control-Allow-Origin", "*");
            req.HttpContext.Response.Headers.Append("Access-Control-Allow-Credentials", "true");
            req.HttpContext.Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
            req.HttpContext.Response.Headers.Append("Access-Control-Allow-Headers", "Origin, Content-Type, Pragma, Cache-Control");

            return new StatusCodeResult((int)response);
        }
    }
}
