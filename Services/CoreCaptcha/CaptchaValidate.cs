// <copyright file="CaptchaValidate.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace CoreCaptcha
{
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Host;

    public static class CaptchaValidate
    {
        /// <summary>
        /// Usage:
        /// http://localhost:7071/api/CaptchaValidate?hash=DTFZ9MGW9G601e8bc8bfd0739519b76742c711372194aa2b84af5f5531c8caca35bd359336&captcha=CVra&clientid=12345
        /// </summary>
        /// <param name="req"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        [FunctionName("CaptchaValidate")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("CaptchaValidate HTTP trigger function processed a request.");

            // parse query parameter
            string hash = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "hash", true) == 0)
                .Value;

            if (!string.IsNullOrEmpty(hash))
            {
                // parse query parameter
                string captcha = req.GetQueryNameValuePairs()
                    .FirstOrDefault(q => string.Compare(q.Key, "captcha", true) == 0)
                    .Value;

                if (!string.IsNullOrEmpty(captcha))
                {
                    // parse query parameter
                    string clientId = req.GetQueryNameValuePairs()
                    .FirstOrDefault(q => string.Compare(q.Key, "clientId", true) == 0)
                    .Value;

                    if (!string.IsNullOrEmpty(clientId))
                    {
                        bool validate = Cryptor.ValidateHash(hash, captcha, clientId);

                        return !validate
                            ? req.CreateResponse(HttpStatusCode.BadRequest)
                            : req.CreateResponse(HttpStatusCode.OK);
                    }
                }
            }

            return req.CreateResponse(HttpStatusCode.BadRequest);
        }
    }
}
