using System;
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
    public static class CaptchaCreate
    {
        public static readonly string ClientId = Environment.GetEnvironmentVariable("ClientId");
        private static readonly int DefaultWidth = 180;
        private static readonly int DefaultHeight = 40;

        [FunctionName("CaptchaCreate")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("CaptchaGet HTTP trigger function processed a request.");

            // parse query parameter
            int width = ImageWidth(req);
            int height = ImageHeight(req);

            var captchaCode = CSCaptchaCodeASPNETCore.Captcha.GenerateCaptchaCode(5);

            var result = CSCaptchaCodeASPNETCore.Captcha.GenerateCaptchaImage(width, height, captchaCode);


            Stream captchaStream = new MemoryStream(result.CaptchaByteData);

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Content = new StreamContent(captchaStream);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");

            var hash = Cryptor.ComputeHashWithSalt(captchaCode, ClientId);
            response.Content.Headers.Add("Captcha", hash);

            return response;
        }

        private static int ImageWidth(HttpRequestMessage req)
        {
            string widthValue = req.GetQueryNameValuePairs()
               .FirstOrDefault(q => string.Compare(q.Key, "width", true) == 0)
               .Value;

            if (!int.TryParse(widthValue, out int width))
            {
                width = DefaultWidth;
            }

            if (width < 10 || width > 500)
            {
                width = DefaultWidth;
            }

            return width;
        }

        private static int ImageHeight(HttpRequestMessage req)
        {
            string widthValue = req.GetQueryNameValuePairs()
               .FirstOrDefault(q => string.Compare(q.Key, "height", true) == 0)
               .Value;

            if (!int.TryParse(widthValue, out int height))
            {
                height = DefaultHeight;
            }

            if (height < 10 || height > 500)
            {
                height = DefaultHeight;
            }

            return height;
        }
    }
}
