namespace Application.Controllers
{
    using System.Threading.Tasks;
    using Application.Business.Models;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        public AccountController(
            IGlobalRepository repository,
            IOptions<AppSettings> appSettings)
            : base(repository, appSettings)
        {
        }

       // POST api/Account/Register
       [AllowAnonymous]
       [HttpPost]
       [Route("Register")]
        public async Task<IActionResult> RegisterAsync(UserModel userModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            var findUser = await this.Repository.FindUserByEmailAsync(userModel.Email).ConfigureAwait(false);

            if (findUser != null)
            {
                this.ModelState.AddModelError(string.Empty, "Email is already taken");
                return this.BadRequest(this.ModelState);
            }

            try
            {
                IdentityResult result = await this.Repository.RegisterUserAsync(userModel.Password, userModel.Email).ConfigureAwait(false);

                IActionResult errorResult = this.GetErrorResult(result);
                if (errorResult != null)
                {
                    return this.BadRequest(errorResult);
                }

                return this.Ok();
            }
            catch
            {
                throw;
            }
        }

        private IActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return null;
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        this.ModelState.AddModelError(string.Empty, error.Description);
                    }
                }

                if (this.ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return this.BadRequest();
                }

                return this.BadRequest(this.ModelState);
            }

            return null;
        }
    }
}