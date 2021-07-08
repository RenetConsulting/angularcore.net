// -----------------------------------------------------------------------
// <copyright file="IEmail.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------

namespace EmailAWS
{
    using System.Net;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;

    public interface IEmail
    {
        Task<HttpStatusCode> SendEmailAsync(ILogger log, string clientId, IMessage msg);
    }
}
