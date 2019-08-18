using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace Renet.CoreCaptcha
{
    public interface ICoreCaptcha
    {
        Task<CoreCaptchaCreateResponse> CaptchaCreate(ILogger log, string clientId, int size, IEnumerable<KeyValuePair<string, string>> queryParam, string functionAppDirectory);

        HttpStatusCode CaptchaValidate(ILogger log, IEnumerable<KeyValuePair<string, string>> queryParam);
    }
}