namespace Application.Controllers
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Http.Features;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.NodeServices;
    using Microsoft.AspNetCore.SpaServices.Prerendering;
    using Microsoft.Extensions.DependencyInjection;

    public class HomeController : Controller
    {
        [ResponseCache(VaryByHeader = "User-Agent", Duration = 180)]
        public async Task<IActionResult> Index()
        {
            var requestFeature = this.Request.HttpContext.Features.Get<IHttpRequestFeature>();
            var unencodedPathAndQuery = requestFeature.RawTarget;
            return await this.BuildPage(unencodedPathAndQuery);
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 180)]
        public async Task<IActionResult> Error()
        {
            return await this.BuildPage("/not-found");
        }

        public async Task<IActionResult> BuildPage(string unencodedPathAndQuery)
        {
            var nodeServices = this.Request.HttpContext.RequestServices.GetRequiredService<INodeServices>();
            var hostEnv = this.Request.HttpContext.RequestServices.GetRequiredService<IHostingEnvironment>();

            var applicationBasePath = hostEnv.ContentRootPath;
            var unencodedAbsoluteUrl = $"{this.Request.Scheme}://{this.Request.Host}{unencodedPathAndQuery}";

            // ** TransferData concept **
            // Here we can pass any Custom Data we want !

            // By default we're passing down Cookies, Headers, Host from the Request object here
            TransferData transferData = new TransferData();
            transferData.request = this.AbstractHttpContextRequestInfo(this.Request);
            transferData.thisCameFromDotNET = "Hi Angular it's asp.net :)";

            // Add more customData here, add it to the TransferData class
            try
            {
                // Prerender / Serialize application (with Universal)
                var prerenderResult = await Prerenderer.RenderToString(
                    "/",
                    nodeServices,
                    new JavaScriptModuleExport(applicationBasePath + "/ClientApp/dist/main-server"),
                    unencodedAbsoluteUrl,
                    unencodedPathAndQuery,
                    transferData, // Our simplified Request object & any other CustommData you want to send!
                    30000,
                    this.Request.PathBase.ToString());

                this.ViewData["SpaHtml"] = prerenderResult.Html; // our <app> from Angular

                if (!Equals(prerenderResult.Globals, null))
                {
                    this.ViewData["Title"] = prerenderResult.Globals["title"]; // set our <title> from Angular
                    this.ViewData["Styles"] = prerenderResult.Globals["styles"]; // put styles in the correct place
                    this.ViewData["Meta"] = prerenderResult.Globals["meta"]; // set our <meta> SEO tags
                    this.ViewData["Links"] = prerenderResult.Globals["links"]; // set our <link rel="canonical"> etc SEO tags
                    this.ViewData["TransferData"] = prerenderResult.Globals["transferData"]; // our transfer data set to window.TRANSFER_CACHE = {};
                }
            }
            catch (Exception ex)
            {
            }

            return this.View();
        }

        private IRequest AbstractHttpContextRequestInfo(HttpRequest request)
        {
            IRequest requestSimplified = new IRequest();
            requestSimplified.cookies = request.Cookies;
            requestSimplified.headers = request.Headers;
            requestSimplified.host = request.Host;

            return requestSimplified;
        }
    }

    public class IRequest
    {
        public object cookies { get; set; }

        public object headers { get; set; }

        public object host { get; set; }
    }

    public class TransferData
    {
        public dynamic request { get; set; }

        // Your data here ?
        public object thisCameFromDotNET { get; set; }
    }
}
