// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: Amazon.Lambda.Core.LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
namespace CloudCoreCaptcha
{
    using Amazon.Lambda.APIGatewayEvents;
    using Amazon.Lambda.Core;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Renet.CoreCaptcha;
    using System;
    using System.Threading.Tasks;

    public class CaptchaCreate : Function
    {
        public CaptchaCreate() : base()
        {
            Logger = this.ServiceProvider.GetRequiredService<ILogger<CaptchaCreate>>();
        }

        public static readonly string ClientId = Environment.GetEnvironmentVariable("ClientId");

        [LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]
        public async Task<APIGatewayProxyResponse> CaptchaCreateHandler(APIGatewayProxyRequest input, ILambdaContext context)
        {
            Logger.LogInformation("CaptchaCreateHandler trigger function processed a request.");

            ICoreCaptcha coreCaptcha = this.ServiceProvider.GetRequiredService<ICoreCaptcha>();

            CoreCaptchaCreateResponse response = await coreCaptcha.CaptchaCreate(Logger, ClientId, 5, input?.QueryStringParameters);

            return new APIGatewayProxyResponse { Headers = response.Headers,  Body = response.Body, StatusCode = (int) response.StatusCode };
        }
    }
}
