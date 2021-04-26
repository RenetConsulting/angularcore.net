// -----------------------------------------------------------------------
// <copyright file="CaptchaValidate.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------
namespace CoreCaptchaAWS
{
    using System.Net;
    using Amazon.Lambda.APIGatewayEvents;
    using Amazon.Lambda.Core;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Renet.CoreCaptcha;

    public class CaptchaValidate : Function
    {
        public CaptchaValidate()
            : base()
        {
            this.Logger = this.ServiceProvider.GetRequiredService<ILogger<CaptchaCreate>>();
        }

        public APIGatewayProxyResponse CaptchaValidateHandler(APIGatewayProxyRequest input, ILambdaContext context)
        {
            this.Logger.LogInformation("CaptchaValidateHandler trigger function processed a request.");

            ICoreCaptcha coreCaptcha = this.ServiceProvider.GetRequiredService<ICoreCaptcha>();

            HttpStatusCode response = coreCaptcha.CaptchaValidate(this.Logger, input?.QueryStringParameters);

            return new APIGatewayProxyResponse { StatusCode = (int)response };
        }
    }
}
