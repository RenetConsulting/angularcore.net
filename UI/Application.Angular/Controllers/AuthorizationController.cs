namespace Application.Controllers
{
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using AspNet.Security.OpenIdConnect.Primitives;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using OpenIddict.Core;
    using OpenIddict.Models;
    using Microsoft.AspNetCore.Http;
    using AspNet.Security.OpenIdConnect.Server;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Http.Authentication;
    using AspNet.Security.OpenIdConnect.Extensions;

    public class AuthorizationController : Controller
    {
        private readonly OpenIddictApplicationManager<OpenIddictApplication> applicationManager;

        private readonly SignInManager<ApplicationUser> signInManager;

        private readonly UserManager<ApplicationUser> userManager;

        public AuthorizationController(
            OpenIddictApplicationManager<OpenIddictApplication> applicationManager,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IGlobalRepository repository)
            : base()
        {
            this.applicationManager = applicationManager;
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        // TODO: move logic into business class
        [HttpPost("~/connect/token")]
        [Produces("application/json")]
        public async Task<IActionResult> Exchange(OpenIdConnectRequest request)
        {
            Debug.Assert(
                request.IsTokenRequest(),
                "The OpenIddict binder for ASP.NET Core MVC is not registered. " + "Make sure services.AddOpenIddict().AddMvcBinders() is correctly called.");

            if (request.IsPasswordGrantType())
            {
                var user = await this.userManager.FindByNameAsync(request.Username);
                if (user == null)
                {
                    var responseError = new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The username/password couple is invalid."
                    };

                    return this.StatusCode(StatusCodes.Status401Unauthorized, responseError);
                }

                // Ensure the user is allowed to sign in.
                if (!await this.signInManager.CanSignInAsync(user))
                {
                    OpenIdConnectResponse openIdConnectResponse = new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user is not allowed to sign in."
                    };

                    return this.StatusCode(StatusCodes.Status403Forbidden, openIdConnectResponse);
                }

                // Reject the token request if two-factor authentication has been enabled by the user.
                if (this.userManager.SupportsUserTwoFactor && await this.userManager.GetTwoFactorEnabledAsync(user))
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user is not allowed to sign in."
                    });
                }

                // Ensure the user is not already locked out.
                if (this.userManager.SupportsUserLockout && await this.userManager.IsLockedOutAsync(user))
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The username/password couple is invalid.."
                    });
                }

                // Ensure the password is valid.
                if (!await this.userManager.CheckPasswordAsync(user, request.Password))
                {
                    if (this.userManager.SupportsUserLockout)
                    {
                        await this.userManager.AccessFailedAsync(user);
                    }

                    var responseError = new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The username/password couple is invalid..."
                    };

                    return this.StatusCode(StatusCodes.Status401Unauthorized, responseError);
                }

                // Validate T&C
                string userAcceptedTerms = this.HttpContext.Request.Headers["AcceptedTerms"];
                bool acceptedTerms;
                if (!bool.TryParse(userAcceptedTerms, out acceptedTerms))
                {
                    acceptedTerms = false;
                }

                //var userTerms = await this.Repository.GetUserTermsAsync(user.Id, acceptedTerms);
                //if (userTerms == null)
                //{
                //    return this.BadRequest(new OpenIdConnectResponse
                //    {
                //        Error = "40004",
                //        ErrorDescription = "Please accept the new version Term of Service."
                //    });
                //}

                if (this.userManager.SupportsUserLockout)
                {
                    await this.userManager.ResetAccessFailedCountAsync(user);
                }

                // Create a new authentication ticket.
                var ticket = await this.CreateTicketAsync(request, user);

                return this.SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if (request.IsRefreshTokenGrantType())
            {
                // Retrieve the claims principal stored in the refresh token.
                var info = await this.HttpContext.Authentication.GetAuthenticateInfoAsync(
                    OpenIdConnectServerDefaults.AuthenticationScheme);

                // Retrieve the user profile corresponding to the refresh token.
                var user = await this.userManager.GetUserAsync(info.Principal);
                if (user == null)
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The refresh token is no longer valid."
                    });
                }

                // Ensure the user is still allowed to sign in.
                if (!await this.signInManager.CanSignInAsync(user))
                {
                    return this.BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The user is no longer allowed to sign in."
                    });
                }

                // Create a new authentication ticket, but reuse the properties stored
                // in the refresh token, including the scopes originally granted.
                var ticket = await this.CreateTicketAsync(request, user, info.Properties);

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
