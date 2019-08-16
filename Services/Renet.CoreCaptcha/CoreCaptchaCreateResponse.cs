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

        public string Body { get; set; }

        public IDictionary<string, string> Headers { get; private set; }

        public HttpStatusCode StatusCode { get; set; }
    }
}
