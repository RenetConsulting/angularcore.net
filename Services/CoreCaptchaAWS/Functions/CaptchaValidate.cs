namespace AwsCoreCaptcha
{
    using Amazon.Lambda.APIGatewayEvents;
    using Amazon.Lambda.Core;
    using CloudCoreCaptcha;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Renet.CoreCaptcha;
    using System;
    using System.IO;
    using System.Net;
    using System.Threading.Tasks;

    public class CapchaValidate : Function
    {
        public CapchaValidate() : base()
        {
            Logger = this.ServiceProvider.GetRequiredService<ILogger<CaptchaCreate>>();
        }

        public APIGatewayProxyResponse CaptchaValidateHandler(APIGatewayProxyRequest input, ILambdaContext context)
        {
            Logger.LogInformation("CaptchaValidateHandler trigger function processed a request.");

            ICoreCaptcha coreCaptcha = this.ServiceProvider.GetRequiredService<ICoreCaptcha>();

            HttpStatusCode response = coreCaptcha.CaptchaValidate(Logger, input?.QueryStringParameters);

            return new APIGatewayProxyResponse { StatusCode = (int)response };
        }
    }
}
