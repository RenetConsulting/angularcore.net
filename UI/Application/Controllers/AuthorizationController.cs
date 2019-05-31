// <copyright file="AuthorizationController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.CoreCaptcha;
    using Application.Business.Helpers;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Enums;
    using AspNet.Security.OpenIdConnect.Extensions;
    using AspNet.Security.OpenIdConnect.Primitives;
    using AspNet.Security.OpenIdConnect.Server;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Identity;
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
            else if (request.IsRefreshTokenGrantType())
            {
                return await this.RefreshTokenGrantTypeAsync(request);
            }
            else if (request.GrantType == "external_identity_token")
            {
                try
                {
                    return await this.ExternalSignInAsync(request);
                }
                catch (Exception ex)
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        ErrorDescription = ex.Message
                    });
                }
            }

            return this.BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported."
            });
        }

        [HttpDelete("~/connect/signout")]
        public async Task<IActionResult> SignOutAsync()
        {
            await this.HttpContext.SignOutAsync("Identity.Application").ConfigureAwait(false);

            await this.HttpContext.SignOutAsync("Identity.External").ConfigureAwait(false);

            await this.signInManager.SignOutAsync().ConfigureAwait(false);

            return this.Ok();
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

        internal async Task<IActionResult> ExternalSignInAsync(OpenIdConnectRequest request)
        {
            ApplicationUser user = null;

            var provider = request.State.ToLower();

            switch (provider)
            {
                case "facebook":
                    {
                        user = await this.ProviderSignInAsync(
                            provider,
                            "id",
                            "https://graph.facebook.com/v3.3/",
                            string.Format("me?scope=email&access_token={0}&fields=id,name,email", request.AccessToken));
                        break;
                    }

                case "google":
                    {
                        // sub - the unique-identifier key for the user
                        user = await this.ProviderSignInAsync(
                            provider,
                            "sub",
                            "https://www.googleapis.com/oauth2/v3/tokeninfo",
                            string.Format("?id_token={0}", request.AccessToken));
                        break;
                    }

                default:
                    {
                        throw new Exception("Provider is not found.");
                    }
            }

            // Create a new authentication ticket.
            var ticket = await this.CreateTicketAsync(request, user).ConfigureAwait(false);

            return this.SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
        }

        internal async Task<ApplicationUser> ProviderSignInAsync(string provider, string keyId, string url, string queryString)
        {
            string result = null;

            using (var http = new HttpClient())
            {
                http.BaseAddress = new Uri(url);
                var response = await http.GetAsync(queryString);

                if (response.IsSuccessStatusCode)
                {
                    result = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    throw new Exception("Authentication error.");
                }
            }

            var dic = JsonConvert.DeserializeObject<Dictionary<string, string>>(result);
            string id = dic[keyId];
            string email = dic["email"];
            var info = new UserLoginInfo(provider, id, provider);
            var user = await this.userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (!Equals(user, null))
            {
                return user;
            }

            if (Equals(email, null))
            {
                throw new Exception(string.Format("Can not extract an email from the response of the provider: {0}.", provider));
            }

            return await this.CreateUserAync(info, email);
        }

        internal async Task<ApplicationUser> CreateUserAync(UserLoginInfo info, string email)
        {
            ApplicationUser user = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = string.Format("{0}-{1}-{2}", info.LoginProvider, info.ProviderKey, Guid.NewGuid().ToString("N")),
                Email = email,
                EmailConfirmed = true,
                LockoutEnabled = false
            };

            await this.userManager.CreateAsync(user, DataHelper.GenerateRandomPassword());
            var ir = await this.userManager.AddLoginAsync(user, info);

            if (!ir.Succeeded)
            {
                throw new Exception(ir.Errors.FirstOrDefault().Description);
            }

            return user;
        }

        internal async Task<AuthenticationTicket> CreateTicketAsync(OpenIdConnectRequest request, ApplicationUser user, AuthenticationProperties properties = null)
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
