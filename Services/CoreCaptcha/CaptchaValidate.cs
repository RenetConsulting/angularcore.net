using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace CoreCaptcha
{
    public static class CaptchaValidate
    {
        [FunctionName("CaptchaValidate")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string hash = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "hash", true) == 0)
                .Value;

            // parse query parameter
            string captcha = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "captcha", true) == 0)
                .Value;

            if (hash == null)
            {
                // Get request body
                dynamic data = await req.Content.ReadAsAsync<object>();
                hash = data?.name;
            }

            bool validate = Cryptor.ValidateHash(hash, captcha);
            return !validate
                ? req.CreateResponse(HttpStatusCode.BadRequest)
                : req.CreateResponse(HttpStatusCode.OK);
        }
    }
}
