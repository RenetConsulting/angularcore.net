namespace Renet.CoreCaptcha
{
    using System.Collections.Generic;
    using System.Net;

    public class CoreCaptchaCreateResponse
    {
        public CoreCaptchaCreateResponse()
        {
            Headers = new Dictionary<string, string>();
        }

        public CaptchaModel CaptchaModel { get; set; }

        public string BodyJson { get; set; } 

        public IDictionary<string, string> Headers { get; private set; }

        public HttpStatusCode StatusCode { get; set; }
    }
}
