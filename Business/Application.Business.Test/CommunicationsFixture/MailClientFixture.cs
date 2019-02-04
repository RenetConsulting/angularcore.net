namespace Application.Business.Test.CommunicationsFixture
{
    using System.Threading.Tasks;
    using Application.Business.Communications;
    using Moq;
    using Xunit;

    public class MailClientFixture
    {
        [Fact]
        public async Task SendEmailAsyncTest_EmailHasBeenSuccessfullySent()
        {
            const string sendGridKey = "E5E0BA8F-6DA5-43CA-ACF9-764384852C30";
            const string emailFrom = "cemmy1993@gmail.com";
            const string emailTo = "ToYourEmail@gmail.com";
            const string subject = "Hello!";
            const string messageBody = "My name is Andrey.";

            Mock<SendGrid.SendGridClient> sendGridClientMock = new Mock<SendGrid.SendGridClient>(sendGridKey, null, null, null, null);

            SendGrid.Response result = await MailClient.SendEmailAsync(sendGridClientMock.Object, emailFrom, emailTo, subject, messageBody)
                .ConfigureAwait(false);

            Assert.True(!Equals(result.Body, null));
        }
    }
}
