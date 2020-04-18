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
        Mock<IServiceProvider> serviceProviderMock;

        Mock<ILogger> loggerMock;

        Mock<ICoreCaptcha> coreCaptchaMock;

        Mock<ILambdaContext> lambdaContextMock;

        Func<ICoreCaptcha> func;

        CaptchaCreate captchaCreate;

        APIGatewayProxyRequest input;

        CoreCaptchaCreateResponse responseMock;

        public CaptchaCreateFixture()
        {
            serviceProviderMock = new Mock<IServiceProvider>();

            loggerMock = new Mock<ILogger>();

            coreCaptchaMock = new Mock<ICoreCaptcha>();

            lambdaContextMock = new Mock<ILambdaContext>();

            func = () => coreCaptchaMock.Object;

            captchaCreate = new CaptchaCreate(func, loggerMock.Object);

            responseMock = new CoreCaptchaCreateResponse
            {
                BodyJson = "{}",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        [Fact]
        public void CaptchaCreateTest_Constructor()
        {
            var captchaCreate = new CaptchaCreate();

            Assert.NotNull(captchaCreate);
        }
        [Fact]
        public async Task CaptchaCreateTest_APIGatewayProxyRequestIsNull()
        {
            input = null;

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
        [Fact]
        public async Task CaptchaCreateTest_APIGatewayProxyRequestIsSet()
        {
            input = new APIGatewayProxyRequest() ;

            // Setup Moq
            coreCaptchaMock.Setup(x => x.CaptchaCreateAsync(loggerMock.Object, null, 5, input.QueryStringParameters, Directory.GetCurrentDirectory()))
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

