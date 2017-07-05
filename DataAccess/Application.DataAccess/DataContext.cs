namespace Application.DataAccess
{
    using System;
    using System.Data;
    using System.Linq;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using Entities;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Storage;

    public partial class DataContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<UserAcceptedTerm> UserAcceptedTerms { get; set; }

        public virtual DbSet<TermsOfService> TermsOfServices { get; set; }

        public IDbContextTransaction BeginTransaction()
        {
            return this.Database.BeginTransaction();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            return await this.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync(IsolationLevel isolationLevel, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await this.Database.BeginTransactionAsync(isolationLevel, cancellationToken);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            this.AddTimestamps();

            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            this.AddTimestamps();

            return base.SaveChanges();
        }

        internal void ApplicationEntityDefaultValueSqlForAllObjects(ModelBuilder builder)
        {
            // Execute ApplicationEntityDefaultValueSql for every child of the ApplicationEntity
            var applicationEntityTypes = typeof(ApplicationEntity).GetTypeInfo().Assembly.GetTypes().Where(
                t => t.GetTypeInfo().IsClass
                && typeof(ApplicationEntity).IsAssignableFrom(t)
                && !t.GetTypeInfo().IsAbstract
                && t.GetTypeInfo().IsSubclassOf(typeof(ApplicationEntity)));

            foreach (Type type in applicationEntityTypes)
            {
                var dbSetType = this.GetType()
                    .GetRuntimeProperties()
                    .Where(o => o.PropertyType.GetTypeInfo().IsGenericType && o.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>) && o.PropertyType.GenericTypeArguments.Contains(type))
                    .FirstOrDefault();

                if (dbSetType != null)
                {
                    MethodInfo method = typeof(DataContext).GetMethod("ApplicationEntityDefaultValueSql", BindingFlags.Instance | BindingFlags.NonPublic);
                    if (method == null)
                    {
                        throw new NotImplementedException("The 'ApplicationEntityDefaultValueSql' method is not implemented");
                    }

                    MethodInfo generic = method.MakeGenericMethod(type);
                    generic?.Invoke(this, new object[] { builder });
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            this.ApplicationEntityDefaultValueSqlForAllObjects(builder);

            builder.Entity<UserAcceptedTerm>()
                .HasKey(t => new { t.UserId, t.TermsOfServiceId });

        }

        private ModelBuilder ApplicationEntityDefaultValueSql<TEntity>(ModelBuilder builder)
            where TEntity : ApplicationEntity
        {
            string currentDate = "GETDATE()";

            return builder?.Entity<TEntity>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql(currentDate);
                entity.Property(e => e.UpdatedDate).HasComputedColumnSql(currentDate);
                entity.Property(e => e.IsActive).HasDefaultValueSql("1");
            });
        }

        private void AddTimestamps()
        {
            var entities = this.ChangeTracker.Entries().Where(x => x.Entity is ApplicationEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            var user = System.Security.Claims.ClaimsPrincipal.Current ?? throw new System.UnauthorizedAccessException("User is logoff");

            var currentUse = user?.Claims.Where(c => c.Type == "sub").Select(c => c.Value).SingleOrDefault(); // OpenIdConnectConstants.Claims.Subject

            foreach (var entity in entities)
            {
                if (entity.State == EntityState.Added)
                {
                    ((ApplicationEntity)entity.Entity).CreatedBy = currentUse;
                }
                else
                {
                    entity.Property("CreatedBy").IsModified = false;
                }

                ((ApplicationEntity)entity.Entity).UpdatedBy = currentUse;
            }
        }
    }
}
