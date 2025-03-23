using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace Renet.CoreCaptcha
{
    public interface ICoreCaptcha
    {
        Task<CoreCaptchaCreateResponse> CaptchaCreateAsync(ILogger log, string clientId, int size, IEnumerable<KeyValuePair<string, StringValues>> queryParam, string functionAppDirectory);

        HttpStatusCode CaptchaValidate(ILogger log, IEnumerable<KeyValuePair<string, StringValues>> queryParam);
    }
}