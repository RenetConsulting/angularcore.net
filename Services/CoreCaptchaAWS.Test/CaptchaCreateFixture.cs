namespace CoreCaptchaAWS.Test
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Amazon.Lambda.APIGatewayEvents;
    using Amazon.Lambda.Core;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Moq;
    using Renet.CoreCaptcha;
    using Xunit;

    public class CaptchaCreateFixture
    {
        [Fact]
        public async Task CaptchaCreateTest()
        {
            Mock<IServiceProvider> serviceProviderMock = new Mock<IServiceProvider>();

            Mock<ILogger> loggerMock = new Mock<ILogger>();

            Mock<ICoreCaptcha> coreCaptchaMock = new Mock<ICoreCaptcha>();

            Mock<ILambdaContext> lambdaContextMock = new Mock<ILambdaContext>();

            Func<ICoreCaptcha> func = () => coreCaptchaMock.Object;

            CaptchaCreate captchaCreate = new CaptchaCreate(func, loggerMock.Object);

            APIGatewayProxyRequest input = new APIGatewayProxyRequest();

            CoreCaptchaCreateResponse responseMock = new CoreCaptchaCreateResponse
            {
                BodyJson = "{}",
                StatusCode = System.Net.HttpStatusCode.OK
            };

            // Setup Moq
            coreCaptchaMock.Setup(x => x.CaptchaCreateAsync(loggerMock.Object, null, 5, null, Directory.GetCurrentDirectory()))
                .Returns(Task.FromResult(responseMock)).Verifiable();

            var result = await captchaCreate.CaptchaCreateHandler(input, lambdaContextMock.Object);

            // Verify logger
            loggerMock.Verify(l => l.Log(LogLevel.Information,
                0,
                It.IsAny<Microsoft.Extensions.Logging.Internal.FormattedLogValues>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<object, Exception, string>>()));

            Assert.Equal(result.Body, responseMock.BodyJson);

        }
    }

}

