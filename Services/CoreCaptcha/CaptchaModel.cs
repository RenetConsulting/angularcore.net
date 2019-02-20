namespace CoreCaptcha
{
    using System.Web.Script.Serialization;

    public class CaptchaModel
    {
        public string Image { get; set; }
        public string Sound { get; set; }
        public string Hash { get; set; }

        public string ToJson()
        {
            return new JavaScriptSerializer().Serialize(this);
        }
    }
}
