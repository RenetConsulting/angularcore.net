// -----------------------------------------------------------------------
// <copyright file="EmailSend.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------
namespace EmailAWS.Functions
{
    using System;
    using System.IO;
    using System.Net;
    using System.Threading.Tasks;
    using Amazon.Lambda.APIGatewayEvents;
    using Amazon.Lambda.Core;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;

    public class EmailSend : Function
    {
        public static readonly string ClientId = Environment.GetEnvironmentVariable("ClientId");

        private Func<IEmail> serviceProviderDelegate;

        public EmailSend()
            : base()
        {
            this.Logger = this.ServiceProvider.GetRequiredService<ILogger<EmailSend>>();
            this.serviceProviderDelegate = this.ServiceProvider.GetRequiredService<IEmail>;
        }

        public EmailSend(Func<IEmail> serviceProvider, ILogger logger)
            : base(logger)
        {
            this.serviceProviderDelegate = serviceProvider;
        }

        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public async Task<APIGatewayProxyResponse> CaptchaCreateHandler(APIGatewayProxyRequest input, ILambdaContext context)
        {
            this.Logger.LogInformation("EmailSendHandler trigger function processed a request.");

            IEmail coreCaptcha = this.serviceProviderDelegate();

            IMessage json = JsonConvert.DeserializeObject<IMessage>(input?.Body);

            Message message = new Message(json);

            HttpStatusCode response = await coreCaptcha.SendEmailAsync(this.Logger, ClientId, message);

            return new APIGatewayProxyResponse { StatusCode = (int)response };
        }
    }
}
