// <copyright file="IApplicationUserManager.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Identity;

    public interface IApplicationUserManager<TUser>
    {
        Task<IdentityResult> CreateAsync(TUser user, string password);

        Task<TUser> FindByIdAsync(string userId);

        Task<TUser> FindByEmailAsync(string email);

        Task<string> GeneratePasswordResetTokenAsync(TUser user);

        Task<IdentityResult> ResetPasswordAsync(TUser user, string token, string newPassword);

        Task<IdentityResult> ChangePasswordAsync(TUser user, string oldPassword, string newPassword);
    }
}
