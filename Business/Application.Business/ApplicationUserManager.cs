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
    }
}
