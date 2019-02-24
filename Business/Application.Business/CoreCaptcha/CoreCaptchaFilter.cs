// <copyright file="CoreCaptchaFilter.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.CoreCaptcha
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microsoft.Extensions.Configuration;

    public class CoreCaptchaFilter : IResourceFilter
    {
        private const string ErrorCode = "InvalidCoreCaptcha";
        private readonly IConfiguration config;

        public CoreCaptchaFilter(IConfiguration config)
        {
            this.Hash = "hash";
            this.Captcha = "captcha";
            this.config = config;
            if (this.config != null)
            {
                this.ValidateUrl = this.config.GetValue<string>("CoreCaptcha:ValidateUrl");
                this.ClientId = this.config.GetValue<string>("CoreCaptcha:ClientId");
            }
        }

        public virtual string Hash { get; set; }

        public virtual string Captcha { get; set; }

        public virtual string ValidateUrl { get; set; }

        public virtual string ClientId { get; set; }

        public void OnResourceExecuted(ResourceExecutedContext context)
        {
        }

        public void OnResourceExecuting(ResourceExecutingContext context)
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
                    string captchaValidate = string.Format(this.ValidateUrl + "?hash={0}&captcha={1}&clientId={2}", hash, captcha, this.ClientId);

                    try
                    {
                        HttpResponseMessage response = client.GetAsync(captchaValidate).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            return;
                        }
                        else
                        {
                            context.Result = new BadRequestObjectResult(new { error = ErrorCode, errorDescription = "Invalid Captcha" });
                        }
                    }
                    catch (Exception ex)
                    {
                        if (ex is HttpRequestException || ex is AggregateException)
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
