namespace Application.Business.Test
{
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Identity;
    using Moq;
    using Xunit;

    public class UserManagerFixture
    {
        private Mock<IGlobalRepository> mockRepo;

        private Mock<UserManager<ApplicationUser>> mockUserManager;

        private Mock<IUserStore<ApplicationUser>> mockStore;

        public UserManagerFixture()
        {
            this.mockRepo = new Mock<IGlobalRepository>();
            this.mockStore = new Mock<IUserStore<ApplicationUser>>();
            this.mockUserManager = new Mock<UserManager<ApplicationUser>>(this.mockStore.Object, null, null, null, null, null, null, null, null);
        }

        [Fact]
        public async Task RegisterAsync_RepoCallValidate()
        {
            UserManager userManager = new UserManager(this.mockRepo.Object, this.mockUserManager.Object);

            IdentityResult identityResult = new IdentityResult();

            string userName = "abc";
            string password = "password";

            // Setup Moq
            this.mockRepo.Setup(x => x.RegisterUserAsync(userName, password))
                .Returns(Task.FromResult(identityResult)).Verifiable();

            // Run Code
            var result = await userManager.RegisterAsync(userName, password);

            // Validate true result
            Assert.Equal(result, identityResult);
        }
    }
}
