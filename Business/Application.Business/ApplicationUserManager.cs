// <copyright file="ApplicationUserManager.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business
{
    using System;
    using System.Collections.Generic;
    using System.Security.Authentication;
    using System.Threading.Tasks;
    using Application.Business.Helpers;
    using Application.DataAccess.Entities;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    public class ApplicationUserManager<TUser> : UserManager<TUser>, IApplicationUserManager<TUser>
        where TUser : ApplicationUser, new()
    {
        private const string UserNotFoundMessage = "User not found";

        private IApplicationUserManager<TUser> me;

        public ApplicationUserManager(IUserStore<TUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<TUser> passwordHasher, IEnumerable<IUserValidator<TUser>> userValidators, IEnumerable<IPasswordValidator<TUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<TUser>> logger)
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }

        internal IApplicationUserManager<TUser> Me
        {
            get
            {
                return this.me ?? this;
            }

            set
            {
                this.me = value;
            }
        }

        public async Task<IdentityResult> CreateAsync(string userName, string password)
        {
            TUser user = new TUser
            {
                UserName = userName,
                Email = userName,
                EmailConfirmed = false
            };

            IdentityResult result = await this.Me.CreateAsync(user, password);

            return result;
        }

        /// <summary>
        /// Generates a password reset token for the specified user, using the configured password reset token provider.
        /// </summary>
        /// <param name="userId">The userId to generate a password reset token for.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing a password reset token for the specified user.</returns>
        /// <exception cref="System.ArgumentNullException">Throw ArgumentNullException if the userId parameter is null or empty or user not found</exception>
        public async Task<string> GeneratePasswordResetTokenAsync(string userId)
        {
            userId = userId ?? throw new ArgumentNullException(nameof(userId));

            TUser user = await this.Me.FindByIdAsync(userId);

            if (user != null)
            {
                return await this.Me.GeneratePasswordResetTokenAsync(user);
            }
            else
            {
                throw new InvalidCredentialException(UserNotFoundMessage);
            }
        }

        public async Task<string> GeneratePasswordResetTokenByEmailAsync(string email)
        {
            email = email ?? throw new ArgumentNullException(nameof(email));

            TUser user = await this.Me.FindByEmailAsync(email);

            if (user != null)
            {
                return await this.Me.GeneratePasswordResetTokenAsync(user);
            }
            else
            {
                throw new InvalidCredentialException(UserNotFoundMessage);
            }
        }

        public async Task<string> GenerateTokenAsync(TUser user)
        {
            user = user ?? throw new InvalidCredentialException(UserNotFoundMessage);

            return await this.Me.GeneratePasswordResetTokenAsync(user);
        }

        /// <summary>
        /// Resets the user's password to the specified newPassword after validating the given password reset token.
        /// </summary>
        /// <param name="email">The userId whose password should be reset.</param>
        /// <param name="token">The password reset token to verify.</param>
        /// <param name="newPassword">The new password to set if reset token verification fails.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing the Microsoft.AspNetCore.Identity.IdentityResult of the operation.</returns>
        /// <exception cref="System.ArgumentNullException">Throw ArgumentNullException if the userId parameter is null or empty or user not found</exception>
        /// <exception cref="System.Security.Authentication.InvalidCredentialException">Throw InvalidCredentialException if the user not found</exception>
        public async Task<IdentityResult> ResetPasswordByEmailAsync(string email, string token, string newPassword)
        {
            email = email ?? throw new ArgumentNullException(nameof(email));

            TUser user = await this.Me.FindByEmailAsync(email);

            if (user != null)
            {
                return await this.Me.ResetPasswordAsync(user, token, newPassword);
            }
            else
            {
                throw new InvalidCredentialException(UserNotFoundMessage);
            }
        }

        public async Task<IdentityResult> ChangeUserPasswordAsync(System.Security.Claims.ClaimsPrincipal userClaims, string oldPassword, string newPassword, string confirmNewPassword)
        {
            if (!newPassword.Equals(confirmNewPassword))
            {
                return IdentityResult.Failed(new ApplicationIdentityErrorDescriber().ConfirmPasswordMismatch());
            }

            TUser user = await this.GetUserAsync(userClaims);

            user = user ?? throw new InvalidCredentialException(UserNotFoundMessage);

            return await this.Me.ChangePasswordAsync(user, oldPassword, newPassword);
        }

        public async Task<string> GenerateEmailTokenAsync(string userId)
        {
            TUser user = await this.Me.FindByIdAsync(userId);

            string result = await this.Me.GenerateEmailConfirmationTokenAsync(user);

            return result;
        }
    }
}
