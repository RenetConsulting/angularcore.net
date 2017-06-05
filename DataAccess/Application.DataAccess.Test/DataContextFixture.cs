namespace Application.DataAccess.Test
{
    using Application.DataAccess.Entities;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using Microsoft.EntityFrameworkCore.Metadata.Conventions;
    using Moq;
    using System;
    using Xunit;

    public class DataContextFixture : IDisposable
    {
        // Flag: Has Dispose already been called?
        private bool disposed = false;

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
        public void OnModelCreatingTest_NoExceptions()
        {
            var dc = new DataContext(new DbContextOptions<DataContext>());
            dc.ApplicationEntityDefaultValueSqlForAllObjects(null);
        }

        private void Dispose(bool disposing)
        {
            if (this.disposed)
            {
                return;
            }

            if (disposing)
            {
                //this.userManager.Dispose();
            }

            this.disposed = true;
        }

    }
}
