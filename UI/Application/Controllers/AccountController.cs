// <copyright file="AccountController.cs" company="RenetConsulting Inc.">
// Copyright (c) RenetConsulting Inc.. All rights reserved.
// </copyright>

namespace Application.Controllers
{
    using System.Security.Authentication;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.Communications;
    using Application.Business.Models;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        private ApplicationUserManager<ApplicationUser> userManager;

        public AccountController(
            IGlobalRepository repository,
            ApplicationUserManager<ApplicationUser> userManager,
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

            IdentityResult result = await this.userManager.CreateAsync(userModel.Email, userModel.Password)
                .ConfigureAwait(false);

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

        // GET api/Account/ResetPassword
        [HttpGet]
        [AllowAnonymous]
        [Route("ResetPassword", Name = "ResetPassword")]
        public async Task<IActionResult> ResetPasswordAsync(string email)
        {
            string token = string.Empty;

            try
            {
                token = await this.userManager.GeneratePasswordResetTokenAsync(email)
                    .ConfigureAwait(false);
            }
            catch (InvalidCredentialException ex)
            {
                return this.BadRequest(ex.Message);
            }

            var url = this.AppSettings.SiteHost
                + "reset-password?token="
                + System.Net.WebUtility.UrlEncode(token)
                + $"&email={email}";

            string message = string.Format(
                "<p>For reset Password: <a href='{0}'>follow this link</a>"
                + "<br />"
                + "<p>Please do not reply to this email.</p>",
                url);

            await MailClient.SendEmailAsync(
                new SendGrid.SendGridClient(this.AppSettings.SendGridKey),
                this.AppSettings.InfoEmail,
                email,
                this.AppSettings.ResetPasswordSubject,
                message).ConfigureAwait(false);

            return this.Ok();
        }

        // POST api/Account/ResetPasswordFromMail
        [AllowAnonymous]
        [Route("ResetPasswordFromMail", Name = "ResetPasswordFromMail")]
        [HttpPost]
        public async Task<IActionResult> ResetPasswordFromMailAsync([FromBody] UserModel userModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            ApplicationUser applicationUser = await this.userManager.FindByEmailAsync(userModel.Email)
                .ConfigureAwait(false);

            if (applicationUser != null)
            {
                if (string.IsNullOrEmpty(userModel.Token))
                {
                    return this.BadRequest("Token in link is not found.");
                }

                IdentityResult result = await this.userManager.ResetPasswordAsync(applicationUser.Id, userModel.Token, userModel.Password)
                    .ConfigureAwait(false);

                if (!result.Succeeded)
                {
                    return this.BadRequest($"Something error with reset {userModel.Email} password.");
                }

                string message = string.Format(
                    "<p>You're receiving this e-mail because you or someone else reset your password at {1}."
                    + " If this occurred without your approval, please contact us at <a href='{0}'>{1}</a>.</p>",
                    this.AppSettings.SiteHost);

                await MailClient.SendEmailAsync(
                    new SendGrid.SendGridClient(this.AppSettings.SendGridKey),
                    this.AppSettings.InfoEmail,
                    userModel.Email,
                    this.AppSettings.AfterResetPasswordSubject,
                    message).ConfigureAwait(false);

                return this.Ok();
            }
            else
            {
                return this.BadRequest("Email adress is not found.");
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