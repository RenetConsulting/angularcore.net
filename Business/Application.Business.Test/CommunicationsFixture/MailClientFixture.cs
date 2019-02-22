// <copyright file="MailClientFixture.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Test.CommunicationsFixture
{
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Application.Business.Communications;
    using Moq;
    using SendGrid;
    using SendGrid.Helpers.Mail;
    using Xunit;

    public class MailClientFixture
    {
        [Fact]
        public async Task SendEmailAsyncTest_EmailHasBeenSuccessfullySent()
        {
            const string emailFrom = "xyzFrom@abc.local";
            const string emailTo = "xyzTo@abc.local";
            const string subject = "Email Subject";
            const string messageBody = "Here is a message body";
            EmailAddress from = new EmailAddress(emailFrom);
            EmailAddress to = new EmailAddress(emailTo);
            List<Content> contents = new List<Content>()
            {
                new Content { Type = "text/plain", Value = messageBody },
                new Content { Type = "text/html", Value = messageBody }
            };

            Mock<ISendGridClient> sendGridClientMock = new Mock<ISendGridClient>();

            SendGridMessage msg = new SendGridMessage { From = from, Subject = subject, Contents = contents };
            msg.AddTo(to);

            Response response = new Response(System.Net.HttpStatusCode.Accepted, null, null);

            CancellationToken cancellationToken = default(CancellationToken);

            sendGridClientMock.Setup(x => x.SendEmailAsync(
                It.Is<SendGridMessage>(
                    p => p.From.Email == emailFrom &&
                    p.Subject == subject &&
                    !p.TrackingSettings.ClickTracking.Enable.Value &&
                    p.Contents[0].Value == messageBody),
                cancellationToken))
                .Returns(Task.FromResult(response)).Verifiable();

            MailClient client = new MailClient(sendGridClientMock.Object);

            Response result = await client.SendEmailAsync(emailFrom, emailTo, subject, messageBody);

            Assert.Equal(System.Net.HttpStatusCode.Accepted, result.StatusCode);
        }
    }
}
