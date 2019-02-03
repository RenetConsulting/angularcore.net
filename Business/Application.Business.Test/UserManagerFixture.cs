namespace Application.Business.Test
{
    using System.Threading.Tasks;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Identity;
    using Moq;
    using Xunit;

    public class UserManagerFixture
    {
        private Mock<IGlobalRepository> mockRepo;

        public UserManagerFixture()
        {
            this.mockRepo = new Mock<IGlobalRepository>();
        }

        [Fact]
        public async Task RegisterAsync_RepoCallValidate()
        {
            UserManager userManager = new UserManager(this.mockRepo.Object);

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
