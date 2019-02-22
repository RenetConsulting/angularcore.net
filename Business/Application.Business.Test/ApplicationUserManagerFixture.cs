// <copyright file="ApplicationUserManagerFixture.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Test
{
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Microsoft.AspNetCore.Identity;
    using Moq;
    using Xunit;

    public class ApplicationUserManagerFixture
    {
        private Mock<IApplicationUserManager<ApplicationUser>> mockIUserManager;

        private Mock<IUserStore<ApplicationUser>> mockStore;

        public ApplicationUserManagerFixture()
        {
            this.mockStore = new Mock<IUserStore<ApplicationUser>>();
            this.mockIUserManager = new Mock<IApplicationUserManager<ApplicationUser>>();
        }

        [Fact]
        public async Task RegisterAsync_CallValidate()
        {
            ApplicationUserManager<ApplicationUser> userManager = new ApplicationUserManager<ApplicationUser>(this.mockStore.Object, null, null, null, null, null, null, null, null)
            {
                Me = this.mockIUserManager.Object
            };

            IdentityResult identityResult = IdentityResult.Success;

            string userName = "abc";
            string password = "password";

            // Setup Moq
            this.mockIUserManager.Setup(x => x.CreateAsync(It.Is<ApplicationUser>(p => p.UserName == userName && p.Email == userName && !p.EmailConfirmed), password))
                .Returns(Task.FromResult(identityResult)).Verifiable();

            // Run Code
            var result = await userManager.CreateAsync(userName, password);

            // Validate true result
            Assert.NotNull(result);
            Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task GeneratePasswordResetTokenAsync_CallValidate()
        {
            ApplicationUserManager<ApplicationUser> userManager = new ApplicationUserManager<ApplicationUser>(this.mockStore.Object, null, null, null, null, null, null, null, null)
            {
                Me = this.mockIUserManager.Object
            };

            string token = "ABC";

            string userId = "abc";

            ApplicationUser user = new ApplicationUser { UserName = "AAA", Id = userId };

            // Setup Moq
            this.mockIUserManager.Setup(x => x.FindByIdAsync(userId))
                .Returns(Task.FromResult(user)).Verifiable();

            this.mockIUserManager.Setup(x => x.GeneratePasswordResetTokenAsync(user))
                .Returns(Task.FromResult(token)).Verifiable();

            // Run Code
            var result = await userManager.GeneratePasswordResetTokenAsync(userId);

            // Validate true result
            Assert.Equal(token, result);
        }

        [Fact]
        public void Me_ValidateNotAssignedValue()
        {
            ApplicationUserManager<ApplicationUser> userManager = new ApplicationUserManager<ApplicationUser>(this.mockStore.Object, null, null, null, null, null, null, null, null);

            Assert.Equal(userManager, userManager.Me);
        }

        [Fact]
        public async Task ResetPasswordAsync_CallValidate()
        {
            ApplicationUserManager<ApplicationUser> userManager = new ApplicationUserManager<ApplicationUser>(this.mockStore.Object, null, null, null, null, null, null, null, null)
            {
                Me = this.mockIUserManager.Object
            };

            string token = "ABC";
            string newPassword = "password";
            string email = "abc@aaa.com";

            IdentityResult identityResult = IdentityResult.Success;

            ApplicationUser user = new ApplicationUser { UserName = "AAA", Id = email };

            // Setup Moq
            this.mockIUserManager.Setup(x => x.FindByEmailAsync(email))
                .Returns(Task.FromResult(user)).Verifiable();

            this.mockIUserManager.Setup(x => x.ResetPasswordAsync(user, token, newPassword))
                .Returns(Task.FromResult(identityResult)).Verifiable();

            // Run Code
            var result = await userManager.ResetPasswordByEmailAsync(email, token, newPassword);

            // Validate true result
            Assert.NotNull(result);
            Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task ChangeUserPasswordAsyncTest_Success()
        {
            ApplicationUserManager<ApplicationUser> userManager = new ApplicationUserManager<ApplicationUser>(this.mockStore.Object, null, null, null, null, null, null, null, null)
            {
                Me = this.mockIUserManager.Object
            };

            System.Security.Claims.ClaimsPrincipal userClaims = new System.Security.Claims.ClaimsPrincipal();
            string oldPassword = "old pass";
            string newPassword = "new pass";
            string confirmNewPassword = "new pass";

            IdentityResult identityResult = IdentityResult.Success;

            ApplicationUser user = new ApplicationUser { UserName = "AAA", Id = "usrId" };

            // Setup Moq
            this.mockIUserManager.Setup(x => x.ChangePasswordAsync(user, oldPassword, newPassword))
                .Returns(Task.FromResult(identityResult)).Verifiable();

            var result = await userManager.ChangeUserPasswordAsync(userClaims, oldPassword, newPassword, confirmNewPassword);

            Assert.NotNull(result);
            Assert.Equal(identityResult.Succeeded, result.Succeeded);
        }
    }
}
