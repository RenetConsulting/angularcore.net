// <copyright file="CoreCaptchaFilter.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace CoreCaptcha
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    public class CoreCaptchaFilter : IAsyncResourceFilter, ICoreCaptcha
    {
        private const string ErrorCode = "InvalidCoreCaptcha";
        private readonly IConfiguration config;
        private readonly ILogger<CoreCaptchaFilter> logger;
        private readonly CoreCaptchaSettings coreCaptchaSettings;

        public CoreCaptchaFilter(
            IConfiguration config,
            ILogger<CoreCaptchaFilter> logger,
            IOptions<CoreCaptchaSettings> settings,
            string hash = "hash",
            string captcha = "captcha")
        {
            this.coreCaptchaSettings = settings.Value;
            this.Hash = hash;
            this.Captcha = captcha;
            this.config = config;
            this.logger = logger;

            if (this.coreCaptchaSettings == null ||
                string.IsNullOrEmpty(this.coreCaptchaSettings.ValidateUrl) ||
                string.IsNullOrEmpty(this.coreCaptchaSettings.ClientId))
            {
                string error = "Missing or invalid CoreCaptcha configuration.";
                logger.LogCritical(error);
                throw new ApplicationException(error);
            }
        }

        public virtual string Hash { get; set; }

        public virtual string Captcha { get; set; }

        public async Task OnResourceExecutionAsync(ResourceExecutingContext context, ResourceExecutionDelegate next)
        {
            this.CaptchaDataFromRequest(context.HttpContext.Request, out string hash, out string captcha);

            if (string.IsNullOrEmpty(hash) || string.IsNullOrEmpty(captcha))
            {
                context.Result = new BadRequestObjectResult(new { error = ErrorCode, errorDescription = "Missing captcha data" });
            }
            else
            {
                bool isValid = false;

                try
                {
                    isValid = await this.CaptchaValidate(hash, captcha);
                }
                catch (Exception)
                {
                    context.Result = new BadRequestObjectResult(new { error = ErrorCode, errorDescription = "Unable to validate Captcha" });
                    return;
                }

                if (isValid)
                {
                    await next();
                    return;
                }
                else
                {
                    context.Result = new BadRequestObjectResult(new { error = ErrorCode, errorDescription = "Invalid Captcha" });
                }
            }
        }

        public async Task<bool> CaptchaValidate(HttpRequest request)
        {
            this.CaptchaDataFromRequest(request, out string hash, out string captcha);

            return await this.CaptchaValidate(hash, captcha);
        }

        public async Task<bool> CaptchaValidate(string hash, string captcha)
        {
            if (string.IsNullOrEmpty(hash) || string.IsNullOrEmpty(captcha))
            {
                return false;
            }

            using (HttpClient client = new HttpClient())
            {
                string captchaValidate = string.Format(this.coreCaptchaSettings.ValidateUrl + "?hash={0}&captcha={1}&clientId={2}", hash, captcha, this.coreCaptchaSettings.ClientId);

                try
                {
                    HttpResponseMessage response = await client.GetAsync(captchaValidate);
                    if (response.IsSuccessStatusCode)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                catch (Exception ex)
                {
                    this.logger.LogError(ex, ex.Message);

                    throw;
                }
            }
        }

        internal void CaptchaDataFromRequest(HttpRequest req, out string hash, out string captcha)
        {
            hash = string.Empty;
            captcha = string.Empty;
            if (req.QueryString.HasValue)
            {
                hash = req.Query[this.Hash].FirstOrDefault();
                captcha = req.Query[this.Captcha].FirstOrDefault();
            }
            else
            {
                if (req.HasFormContentType)
                {
                    hash = req.Form[this.Hash].FirstOrDefault();
                    captcha = req.Form[this.Captcha].FirstOrDefault();
                }
            }
        }
    }
}
