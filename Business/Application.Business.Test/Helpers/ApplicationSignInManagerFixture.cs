// <copyright file="ApplicationSignInManagerFixture.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Test.Helpers
{
    using System.Threading.Tasks;
    using DataAccess.Entities;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Moq;
    using Xunit;

    public sealed class ApplicationSignInManagerFixture
    {
        private readonly Mock<UserManager<ApplicationUser>> userManager;
        private readonly IHttpContextAccessor contextAccessor;
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory;
        private readonly IOptions<IdentityOptions> optionsAccessor;
        private readonly ILogger<SignInManager<ApplicationUser>> logger;
        private readonly IAuthenticationSchemeProvider scheme;
        private readonly IUserConfirmation<ApplicationUser> confirmation;

        private readonly Mock<IUserStore<ApplicationUser>> mockStore;

        public ApplicationSignInManagerFixture()
        {
            this.mockStore = new Mock<IUserStore<ApplicationUser>>();
            this.userManager = new Mock<UserManager<ApplicationUser>>(this.mockStore.Object, null, null, null, null, null, null, null, null);
            this.contextAccessor = new Mock<IHttpContextAccessor>().Object;
            this.claimsFactory = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object;
            this.optionsAccessor = new Mock<IOptions<IdentityOptions>>().Object;
            this.logger = new Mock<ILogger<SignInManager<ApplicationUser>>>().Object;
            this.scheme = new Mock<IAuthenticationSchemeProvider>().Object;
            this.confirmation = new Mock<IUserConfirmation<ApplicationUser>>().Object;
        }

        [Fact]
        public async Task ApplicationSignInManager_CanSignIn_ValitadeResult()
        {
            ApplicationSignInManager<ApplicationUser> um = new ApplicationSignInManager<ApplicationUser>(
                    this.userManager.Object,
                    this.contextAccessor,
                    this.claimsFactory,
                    this.optionsAccessor,
                    this.logger,
                    this.scheme,
                    this.confirmation);

            ApplicationUser user = new ApplicationUser
            {
                EmailConfirmed = true
            };

            bool result = await um.CanSignInAsync(user);
            Assert.True(result);
        }

        [Fact]
        public async Task ApplicationSignInManager_CanNotSignIn_ValitadeResult()
        {
            ApplicationSignInManager<ApplicationUser> um = new ApplicationSignInManager<ApplicationUser>(
                    this.userManager.Object,
                    this.contextAccessor,
                    this.claimsFactory,
                    this.optionsAccessor,
                    this.logger,
                    this.scheme,
                    this.confirmation);

            ApplicationUser user = new ApplicationUser();

            bool result = await um.CanSignInAsync(user);
            Assert.False(result);
        }
    }
}
