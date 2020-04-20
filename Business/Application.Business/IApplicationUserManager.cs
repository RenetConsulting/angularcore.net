// <copyright file="IApplicationUserManager.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Identity;

    public interface IApplicationUserManager<TUser>
    {
        Task<IdentityResult> CreateAsync(TUser user, string password);

        Task<TUser> FindByIdAsync(string userId);

        Task<TUser> FindByEmailAsync(string email);

        Task<string> GeneratePasswordResetTokenAsync(TUser user);

        Task<string> GenerateEmailConfirmationTokenAsync(TUser user);

        Task<IdentityResult> ResetPasswordAsync(TUser user, string token, string newPassword);

        Task<IdentityResult> ChangePasswordAsync(TUser user, string oldPassword, string newPassword);

        Task<string> GeneratePasswordResetTokenByEmailAsync(string email);

        Task<IdentityResult> ResetPasswordByEmailAsync(string email, string token, string newPassword);

        Task<IdentityResult> ChangeUserPasswordAsync(System.Security.Claims.ClaimsPrincipal userClaims, string oldPassword, string newPassword, string confirmNewPassword);

        Task<string> GenerateEmailTokenAsync(string userId);

        Task<IdentityResult> ConfirmEmailAsync(TUser user, string token);

        Task<IdentityResult> CreateAsync(string userName, string password);

        Task<TUser> GetUserAsync(ClaimsPrincipal principal);

        Task<TUser> FindByLoginAsync(string loginProvider, string providerKey);

        Task<IdentityResult> AddLoginAsync(TUser user, UserLoginInfo login);

        Task<TUser> FindByNameAsync(string userName);
    }
}
