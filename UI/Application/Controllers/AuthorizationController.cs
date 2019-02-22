// <copyright file="AuthorizationController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.DataAccess.Entities;
    using AspNet.Security.OpenIdConnect.Extensions;
    using AspNet.Security.OpenIdConnect.Primitives;
    using AspNet.Security.OpenIdConnect.Server;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Mvc;
    using OpenIddict.Abstractions;
    using OpenIddict.Mvc.Internal;

    public class AuthorizationController : Controller
    {
        private readonly ApplicationSignInManager<ApplicationUser> signInManager;

        private readonly ApplicationUserManager<ApplicationUser> userManager;

        public AuthorizationController(
            ApplicationSignInManager<ApplicationUser> signInManager,
            ApplicationUserManager<ApplicationUser> userManager)
            : base()
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        [HttpPost("~/connect/token")]
        [Produces("application/json")]
        public async Task<IActionResult> Exchange([ModelBinder(typeof(OpenIddictMvcBinder))] OpenIdConnectRequest request, string hash, string captcha)
        {
            return await this.Exchange(request);

            // For now ignore Captcha validation
            if (!string.IsNullOrEmpty(hash) && !string.IsNullOrEmpty(captcha))
            {
                // Validate Captcha
                using (HttpClient client = new HttpClient())
                {
                    string captchaValidate = string.Format("http://localhost:7071/api/CaptchaValidate?hash={0}&captcha={1}&clientId={2}", hash, captcha, "12345");

                    HttpResponseMessage response = await client.GetAsync(captchaValidate);

                    if (response.IsSuccessStatusCode)
                    {
                        return await this.Exchange(request);
                    }
                }
            }

            return this.BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.InvalidRequest,
                ErrorDescription = "Invalid Captcha."
            });
        }

        public async Task<IActionResult> Exchange([ModelBinder(typeof(OpenIddictMvcBinder))] OpenIdConnectRequest request)
        {
            if (request.IsPasswordGrantType())
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
                        ErrorDescription = "Please confirm your email address."
                    });
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

            return this.BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported."
            });
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
