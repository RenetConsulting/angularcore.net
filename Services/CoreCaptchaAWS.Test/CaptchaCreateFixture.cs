namespace CoreCaptchaAWS.Test
{
    using Amazon.Lambda.APIGatewayEvents;
    using Amazon.Lambda.Core;
    using CoreCaptchaAWS.Functions;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Primitives;
    using Moq;
    using Renet.CoreCaptcha;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using Xunit;

    public class CaptchaCreateFixture
    {
        private readonly Mock<ILogger> loggerMock;

        private readonly Mock<ICoreCaptcha> coreCaptchaMock;

        private readonly Mock<ILambdaContext> lambdaContextMock;

        private readonly Func<ICoreCaptcha> func;

        private readonly CaptchaCreate captchaCreate;

        private APIGatewayProxyRequest input;

        private readonly CoreCaptchaCreateResponse responseMock;

        public CaptchaCreateFixture()
        {
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

            Assert.Equal(result.Body, responseMock.BodyJson);
        }
        [Fact]
        public async Task CaptchaCreateTest_APIGatewayProxyRequestIsSet()
        {
            input = new APIGatewayProxyRequest() ;

            // Setup Moq
            coreCaptchaMock.Setup(x => x.CaptchaCreateAsync(loggerMock.Object, null, 5, It.IsAny<IEnumerable<KeyValuePair<string, StringValues>>>(), Directory.GetCurrentDirectory()))
                .Returns(Task.FromResult(responseMock)).Verifiable();

            var result = await captchaCreate.CaptchaCreateHandler(input, lambdaContextMock.Object);

            Assert.Equal(result.Body, responseMock.BodyJson);
        }
    }
}

