// <copyright file="DataContext.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess
{
    using System;
    using System.Data;
    using System.Linq;
    using System.Reflection;
    using System.Security.Claims;
    using System.Security.Principal;
    using System.Threading;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.ChangeTracking;
    using Microsoft.EntityFrameworkCore.Storage;

    public partial class DataContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        private readonly ClaimsPrincipal principal;

        private string userName;

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DataContext(DbContextOptions<DataContext> options, IPrincipal principal)
            : base(options)
        {
            this.principal = principal as ClaimsPrincipal;
        }

        public virtual DbSet<CompleteMigration> CompleteMigrations { get; set; }

        public virtual DbSet<UserAcceptedTerm> UserAcceptedTerms { get; set; }

        public virtual DbSet<TermsOfService> TermsOfServices { get; set; }

        public virtual DbSet<Blog> Blogs { get; set; }

        public virtual DbSet<FileStorage> FileStorages { get; set; }

        public virtual DbSet<PersonInformation> PersonInformations { get; set; }

        internal string UserName
        {
            get
            {
                if (string.IsNullOrEmpty(this.userName))
                {
                    this.userName = this.principal?.Identity?.Name ?? "Anonymous";
                }

                return this.userName;
            }

            set => this.userName = value;
        }

        public virtual IDbContextTransaction BeginTransaction()
        {
            return this.Database.BeginTransaction();
        }

        public virtual async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            return await this.Database.BeginTransactionAsync(cancellationToken);
        }

        public virtual async Task<IDbContextTransaction> BeginTransactionAsync(IsolationLevel isolationLevel, CancellationToken cancellationToken = default(CancellationToken))
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

            var entityEntries = entities as EntityEntry[] ?? entities.ToArray();

            if (!entityEntries.Any())
            {
                return;
            }

            var currentUser = this.UserName;

            foreach (EntityEntry entity in entityEntries)
            {
                if (entity.State == EntityState.Added)
                {
                    ((ApplicationEntity)entity.Entity).CreatedBy = currentUser;

                    if (!((ApplicationEntity)entity.Entity).IsActive.HasValue)
                    {
                        ((ApplicationEntity)entity.Entity).IsActive = true;
                    }
                }
                else
                {
                    entity.Property("CreatedBy").IsModified = false;

                    ((ApplicationEntity)entity.Entity).UpdatedBy = currentUser;

                    ((ApplicationEntity)entity.Entity).UpdatedDate = DateTime.Now;
                }
            }
        }
    }
}
