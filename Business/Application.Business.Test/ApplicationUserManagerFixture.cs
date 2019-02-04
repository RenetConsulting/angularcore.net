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
        public async Task RegisterAsync_RepoCallValidate()
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
            var result = await userManager.RegisterAsync(userName, password);

            // Validate true result
            Assert.NotNull(result);
            Assert.True(result.Succeeded);
        }
    }
}
