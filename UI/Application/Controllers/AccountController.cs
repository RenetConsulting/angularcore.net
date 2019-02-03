// <copyright file="AccountController.cs" company="RenetConsulting Inc.">
// Copyright (c) RenetConsulting Inc.. All rights reserved.
// </copyright>

namespace Application.Controllers
{
    using System.Linq;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.Models;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        private IUserManager userManager;

        public AccountController(
            IGlobalRepository repository,
            IUserManager userManager,
            IOptions<AppSettings> appSettings)
            : base(repository, appSettings)
        {
            this.userManager = userManager;
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

            IdentityResult result = await this.userManager.RegisterAsync(userModel.Email, userModel.Password);

            if (result.Succeeded)
            {
                return this.Ok();
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    this.ModelState.AddModelError(error.Code, error.Description);
                }

                return this.BadRequest(this.ModelState);
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