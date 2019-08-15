// <copyright file="ApplicationUserManagerFixture.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Test.Management
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Microsoft.AspNetCore.Identity;
    using Moq;
    using Xunit;

    public sealed class ApplicationUserManagerFixture
    {
        private readonly Mock<IApplicationUserManager<ApplicationUser>> mockIUserManager;

        private readonly Mock<IUserStore<ApplicationUser>> mockStore;

        private readonly ApplicationUserManager<ApplicationUser> userManager;

        public ApplicationUserManagerFixture()
        {
            this.mockStore = new Mock<IUserStore<ApplicationUser>>();
            this.mockIUserManager = new Mock<IApplicationUserManager<ApplicationUser>>();
            this.userManager = new ApplicationUserManager<ApplicationUser>(this.mockStore.Object, null, null, null, null, null, null, null, null)
            {
                Me = this.mockIUserManager.Object
            };
        }

        [Fact]
        private async Task RegisterAsync_CallValidate()
        {
            IdentityResult identityResult = IdentityResult.Success;

            string userName = "Andrew";
            string password = "12345qwerty!";

            // Setup Moq
            this.mockIUserManager.Setup(x => x.CreateAsync(It.Is<ApplicationUser>(p => p.UserName == userName && p.Email == userName && !p.EmailConfirmed), password))
                .Returns(Task.FromResult(identityResult)).Verifiable();

            // Run Code
            var result = await this.userManager.CreateAsync(userName, password);

            // Validate true result
            Assert.NotNull(result);
            Assert.True(result.Succeeded);
        }

        [Fact]
        private async Task GeneratePasswordResetTokenAsync_CallValidate()
        {
            string token = "9uwu47UMr0yUhW4om/LUxQ==";

            string userId = "FE9E0A84-39CF-4569-9732-ACDE93F9A127";

            ApplicationUser user = new ApplicationUser { UserName = "Andrew", Id = userId };

            // Setup Moq
            this.mockIUserManager.Setup(x => x.FindByIdAsync(userId))
                .Returns(Task.FromResult(user)).Verifiable();

            this.mockIUserManager.Setup(x => x.GeneratePasswordResetTokenAsync(user))
                .Returns(Task.FromResult(token)).Verifiable();

            // Run Code
            var result = await this.userManager.GeneratePasswordResetTokenAsync(userId);

            // Validate true result
            Assert.Equal(token, result);
        }

        [Fact]
        private void Me_ValidateNotAssignedValue()
        {
            ApplicationUserManager<ApplicationUser> userMeManager = new ApplicationUserManager<ApplicationUser>(this.mockStore.Object, null, null, null, null, null, null, null, null);

            Assert.Equal(userMeManager, userMeManager.Me);
        }

        [Fact]
        private async Task ResetPasswordAsync_CallValidate()
        {
            string token = "9uwu47UMr0yUhW4om/LUxQ==";
            string newPassword = "12345qwerty!!";
            string email = "email@mail.com";

            IdentityResult identityResult = IdentityResult.Success;

            ApplicationUser user = new ApplicationUser { UserName = "Andrew", Id = email };

            // Setup Moq
            this.mockIUserManager.Setup(x => x.FindByEmailAsync(email))
                .Returns(Task.FromResult(user)).Verifiable();

            this.mockIUserManager.Setup(x => x.ResetPasswordAsync(user, token, newPassword))
                .Returns(Task.FromResult(identityResult)).Verifiable();

            // Run Code
            var result = await this.userManager.ResetPasswordByEmailAsync(email, token, newPassword);

            // Validate true result
            Assert.NotNull(result);
            Assert.True(result.Succeeded);
        }

        [Fact]

        // TODO: Need review
        private async Task ChangeUserPasswordAsyncTest_Success()
        {
            System.Security.Claims.ClaimsPrincipal userClaims = new System.Security.Claims.ClaimsPrincipal();
            string oldPassword = "12345qwerty!";
            string newPassword = "12345qwerty!!";
            string confirmNewPassword = "12345qwerty!!";

            ApplicationUser user = new ApplicationUser { UserName = "Andrew", Id = "FE9E0A84-39CF-4569-9732-ACDE93F9A127" };
            user = await this.userManager.GetUserAsync(userClaims);
            IdentityResult identityResult = IdentityResult.Success;

            var cp = new Mock<ClaimsPrincipal>();
            cp.Setup(m => m.HasClaim(It.IsAny<string>(), It.IsAny<string>()))
              .Returns(true);

            // Setup Moq
            this.mockIUserManager.Setup(x => x.ChangePasswordAsync(user, oldPassword, newPassword))
                .Returns(Task.FromResult(identityResult)).Verifiable();

            var result = await this.userManager.ChangeUserPasswordAsync(userClaims, oldPassword, newPassword, confirmNewPassword);

            Assert.NotNull(result);
            Assert.Equal(identityResult.Succeeded, result.Succeeded);
        }

        [Fact]
        private async Task GeneratePasswordResetTokenByEmailAsyncTest_Success()
        {
            string token = "9uwu47UMr0yUhW4om/LUxQ==";

            string userEmail = "email@mail.com";

            ApplicationUser user = new ApplicationUser { UserName = "Andrew", Email = userEmail, Id = "FE9E0A84-39CF-4569-9732-ACDE93F9A127" };

            // Setup Moq
            this.mockIUserManager.Setup(x => x.FindByEmailAsync(userEmail))
                .Returns(Task.FromResult(user)).Verifiable();

            this.mockIUserManager.Setup(x => x.GeneratePasswordResetTokenAsync(user))
                .Returns(Task.FromResult(token)).Verifiable();

            // Run Code
            var result = await this.userManager.GeneratePasswordResetTokenByEmailAsync(userEmail);

            // Validate true result
            Assert.Equal(token, result);
        }
    }
}
