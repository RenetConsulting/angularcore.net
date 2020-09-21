// <copyright file="MailClient.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Communications
{
    using System.Collections.Generic;
    using System.Net.Mail;
    using System.Threading.Tasks;
    using SendGrid;
    using SendGrid.Helpers.Mail;

    public class MailClient : IMailClient
    {
        private ISendGridClient sendGridClient;

        public MailClient(ISendGridClient sendGridClient)
        {
            this.sendGridClient = sendGridClient;
        }

        public Task<Response> SendEmailAsync(string emailFrom, string emailTo, string subject, string messageBody)
        {
            EmailAddress from = new EmailAddress(emailFrom);
            EmailAddress to = new EmailAddress(emailTo);

            List<Content> contents = new List<Content>()
            {
                new Content { Type = "text/plain", Value = messageBody },
                new Content { Type = "text/html", Value = messageBody },
            };

            // create a Mail object to send
            SendGridMessage message = new SendGridMessage() { From = from, Subject = subject, Contents = contents };

            message.AddTo(to);

            // disable SendGrid email tracking
            message.TrackingSettings = new TrackingSettings { ClickTracking = new ClickTracking { Enable = false } };

            return this.sendGridClient.SendEmailAsync(message);
        }

        public async Task<Response> SendEmailAsync(MailMessage mailMessage)
        {
            // create a client with key
            EmailAddress emailFrom = new EmailAddress { Name = mailMessage.From.DisplayName, Email = mailMessage.From.Address };

            List<Content> contents = new List<Content>()
            {
                new Content { Type = "text/plain", Value = mailMessage.Body },
                new Content { Type = "text/html", Value = mailMessage.Body },
            };

            // create a Mail object to send
            SendGridMessage message = new SendGridMessage() { From = emailFrom, Subject = mailMessage.Subject, Contents = contents };
            foreach (var to in mailMessage.To)
            {
                message.AddTo(to.Address, to.DisplayName);
            }

            // disable SendGrid email tracking
            message.TrackingSettings = new TrackingSettings { ClickTracking = new ClickTracking { Enable = false } };

            return await this.sendGridClient.SendEmailAsync(message);
        }
    }
}
