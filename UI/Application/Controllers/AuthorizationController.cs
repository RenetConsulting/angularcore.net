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

        // [ServiceFilter(typeof(CoreCaptchaFilter))]
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
                return await this.RefreshTokenGrantType(request);
            }

            return this.BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported."
            });
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

        internal async Task<IActionResult> RefreshTokenGrantType([ModelBinder(typeof(OpenIddictMvcBinder))] OpenIdConnectRequest request)
        {
            try
            {
                // Retrieve the claims principal stored in the refresh token.
                var info = await this.HttpContext.AuthenticateAsync(OpenIdConnectServerDefaults.AuthenticationScheme).ConfigureAwait(false);

                // Retrieve the user profile corresponding to the refresh token.
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
                    Error = OpenIdConnectConstants.Errors.InvalidGrant,
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
