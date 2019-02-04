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
            string userId = "abc";

            IdentityResult identityResult = IdentityResult.Success;

            ApplicationUser user = new ApplicationUser { UserName = "AAA", Id = userId };

            // Setup Moq
            this.mockIUserManager.Setup(x => x.FindByIdAsync(userId))
                .Returns(Task.FromResult(user)).Verifiable();

            this.mockIUserManager.Setup(x => x.ResetPasswordAsync(user, token, newPassword))
                .Returns(Task.FromResult(identityResult)).Verifiable();

            // Run Code
            var result = await userManager.ResetPasswordAsync(userId, token, newPassword);

            // Validate true result
            Assert.NotNull(result);
            Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task FindUserByEmailAsyncTest_ReturnsSuccessResult()
        {
            ApplicationUserManager<ApplicationUser> userManager = new ApplicationUserManager<ApplicationUser>(this.mockStore.Object, null, null, null, null, null, null, null, null)
            {
                Me = this.mockIUserManager.Object
            };

            ApplicationUser applicationUser = new ApplicationUser { UserName = "Carrot", Email = "myEmail@gmail.com" };

            // Setup Moq
            this.mockIUserManager.Setup(x => x.FindByEmailAsync(applicationUser.Email))
                .Returns(Task.FromResult(applicationUser));

            // Run Code
            var result = await userManager.FindUserByEmailAsync(applicationUser.Email);

            // Validate result
            Assert.NotNull(result);
            Assert.Equal(applicationUser.Email, result.Email);
        }
    }
}
