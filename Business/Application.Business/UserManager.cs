namespace Application.Business
{
    using System.Threading.Tasks;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Identity;

    public class UserManager : IUserManager
    {
        public UserManager(IGlobalRepository repo)
        {
            this.Repository = repo;
        }

        protected IGlobalRepository Repository { get; private set; }

        public async Task<IdentityResult> RegisterAsync(string userName, string password)
        {
            return await this.Repository.RegisterUserAsync(userName, password);
        }
    }
}
