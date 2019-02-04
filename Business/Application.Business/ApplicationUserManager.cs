namespace Application.Business
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    public class ApplicationUserManager<TUser> : UserManager<TUser>, IApplicationUserManager<TUser>
        where TUser : ApplicationUser, new()
    {
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

        public async Task<IdentityResult> RegisterAsync(string userName, string password)
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

            return await this.Me.GeneratePasswordResetTokenAsync(user);
        }

        /// <summary>
        /// Resets the user's password to the specified newPassword after validating the given password reset token.
        /// </summary>
        /// <param name="userId">The userId whose password should be reset.</param>
        /// <param name="token">The password reset token to verify.</param>
        /// <param name="newPassword">The new password to set if reset token verification fails.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing the Microsoft.AspNetCore.Identity.IdentityResult of the operation.</returns>
        /// <exception cref="System.ArgumentNullException">Throw ArgumentNullException if the userId parameter is null or empty or user not found</exception>
        public async Task<IdentityResult> ResetPasswordAsync(string userId, string token, string newPassword)
        {
            userId = userId ?? throw new ArgumentNullException(nameof(userId));

            TUser user = await this.Me.FindByIdAsync(userId);

            return await this.Me.ResetPasswordAsync(user, token, newPassword);
        }

        /// <summary>
        /// Gets the user, if any, associated with the normalized value of the specified email address.
        /// </summary>
        /// <param name="email">The email address to return the user for.</param>
        /// <returns>The task object containing the results of the asynchronous lookup operation, the user, if any, associated with a normalized value of the specified email address.</returns>
        public async Task<TUser> FindUserByEmailAsync(string email)
        {
            return await this.Me.FindByEmailAsync(email);
        }
    }
}
