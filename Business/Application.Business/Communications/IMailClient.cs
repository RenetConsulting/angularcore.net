// <copyright file="IMailClient.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Communications
{
    using System.Net.Mail;
    using System.Threading.Tasks;
    using SendGrid;

    public interface IMailClient
    {
        Task<Response> SendEmailAsync(MailMessage mailMessage);

        Task<Response> SendEmailAsync(string emailFrom, string emailTo, string subject, string messageBody);
    }
}