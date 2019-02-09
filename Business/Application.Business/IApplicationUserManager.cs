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

        Task<string> GenerateUserTokenAsync(TUser user);

        Task<IdentityResult> ResetPasswordAsync(TUser user, string token, string newPassword);

        Task<IdentityResult> ChangePasswordAsync(TUser user, string oldPassword, string newPassword);
    }
}
