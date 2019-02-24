// <copyright file="CoreCaptchaFilter.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.CoreCaptcha
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;

    public class CoreCaptchaFilter : IAsyncResourceFilter
    {
        private const string ErrorCode = "InvalidCoreCaptcha";
        private readonly IConfiguration config;
        private readonly ILogger<CoreCaptchaFilter> logger;
        private readonly CoreCaptchaSettings coreCaptchaSettings;

        public CoreCaptchaFilter(IConfiguration config, ILogger<CoreCaptchaFilter> logger)
        {
            this.Hash = "hash";
            this.Captcha = "captcha";
            this.config = config;
            this.logger = logger;

            if (this.config != null)
            {
                this.coreCaptchaSettings = this.config.GetSection("CoreCaptcha").Get<CoreCaptchaSettings>();
            }

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
            var req = context.HttpContext.Request;
            string hash = string.Empty;
            string captcha = string.Empty;

            if (req.HasFormContentType)
            {
                hash = req.Form[this.Hash].FirstOrDefault();
                captcha = req.Form[this.Captcha].FirstOrDefault();
            }
            else
            {
                if (req.QueryString.HasValue)
                {
                    hash = req.Query[this.Hash].FirstOrDefault();
                    captcha = req.Query[this.Captcha].FirstOrDefault();
                }
            }

            if (string.IsNullOrEmpty(hash) || string.IsNullOrEmpty(captcha))
            {
                context.Result = new BadRequestObjectResult(new { error = ErrorCode, errorDescription = "Missing captcha data" });
            }
            else
            {
                // Validate Captcha
                using (HttpClient client = new HttpClient())
                {
                    string captchaValidate = string.Format(this.coreCaptchaSettings.ValidateUrl + "?hash={0}&captcha={1}&clientId={2}", hash, captcha, this.coreCaptchaSettings.ClientId);

                    try
                    {
                        HttpResponseMessage response = await client.GetAsync(captchaValidate);
                        if (response.IsSuccessStatusCode)
                        {
                            await next();
                            return;
                        }
                        else
                        {
                            context.Result = new BadRequestObjectResult(new { error = ErrorCode, errorDescription = "Invalid Captcha" });
                        }
                    }
                    catch (Exception ex)
                    {
                        this.logger.LogError(ex, ex.Message);

                        if (ex is HttpRequestException || ex is AggregateException || ex is InvalidOperationException)
                        {
                            context.Result = new BadRequestObjectResult(new { error = ErrorCode, errorDescription = "Unable to validate Captcha" });
                            return;
                        }

                        throw;
                    }
                }
            }
        }
    }
}
