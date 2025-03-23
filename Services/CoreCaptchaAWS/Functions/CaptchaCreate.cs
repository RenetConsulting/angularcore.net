// -----------------------------------------------------------------------
// <copyright file="CaptchaCreate.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------
namespace CoreCaptchaAWS.Functions
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Amazon.Lambda.APIGatewayEvents;
    using Amazon.Lambda.Core;
    using CoreCaptchaAWS;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Renet.CoreCaptcha;

    public class CaptchaCreate : Function
    {
        public static readonly string ClientId = Environment.GetEnvironmentVariable("ClientId");

        private readonly Func<ICoreCaptcha> serviceProviderDelegate;

        public CaptchaCreate()
            : base()
        {
            this.Logger = this.ServiceProvider.GetRequiredService<ILogger<CaptchaCreate>>();
            this.serviceProviderDelegate = this.ServiceProvider.GetRequiredService<ICoreCaptcha>;
        }

        public CaptchaCreate(Func<ICoreCaptcha> serviceProvider, ILogger logger)
            : base(logger)
        {
            this.serviceProviderDelegate = serviceProvider;
        }

        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public async Task<APIGatewayProxyResponse> CaptchaCreateHandler(APIGatewayProxyRequest input, ILambdaContext context)
        {
            this.Logger.LogInformation("CaptchaCreateHandler trigger function processed a request.");

            ICoreCaptcha coreCaptcha = this.serviceProviderDelegate();
            var queryParam = input?.QueryStringParameters?.ToStringValuesEnumerable();
            CoreCaptchaCreateResponse response = await coreCaptcha.CaptchaCreateAsync(this.Logger, ClientId, 5, queryParam, Directory.GetCurrentDirectory());

            return new APIGatewayProxyResponse { Headers = response.Headers, Body = response.BodyJson, StatusCode = (int)response.StatusCode };
        }
    }
}
