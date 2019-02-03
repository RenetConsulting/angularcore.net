namespace Application.Business
{
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Identity;

    public class UserManager : IUserManager
    {
        public UserManager(IGlobalRepository repository, UserManager<ApplicationUser> userManager)
        {
            this.Repository = repository;
            this.IdentityUserManager = userManager;
        }

        protected IGlobalRepository Repository { get; private set; }

        protected UserManager<ApplicationUser> IdentityUserManager { get; private set; }

        public async Task<IdentityResult> RegisterAsync(string userName, string password)
        {
            return await this.Repository.RegisterUserAsync(userName, password);
        }

        public async Task<ApplicationUser> FindByNameAsync(string userName)
        {
            return await this.IdentityUserManager.FindByNameAsync(userName);
        }
    }
}
