// <copyright file="CoreCaptchaSettings.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.CoreCaptcha
{
    public class CoreCaptchaSettings
    {
        public virtual string CreateUrl { get; set; }

        public virtual string ValidateUrl { get; set; }

        public virtual string ClientId { get; set; }
    }
}
