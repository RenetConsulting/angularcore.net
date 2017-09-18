namespace Application.Controllers
{
    using Application;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    public class BaseController : Controller
    {
        public BaseController(IOptions<AppSettings> appSettings)
        {
            this.AppSettings = appSettings.Value;
        }

        protected AppSettings AppSettings { get; private set; }
    }
}
