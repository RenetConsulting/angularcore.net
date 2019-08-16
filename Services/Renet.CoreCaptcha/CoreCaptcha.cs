namespace Renet.CoreCaptcha
{
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;

    public class CoreCaptcha : ICoreCaptcha
    {
        private enum ImageDimention
        {
            Width,
            Height
        }

        private readonly int DefaultWidth = 180;
        private readonly int DefaultHeight = 40;

        public async Task<CoreCaptchaCreateResponse> CaptchaCreate(ILogger log, string clientId, int size, IEnumerable<KeyValuePair<string, string>> queryParam)
        {
            CoreCaptchaCreateResponse response = new CoreCaptchaCreateResponse();

            int width = ImageSize(queryParam, ImageDimention.Width, DefaultWidth);
            int height = ImageSize(queryParam, ImageDimention.Height, DefaultHeight);


            var captchaCode = Captcha.GenerateCaptchaCode(size);

            var result = Captcha.GenerateCaptchaImage(width, height, captchaCode, log);

            Stream captchaStream = new MemoryStream(result.CaptchaByteData);
            string imageHeader = "data:image/png;base64,";
            string soundHeader = "data:audio/mp3;base64,";

            CaptchaModel model = new CaptchaModel
            {
                Image = imageHeader + Convert.ToBase64String(result.CaptchaByteData)
            };

            var hash = Cryptor.ComputeHashWithSalt(captchaCode, clientId);
            model.Hash = hash;

            CaptchaSoundMp3 captchaSoundMp3 = new CaptchaSoundMp3();
            byte[] soundData = await captchaSoundMp3.GenerateCaptchaSound(captchaCode, Directory.GetCurrentDirectory());

            model.Sound = soundHeader + Convert.ToBase64String(soundData);

            response.StatusCode = HttpStatusCode.OK;

            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Credentials", "true");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Origin, Content-Type, Pragma, Cache-Control");

            JsonSerializerSettings formatter = new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                },
                Formatting = Formatting.Indented
            };

            response.Body = JsonConvert.SerializeObject(model, formatter);

            return response;
        }

        private static int ImageSize(IEnumerable<KeyValuePair<string, string>> queryParam, ImageDimention size, int absence)
        {
            string sizeValue = queryParam?
               .FirstOrDefault(q => string.Compare(q.Key, size.ToString(), true) == 0)
               .Value;

            if (!int.TryParse(sizeValue, out int propery))
            {
                propery = absence;
            }

            if (propery < 10 || propery > 500)
            {
                propery = absence;
            }

            return propery;
        }

        public HttpStatusCode CaptchaValidate(ILogger log, IEnumerable<KeyValuePair<string, string>> queryParam)
        {
            HttpStatusCode httpStatusCode = HttpStatusCode.BadRequest;

            // parse query parameter
            string hash = queryParam?
                .FirstOrDefault(q => string.Compare(q.Key, "hash", true) == 0)
                .Value;

            if (!string.IsNullOrEmpty(hash))
            {
                // parse query parameter
                string captcha = queryParam?
                    .FirstOrDefault(q => string.Compare(q.Key, "captcha", true) == 0)
                    .Value;

                if (!string.IsNullOrEmpty(captcha))
                {
                    // parse query parameter
                    string clientId = queryParam?
                    .FirstOrDefault(q => string.Compare(q.Key, "clientId", true) == 0)
                    .Value;

                    if (!string.IsNullOrEmpty(clientId))
                    {
                        bool validate = Cryptor.ValidateHash(hash, captcha, clientId);

                        if (validate)
                        {
                            httpStatusCode = HttpStatusCode.OK;
                        }
                        else
                        {
                            log.LogDebug("hash is invalid");
                        }
                    }
                    else
                    {
                        log.LogDebug("clientId is null");
                    }
                }
                else
                {
                    log.LogDebug("captcha is null");
                }
            }
            else
            {
                log.LogDebug("hash is null");
            }

            return httpStatusCode;
        }
    }
}
