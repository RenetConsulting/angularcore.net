namespace Application.DataAccess.Test
{
    using Microsoft.EntityFrameworkCore;

    public partial class DataContextMock : DataContext
    {
        public DataContextMock(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<MockEntity> MockEntities { get; set; }
    }
}
