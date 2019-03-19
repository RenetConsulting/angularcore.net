// <copyright file="AuthorizationController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.CoreCaptcha;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Enums;
    using AspNet.Security.OpenIdConnect.Extensions;
    using AspNet.Security.OpenIdConnect.Primitives;
    using AspNet.Security.OpenIdConnect.Server;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Mvc;
    using Newtonsoft.Json;
    using OpenIddict.Abstractions;
    using OpenIddict.Mvc.Internal;

    public class AuthorizationController : Controller
    {
        private readonly ApplicationSignInManager<ApplicationUser> signInManager;

        private readonly ApplicationUserManager<ApplicationUser> userManager;

        private readonly ICoreCaptcha coreCaptcha;

        public AuthorizationController(
            ApplicationSignInManager<ApplicationUser> signInManager,
            ApplicationUserManager<ApplicationUser> userManager,
            ICoreCaptcha coreCaptcha)
            : base()
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.coreCaptcha = coreCaptcha;
        }

        [HttpPost("~/connect/token")]
        [Produces("application/json")]
        public async Task<IActionResult> ExchangeAsync([ModelBinder(typeof(OpenIddictMvcBinder))] OpenIdConnectRequest request)
        {
            if (request.IsPasswordGrantType())
            {
                return await this.PasswordGrantTypeAsync(request);
            }

            // grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
            if (request.IsRefreshTokenGrantType())
            {
                return await this.RefreshTokenGrantTypeAsync(request);
            }

            return this.BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported."
            });
        }

        [HttpGet("~/connect/token/external/{provider}")]
        public async Task<IActionResult> ExternalLoginAsync(string provider, string returnUrl = null)
        {
            try
            {
                switch (provider.ToLower())
                {
                    case "facebook":
                        // Redirect the request to the external provider.
                        var redirectUrl = this.Url.Action(
                            nameof(this.ExternalLoginCallback),
                            "Authorization",
                            new { returnUrl });
                        var properties = this.signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
                        return this.Challenge(properties, provider);
                    default:
                        // provider not supported
                        return this.BadRequest(new
                        {
                            Error = string.Format("Provider '{0}' is not supported.", provider)
                        });
                }
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpGet("ExternalLoginCallback")]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            if (!string.IsNullOrEmpty(remoteError))
            {
                // TODO: handle external provider errors
                throw new Exception(string.Format("External Provider error: {0}", remoteError));
            }

            // Extract the login info obtained from the External Provider
            var info = await this.signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                // if there's none, emit an error
                throw new Exception("ERROR: No login info available.");
            }

            // Check if this user already registered himself with this external provider before 
            var user = await this.userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);/*
            if (user == null)
            {
                // If we reach this point, it means that this user never tried to logged in
                // using this external provider. However, it could have used other providers
                // and /or have a local account.

                // We can find out if that's the case by looking for his e-mail address.
                // Retrieve the 'emailaddress' claim
                var emailKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
                var email = info.Principal.FindFirst(emailKey).Value;

                // Lookup if there's an username with this e-mail address in the Db
                user = await this.userManager.FindByEmailAsync(email);
                
                if (user == null)
                {
                    // No user has been found: register a new user
                    // using the info retrieved from the provider
                    DateTime now = DateTime.Now;

                    // Create a unique username using the 'nameidentifier' claim
                    var idKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
                    var username = string.Format("{0}{1}{2}", info.LoginProvider, info.Principal.FindFirst(idKey).Value, Guid.NewGuid().ToString("N"));
                    user = new ApplicationUser()
                    {
                        SecurityStamp = Guid.NewGuid().ToString(),
                        UserName = username,
                        Email = email
                    };

                    // Add the user to the Db with a random password
                    await this.userManager.CreateAsync(user, DataHelper.GenerateRandomPassword());

                    // Assign the user to the 'RegisteredUser' role.
                    await this.userManager.AddToRoleAsync(user, "RegisteredUser");

                    // Remove Lockout and E-Mail confirmation
                    user.EmailConfirmed = true;
                    user.LockoutEnabled = false;

                    // Persist everything into the Db
                    await DbContext.SaveChangesAsync();
                }

                // Register this external provider to the user
                var ir = await this.userManager.AddLoginAsync(user, info);
                if (ir.Succeeded)
                {
                    // Persist everything into the Db
                    DbContext.SaveChanges();
                }
                else
                {
                    throw new Exception("Authentication error");
                }
            }

            // create the refresh token
            var rt = CreateRefreshToken("TestMakerFree", user.Id);

            // add the new refresh token to the DB
            DbContext.Tokens.Add(rt);
            DbContext.SaveChanges();

            // create & return the access token
            var t = CreateAccessToken(user.Id, rt.Value);
            
            // output a <SCRIPT> tag to call a JS function
            // registered into the parent window global scope
            return Content(
                "<script type=\"text/javascript\">" +
                "window.opener.externalProviderLogin(" +
                JsonConvert.SerializeObject(t, JsonSettings) +
                ");" +
                "window.close();" +
                "</script>", "text/html");*/
            return null;
        }

        [HttpDelete("~/connect/signout")]
        public async Task<IActionResult> SignOutAsync()
        {
            await this.HttpContext.SignOutAsync("Identity.Application")
                .ConfigureAwait(false);

            await this.HttpContext.SignOutAsync("Identity.External")
                .ConfigureAwait(false);

            await this.signInManager.SignOutAsync()
                .ConfigureAwait(false);

            return this.Ok();
        }

        [HttpPost("~/connect/logout")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LogoutAsync()
        {
            // Ask ASP.NET Core Identity to delete the local and external cookies created
            // when the user agent is redirected from the external identity provider
            // after a successful authentication flow (e.g Google or Facebook).
            await this.signInManager.SignOutAsync();

            // Returning a SignOutResult will ask OpenIddict to redirect the user agent
            // to the post_logout_redirect_uri specified by the client application.
            return this.SignOut(OpenIdConnectServerDefaults.AuthenticationScheme);
        }

        internal async Task<IActionResult> PasswordGrantTypeAsync([ModelBinder(typeof(OpenIddictMvcBinder))] OpenIdConnectRequest request)
        {
            var user = await this.userManager.FindByNameAsync(request.Username);

            if (user == null)
            {
                return this.BadRequest(new OpenIdConnectResponse
                {
                    Error = OpenIdConnectConstants.Errors.InvalidGrant,
                    ErrorDescription = "The username/password couple is invalid."
                });
            }

            if (!user.EmailConfirmed)
            {
                return this.BadRequest(new OpenIdConnectResponse
                {
                    Error = OpenIdConnectConstants.Errors.AccessDenied,
                    ErrorDescription = "Please confirm your email address.",
                    Code = ((int)ErrorNumbers.ConfirmEmail).ToString()
                });
            }

            if (user.AccessFailedCount > 0)
            {
                // validate captcha
                if (!await this.coreCaptcha.CaptchaValidate(this.Request))
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = "InvalidCoreCaptcha",
                        ErrorDescription = "Invalid or missing CoreCaptcha"
                    });
                }
            }

            // Validate the username/password parameters and ensure the account is not locked out.
            var result = await this.signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

            if (!result.Succeeded)
            {
                if (result.IsLockedOut)
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Account is locked. Try again in 5 min."
                    });
                }
                else
                {
                    if (result.IsNotAllowed)
                    {
                        return this.BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.AccessDenied,
                            ErrorDescription = "Access denied or not allowed."
                        });
                    }
                    else
                    {
                        return this.BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.InvalidGrant,
                            ErrorDescription = "The username/password couple is invalid."
                        });
                    }
                }
            }

            // Create a new authentication ticket.
            var ticket = await this.CreateTicketAsync(request, user);

            return this.SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
        }

        internal async Task<IActionResult> RefreshTokenGrantTypeAsync([ModelBinder(typeof(OpenIddictMvcBinder))] OpenIdConnectRequest request)
        {
            try
            {
                // Retrieve the claims principal stored in the refresh token.
                var info = await this.HttpContext.AuthenticateAsync(OpenIdConnectServerDefaults.AuthenticationScheme).ConfigureAwait(false);

                // Retrieve the user profile corresponding to the refresh token.
                // Note: if you want to automatically invalidate the refresh token
                // when the user password/roles change, use the following line instead:
                // var user = _signInManager.ValidateSecurityStampAsync(info.Principal);
                var user = await this.userManager.GetUserAsync(info.Principal).ConfigureAwait(false);

                if (user == null)
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The refresh token is no longer valid."
                    });
                }

                // Ensure the user is still allowed to sign in.
                if (!await this.signInManager.CanSignInAsync(user).ConfigureAwait(false))
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The user is no longer allowed to sign in."
                    });
                }

                // Create a new authentication ticket, but reuse the properties stored
                // in the refresh token, including the scopes originally granted.
                var ticket = await this.CreateTicketAsync(request, user, info.Properties).ConfigureAwait(false);

                return this.SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            catch (Exception ex)
            {
                return this.BadRequest(new OpenIdConnectResponse
                {
                    ErrorDescription = ex.Message
                });
            }
        }

        private async Task<AuthenticationTicket> CreateTicketAsync(
            OpenIdConnectRequest request,
            ApplicationUser user,
            AuthenticationProperties properties = null)
        {
            // Create a new ClaimsPrincipal containing the claims that
            // will be used to create an id_token, a token or a code.
            var principal = await this.signInManager.CreateUserPrincipalAsync(user);

            // Note: by default, claims are NOT automatically included in the access and identity tokens.
            // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
            // whether they should be included in access tokens, in identity tokens or in both.
            foreach (var claim in principal.Claims)
            {
                // In this sample, every claim is serialized in both the access and the identity tokens.
                // In a real world application, you'd probably want to exclude confidential claims
                // or apply a claims policy based on the scopes requested by the client application.
                claim.SetDestinations(
                    OpenIdConnectConstants.Destinations.AccessToken,
                    OpenIdConnectConstants.Destinations.IdentityToken);
            }

            // Create a new authentication ticket holding the user identity.
            var ticket = new AuthenticationTicket(
                principal,
                properties,
                OpenIdConnectServerDefaults.AuthenticationScheme);

            if (!request.IsRefreshTokenGrantType())
            {
                // Set the list of scopes granted to the client application.
                // Note: the offline_access scope must be granted
                // to allow OpenIddict to return a refresh token.
                ticket.SetScopes(new[]
                {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
                }.Intersect(request.GetScopes()));
            }

            return ticket;
        }
    }
}
