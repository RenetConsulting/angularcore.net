using System;
using System.Collections.Generic;
using System.Text;

namespace Renet.CoreCaptcha
{
    public class CoreCaptchaConfig
    {
        public string ClientId { get; set; }
        
        public string CreateUrl { get; set; }

        public string ValidateUrl { get; set; }
    }
}
