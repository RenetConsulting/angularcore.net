using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace CoreCaptcha
{
    public static class CaptchaGet
    {
        [FunctionName("CaptchaGet")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string name = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
                .Value;

            if (name == null)
            {
                // Get request body
                dynamic data = await req.Content.ReadAsAsync<object>();
                name = data?.name;
            }

            //return name == null
            //    ? req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
            //    : req.CreateResponse(HttpStatusCode.OK, "Hello " + name);

            int width = 200;
            int height = 60;
            var captchaCode = CSCaptchaCodeASPNETCore.Captcha.GenerateCaptchaCode();

            var result = CSCaptchaCodeASPNETCore.Captcha.GenerateCaptchaImage(width, height, captchaCode);


            Stream s = new MemoryStream(result.CaptchaByteData);

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Content = new StreamContent(s);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");
            //var salt = Cryptor.RandomString(10);
            var hash = Cryptor.ComputeHashWithSalt(captchaCode);

            response.Content.Headers.Add("Captcha", hash);
            return response;

            //res.Content = new FileStreamResult(s, "image/png");
            //return new FileStreamResult(s, "image/png");

            //return new FileContentResult(result.CaptchaByteData, "image/png");
        }
    }
}
