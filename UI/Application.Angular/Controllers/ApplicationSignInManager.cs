namespace Angular.WebApi.Services
{
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    public enum CanSignInResult
    {
        None = 0,
        Violation,
        AcceptedTerms,
        EmailConfirmed
    }

    public class ApplicationSignInManager<TUser> : SignInManager<TUser>
        where TUser : ApplicationUser
    {
        public ApplicationSignInManager(
            UserManager<TUser> userManager, 
            IHttpContextAccessor contextAccessor,
            IUserClaimsPrincipalFactory<TUser> claimsFactory, 
            IOptions<IdentityOptions> optionsAccessor,
            ILogger<SignInManager<TUser>> logger)
            : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger)
        {
        }

        public CanSignInResult CanSignInResult { get; private set; }

        public override async Task<bool> CanSignInAsync(TUser user)
        {
            this.CanSignInResult = CanSignInResult.None;

            if (!user.EmailConfirmed)
            {
                this.CanSignInResult = CanSignInResult.EmailConfirmed;

                return false;
            }

            return await base.CanSignInAsync(user);
        }
    }
}
