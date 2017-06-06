namespace Application.DataAccess.Test
{
    using Application.DataAccess.Entities;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;

    public partial class DataContextMock : Application.DataAccess.DataContext
    {
        public DataContextMock(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<MockEntity> MockEntities { get; set; }
    }
}
