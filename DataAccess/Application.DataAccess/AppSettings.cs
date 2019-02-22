// <copyright file="AppSettings.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application
{
    public class AppSettings
    {
        public string SendGridKey { get; set; }

        public string SiteHost { get; set; }

        public string InfoFromEmail { get; set; }

        public string ResetPasswordSubject { get; set; }

        public string AfterResetPasswordSubject { get; set; }

        public string InfoEmail { get; set; }

        public string RecaptchaSecret { get; set; }

        public string InfoToEmail { get; set; }

        public string EmailConfirmationSubject { get; set; }

        public string SubjectToUser { get; set; }

        public string SubjectToWebsite { get; set; }

        public string GoogleAnalyticsId { get; set; }

        public string BlobStorage { get; set; }

        public string BlobContainerName { get; set; }

        public string FileExtensions { get; set; }
    }
}
