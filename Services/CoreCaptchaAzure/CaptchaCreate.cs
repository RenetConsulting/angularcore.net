namespace CoreCaptchaAzure
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.Functions.Worker;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Extensions.Primitives;
    using Renet.CoreCaptcha;
    using System.Reflection;

    public class CaptchaCreate(ICoreCaptcha coreCaptcha, ILogger<CaptchaCreate> logger, IOptions<CoreCaptchaConfig> config)
    {
        private readonly ILogger<CaptchaCreate> _logger = logger;

        private readonly ICoreCaptcha _coreCaptcha = coreCaptcha;

        private readonly string? _clientId = config.Value?.ClientId;

        [Function("CaptchaCreate")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "options")] HttpRequest req)
        {
            _logger.LogInformation("CaptchaCreateHandler trigger function processed a request.");

            var assemblyLocation = Assembly.GetExecutingAssembly().Location;
            var path = Path.GetFullPath(Path.GetDirectoryName(assemblyLocation) ?? string.Empty);

            _logger.LogInformation("Function Path: {Path}", path);

            CoreCaptchaCreateResponse response = await _coreCaptcha.CaptchaCreateAsync(_logger, _clientId, 5, req.Query, path);

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
                        headers.Append(element.Key, element.Value);
                    }
                }

                return new JsonResult(response.CaptchaModel) { StatusCode = (int)response.StatusCode };
            }
            else
            {
                return new StatusCodeResult((int)response.StatusCode);
            }
        }

        public static IDictionary<string, string?> GetQueryParameterDictionary(HttpRequest request)
        {
            return request.Query.ToDictionary((KeyValuePair<string, StringValues> p) => p.Key, (KeyValuePair<string, StringValues> p) => p.Value.LastOrDefault());
        }
    }
}
