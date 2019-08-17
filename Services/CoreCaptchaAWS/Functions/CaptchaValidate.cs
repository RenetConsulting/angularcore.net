namespace CoreCaptchaAWS
{
    using Amazon.Lambda.APIGatewayEvents;
    using Amazon.Lambda.Core;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Renet.CoreCaptcha;
    using System.Net;

    public class CaptchaValidate : Function
    {
        public CaptchaValidate() : base()
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
