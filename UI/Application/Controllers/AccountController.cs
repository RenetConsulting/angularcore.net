// <copyright file="AccountController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Reflection;
    using System.Security.Authentication;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.Communications;
    using Application.Business.CoreCaptcha;
    using Application.Business.Helpers;
    using Application.Business.Models;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Enums;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        private readonly IApplicationUserManager<ApplicationUser> userManager;
        private readonly ApplicationSignInManager<ApplicationUser> signInManager;
        private readonly IMailClient mailClient;
        private readonly ICoreCaptcha coreCaptcha;

        public AccountController(
            IGlobalRepository repository,
            IApplicationUserManager<ApplicationUser> userManager,
            ApplicationSignInManager<ApplicationUser> signInManager,
            IOptions<AppSettings> appSettings,
            IMailClient mailClient,
            ILogger<AccountController> logger,
            ICoreCaptcha coreCaptcha)
            : base(appSettings, logger)
        {
            this.userManager = userManager;
            this.mailClient = mailClient;
            this.signInManager = signInManager;
            this.coreCaptcha = coreCaptcha;
        }

        // POST api/account/register
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(UserModel userModel)
        {
            if (!await this.coreCaptcha.CaptchaValidate(this.Request))
            {
                ErrorListModel errorList = new ErrorListModel();
                errorList.Captcha.Add("Invalid or missing CoreCaptcha");
                return this.BadRequest(errorList);
            }

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

        // GET api/password/send/token
        [HttpGet("password/send/token")]
        public async Task<IActionResult> ResetPasswordAsync(string email)
        {
            string token = string.Empty;
            ActionResult returnCode = this.Ok();

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

            returnCode = await this.SendEmailAsync(email, this.AppSettings.ResetPasswordSubject, message);

            return returnCode;
        }

        // POST api/Account/ResetPasswordFromMail
        [HttpPost("password/reset")]
        public async Task<IActionResult> ResetPasswordFromMailAsync([FromBody] ResetPasswordFromMailModel resetPasswordFromMailModel)
        {
            ActionResult returnCode = this.Ok();

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

            returnCode = await this.SendEmailAsync(resetPasswordFromMailModel.Email, this.AppSettings.AfterResetPasswordSubject, message);

            return returnCode;
        }

        [Authorize]
        [HttpPost("password/change")]
        public async Task<IActionResult> ChangePasswordAsync([FromBody]ChangePasswordModel changePasswordModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            IdentityResult result = await this.userManager.ChangeUserPasswordAsync(this.User, changePasswordModel.OldPassword, changePasswordModel.Password, changePasswordModel.ConfirmPassword)
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

        [HttpGet("email/confirm")]
        public async Task<IActionResult> ConfirmEmailAsync(string email, string token)
        {
            IdentityResult result = await this.userManager.ConfirmEmailAsync(email, token).ConfigureAwait(false);

            IActionResult errorResult = this.GetErrorResult(result);

            if (errorResult != null)
            {
                return this.BadRequest(errorResult);
            }

            return this.Ok();
        }

        [HttpGet("email/send/token")]
        public async Task<IActionResult> ResendEmailAsync(string email)
        {
            ApplicationUser user = await this.userManager.FindByEmailAsync(email).ConfigureAwait(false);

            if (user != null)
            {
                if (!user.EmailConfirmed)
                {
                    await this.SendRegistrationMessageAsync(email, user.Id).ConfigureAwait(false);

                    return this.Ok();
                }
                else
                {
                    return this.BadRequest("User email is already confirmed.");
                }
            }
            else
            {
                return this.BadRequest("User not registered.");
            }
        }

        internal async Task<ActionResult> SendEmailAsync(string emailTo, string subject, string message)
        {
            ActionResult returnCode = this.Ok();

            var response = await this.mailClient.SendEmailAsync(
                this.AppSettings.InfoFromEmail,
                emailTo,
                subject,
                message).ConfigureAwait(false);

            if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                string body = await response.Body.ReadAsStringAsync();

                this.Logger.LogError(body);

                returnCode = this.BadRequest("Email send error.");
            }

            return returnCode;
        }

        internal ErrorListModel GetErrorListModel(IEnumerable<IdentityError> errors)
        {
            ErrorListModel errorList = new ErrorListModel();

            foreach (IdentityError error in errors)
            {
                ErrorMark errorType = ErrorMarks.GetErrorMark(error.Code);

                if (errorType == ErrorMark.Email)
                {
                    errorList.Email.Add(error.Description);
                }
                else if (errorType == ErrorMark.OldPassword)
                {
                    errorList.OldPassword.Add(error.Description);
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
                    return this.BadRequest(result.Errors.FirstOrDefault()?.Description);
                }

                return this.BadRequest();
            }

            return null;
        }

        private async Task<IActionResult> SendRegistrationMessageAsync(string userEmail, string userId)
        {
            try
            {
                const string assemblyName = "Application";
                // pull template from resources
                var assembly = Assembly.Load(new AssemblyName(assemblyName));

                // TODO: Uncoment when template will create
                const string resourceName = assemblyName + ".EmailTemplates.confirmEmail.html";

                string emailHtmlTamplate = string.Empty;

                using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                {
                    if(stream==null)
                    {
                        throw new System.ApplicationException("Cannot read resource " + resourceName);
                    }

                    using (StreamReader reader = new StreamReader(stream))
                    {
                        emailHtmlTamplate = reader.ReadToEnd();
                    }
                }

                // update template with images and links
                var emailToken = await this.userManager.GenerateEmailTokenAsync(userId).ConfigureAwait(false);
                var url = this.AppSettings.SiteHost + "confirm-email?email=" + WebUtility.UrlEncode(userEmail) + "&token=" + WebUtility.UrlEncode(emailToken);

                string emailHtml = string.Format(emailHtmlTamplate, userEmail, url, this.AppSettings.SiteHost);

                return await this.SendEmailAsync(userEmail, this.AppSettings.EmailConfirmationSubject, emailHtml);
            }
            catch
            {
                throw;
            }
        }
    }
}