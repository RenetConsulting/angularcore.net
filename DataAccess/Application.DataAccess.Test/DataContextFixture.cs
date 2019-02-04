namespace Application.DataAccess.Test
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Test.MockDbSet;
    using Microsoft.EntityFrameworkCore;
    using Moq;
    using Xunit;

    public class DataContextFixture : IDisposable
    {
        private DataContextMock context;

        // connection string not really used in tests, but need to setup options for context. Also it should not be empty
        private string connectionString = "Data Source=FakeDB";

        // Flag: Has Dispose already been called?
        private bool disposed = false;

        public DataContextFixture()
        {
            var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
            optionsBuilder.UseInMemoryDatabase(this.connectionString);

            this.context = new DataContextMock(optionsBuilder.Options);
        }

        ~DataContextFixture()
        {
            this.Dispose(false);
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        [Fact]
        public async Task SaveChangesAsyncTest_AddedApplicationEntity()
        {
            MockEntity mockEntity = new MockEntity()
            {
                FirstName = "Andrey",
                MiddleName = "Sorry, no have",
                LastName = "Random",
                Email = "myEmail@gmail.com"
            };

            this.context.MockEntities.Add(mockEntity);

            CancellationToken cancellationToken = default(CancellationToken);

            var result = await this.context.SaveChangesAsync(cancellationToken);

            Assert.Equal(1, result);

            Assert.Equal("Anonymous", mockEntity.CreatedBy);
            Assert.True(mockEntity.IsActive);
        }

        private void Dispose(bool disposing)
        {
            if (this.disposed)
            {
                return;
            }

            if (disposing)
            {
                // this.userManager.Dispose();
            }

            this.disposed = true;
        }
    }
}
