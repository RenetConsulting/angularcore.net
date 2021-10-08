// <copyright file="ICoreCaptcha.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace CoreCaptcha
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;

    public interface ICoreCaptcha
    {
        Task<bool> CaptchaValidate(string hash, string captcha);

        Task<bool> CaptchaValidate(HttpRequest request);
    }
}
