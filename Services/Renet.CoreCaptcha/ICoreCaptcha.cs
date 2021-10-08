using Microsoft.Extensions.Logging;
using Renet.CoreCaptcha.Enumerables;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace Renet.CoreCaptcha
{
    public interface ICoreCaptcha
    {
        Task<CoreCaptchaCreateResponse> CaptchaCreateAsync(ILogger log, string clientId, int size, IEnumerable<KeyValuePair<string, string>> queryParam, string functionAppDirectory, CoreCaptchaLanguage language);

        HttpStatusCode CaptchaValidate(ILogger log, IEnumerable<KeyValuePair<string, string>> queryParam);
    }
}