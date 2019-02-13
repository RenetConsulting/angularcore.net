using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json.Serialization;

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
            string imageHeader = "data:image/png;base64,";
            string soundHeader = "data:audio/x-wav;base64,";

            CaptchaModel model = new CaptchaModel();
            model.Image = imageHeader + Convert.ToBase64String(result.CaptchaByteData);

            var hash = Cryptor.ComputeHashWithSalt(captchaCode, ClientId);
            model.Hash = hash;

            //CaptchaSound sound = new CaptchaSound();
            //try
            //{
            //    var soundData = sound.GenerateCaptchaSound(captchaCode);

            //    model.Sound = soundHeader + Convert.ToBase64String(soundData);
            //}
            //catch (Exception ex)
            //{
            //    log.Error(ex.Message, ex);
            //    throw;
            //}

            MediaTypeFormatter formatter = new JsonMediaTypeFormatter
            {
                SerializerSettings =
                    {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                    }
            };

            var response = req.CreateResponse(HttpStatusCode.OK, model, formatter, "application/json");

            response.Content.Headers.Add("Access-Control-Allow-Origin", "*");

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
