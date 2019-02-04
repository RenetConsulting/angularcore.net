namespace Application.Business
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Identity;

    public interface IApplicationUserManager<TUser>
    {
        Task<IdentityResult> CreateAsync(TUser user, string password);
    }
}
