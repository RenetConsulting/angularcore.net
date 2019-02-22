// <copyright file="ApplicationIdentityErrorDescriber.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Helpers
{
    using Microsoft.AspNetCore.Identity;

    public class ApplicationIdentityErrorDescriber : IdentityErrorDescriber
    {
        public virtual IdentityError ConfirmPasswordMismatch()
        {
            return new IdentityError
            {
                Code = "ConfirmPasswordMismatch",
                Description = "The confirm password you entered does not match."
            };
        }
    }
}
