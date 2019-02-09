// <copyright file="AccountController.cs" company="RenetConsulting Inc.">
// Copyright (c) RenetConsulting Inc.. All rights reserved.
// </copyright>

namespace Application.Controllers
{
    using System.Collections.Generic;
    using System.Security.Authentication;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.Communications;
    using Application.Business.Helpers;
    using Application.Business.Models;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Enums;
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
                ErrorListModel errorList = this.GetErrorListModel(result.Errors);

                return this.BadRequest(errorList);
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
                token = await this.userManager.GeneratePasswordResetTokenByEmailAsync(email)
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
        public async Task<IActionResult> ResetPasswordFromMailAsync([FromBody] ResetPasswordFromMailModel resetPasswordFromMailModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            IdentityResult result;
            try
            {
                result = await this.userManager
                    .ResetPasswordByEmailAsync(resetPasswordFromMailModel.Email, resetPasswordFromMailModel.Token, resetPasswordFromMailModel.Password)
                    .ConfigureAwait(false);
            }
            catch (InvalidCredentialException ex)
            {
                return this.BadRequest(ex.Message);
            }

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    this.ModelState.AddModelError(error.Code, error.Description);
                }

                return this.BadRequest(this.ModelState);
            }

            string message = string.Format(
                "<p>You're receiving this e-mail because you or someone else reset your password at {1}."
                + " If this occurred without your approval, please contact us at <a href='{0}'>{1}</a>.</p>",
                this.AppSettings.SiteHost,
                this.AppSettings.SiteHost);

            await MailClient.SendEmailAsync(
                new SendGrid.SendGridClient(this.AppSettings.SendGridKey),
                this.AppSettings.InfoEmail,
                resetPasswordFromMailModel.Email,
                this.AppSettings.AfterResetPasswordSubject,
                message).ConfigureAwait(false);

            return this.Ok();
        }

        [Authorize]
        [Route("ChangePassword")]
        [HttpPost]
        public async Task<IActionResult> ChangePasswordAsync([FromBody]ChangePasswordModel changePasswordModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            IdentityResult result = await this.userManager.ChangeUserPasswordAsync(this.User, changePasswordModel.OldPassword, changePasswordModel.NewPassword, changePasswordModel.ConfirmNewPassword)
                    .ConfigureAwait(false);

            if (result.Succeeded)
            {
                return this.Ok();
            }
            else
            {
                ErrorListModel errorList = this.GetErrorListModel(result.Errors);

                return this.BadRequest(errorList);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("GenerateUserToken")]
        public async Task<IActionResult> GenerateUserTokenAsync()
        {
            try
            {
                ApplicationUser user = await this.userManager.GetUserAsync(this.User).ConfigureAwait(false);

                string token = await this.userManager.GenerateUserTokenAsync(user);

                return this.Ok(token);
            }
            catch (InvalidCredentialException ex)
            {
                return this.BadRequest(ex.Message);
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

        private ErrorListModel GetErrorListModel(IEnumerable<IdentityError> errors)
        {
            ErrorListModel errorList = new ErrorListModel();

            foreach (var error in errors)
            {
                ErrorMark errorType = ErrorMarks.GetErrorMark(error.Code);

                if (errorType == ErrorMark.Email)
                {
                    errorList.Email.Add(error.Description);
                }
                else if (errorType == ErrorMark.Password)
                {
                    errorList.Password.Add(error.Description);
                }
                else if (errorType == ErrorMark.ConfirmPassword)
                {
                    errorList.ConfirmPassword.Add(error.Description);
                }
            }

            return errorList;
        }
    }
}