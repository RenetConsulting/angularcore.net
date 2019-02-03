namespace Application.Business
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Identity;

    public interface IUserManager
    {
        Task<IdentityResult> RegisterAsync(string username, string password);
    }
}
