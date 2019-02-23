// <copyright file="CoreCaptchaAttribute.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Helpers
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;

    [AttributeUsage(AttributeTargets.Method)]
    public class CoreCaptchaAttribute : Attribute, IResourceFilter
    {
        public CoreCaptchaAttribute()
        {
            this.Hash = "hash";
            this.Captcha = "captcha";
            Console.WriteLine("CoreCaptchaAttribute called");
        }

        public CoreCaptchaAttribute(string hash, string captcha)
        {
            this.Hash = hash;
            this.Captcha = captcha;
        }

        public virtual string Hash { get; set; }

        public virtual string Captcha { get; set; }

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
                context.Result = new BadRequestObjectResult(new { error= "InvalidRequest", errorDescription = "Missing captcha data" });
            }
            else
            {
                // Validate Captcha
                using (HttpClient client = new HttpClient())
                {
                    string captchaValidate = string.Format("http://localhost:7071/api/CaptchaValidate?hash={0}&captcha={1}&clientId={2}", hash, captcha, "12345");

                    try
                    {
                        HttpResponseMessage response = client.GetAsync(captchaValidate).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            return;
                        }
                        else
                        {
                            context.Result = new BadRequestObjectResult(new { error = "InvalidRequest", errorDescription = "Invalid Captcha" });
                        }
                    }
                    catch (Exception ex)
                    {
                        if (ex is HttpRequestException || ex is AggregateException)
                        {
                            context.Result = new BadRequestObjectResult(new { error = "InvalidRequest", errorDescription = "Unable to validate Captcha" });
                            return;
                        }

                        throw;
                    }
                }
            }
        }
    }
}
