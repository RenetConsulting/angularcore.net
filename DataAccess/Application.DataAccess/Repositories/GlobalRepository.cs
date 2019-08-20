// <copyright file="GlobalRepository.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Repositories
{
    using System;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Enums;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Storage;

    public class GlobalRepository : IGlobalRepository
    {
        private readonly DataContext context;

        private readonly UserManager<ApplicationUser> userManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="GlobalRepository"/> class.
        /// </summary>
        /// <param name="context">The DataContext class</param>
        /// <param name="userManager">Provides the APIs for managing user in a persistence store.</param>
        public GlobalRepository(DataContext context, UserManager<ApplicationUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        #region Transactions

        public IDbContextTransaction BeginTransaction()
        {
            return this.context.BeginTransaction();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            return await this.context.BeginTransactionAsync(cancellationToken);
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync(System.Data.IsolationLevel isolationLevel, CancellationToken cancellationToken = default(CancellationToken))
        {
            return await this.context.BeginTransactionAsync(isolationLevel, cancellationToken);
        }

        #endregion

        public async Task<T> AddAsync<T>(T entity)
            where T : class
        {
            entity = entity ?? throw new ArgumentNullException(nameof(entity));

            this.context.Add<T>(entity);

            int savedRecords = await this.context.SaveChangesAsync();

            return entity;
        }

        public async Task<T> UpdateAsync<T>(T entity)
            where T : ApplicationEntity
        {
            entity = entity ?? throw new ArgumentNullException(nameof(entity));

            var entry = this.context.Entry(entity);

            this.context.Update<T>(entity);
            try
            {
                int savedRecords = await this.context.SaveChangesAsync();

                return entity;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                ex.Entries[0].Reload();
                throw;
            }
        }

        public async Task<T> FindByIdAsync<T>(params object[] keys)
            where T : ApplicationEntity
        {
            keys = keys ?? throw new ArgumentNullException(nameof(keys));

            return await this.context.FindAsync<T>(keys);
        }

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        public async Task<(TEntity[] list, long totalItems)> FindItems<TEntity, KAndObject, KOrObject>(KAndObject whereAnd, KOrObject whereOr, int? skip, int? take, PropertyInfo sortFieldProperty, SortOrder? sortOrder)
           where TEntity : ApplicationEntity
        {
            IQueryable<TEntity> selector = this.WhereSelector<TEntity, KAndObject, KOrObject>(whereAnd, whereOr);

            selector = SortSelector(sortFieldProperty, sortOrder, selector);

            long totalItems = await selector.LongCountAsync();

            selector = SkipAndTakeSelector(skip, take, selector);

            return (await selector.ToArrayAsync(), totalItems);
        }

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        public async Task<(T[] list, long totalItems)> ItemList<T>(IQueryable<T> selector, int? skip, int? take, bool? active, PropertyInfo sortFieldProperty, SortOrder? sortOrder)
            where T : ApplicationEntity
        {
            selector = ActiveSelector(active, selector);

            selector = SortSelector(sortFieldProperty, sortOrder, selector);

            long totalItems = await selector.LongCountAsync();

            selector = SkipAndTakeSelector(skip, take, selector);

            return (await selector.ToArrayAsync(), totalItems);
        }

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        public async Task<(TEntity[] list, long totalItems)> ListAsync<TEntity>(int? skip, int? take, bool? active, string sortFieldName, SortOrder? sortOrder)
            where TEntity : ApplicationEntity
        {
            PropertyInfo propertyInfo = string.IsNullOrEmpty(sortFieldName) ? null : SortFieldPropertyInfo<TEntity>(sortFieldName);

            DbSet<TEntity> entity = this.context.Set<TEntity>();

            return await this.ItemList<TEntity>(entity, skip, take, active, propertyInfo, sortOrder);
        }

        public async Task<Person> GetUserProfileAsync(string userId)
        {
            return await this.context.Person.Where(p => p.UserId.Equals(userId)).FirstOrDefaultAsync();
        }

        public async Task<Person> UpdateUserProfileAsync(Person person)
        {
            person = person ?? throw new ArgumentNullException(nameof(person));

            this.context.Update(person);

            await this.context.SaveChangesAsync();

            return person;
        }

        internal IQueryable<TEntity> WhereSelector<TEntity, KAndObject, KOrObject>(KAndObject whereAnd, KOrObject whereOr)
             where TEntity : ApplicationEntity
        {
            DbSet<TEntity> entity = this.context.Set<TEntity>();

            IQueryable<TEntity> selector = DataExpression.BuildWhereSelector(entity, whereAnd, whereOr);

            return selector;
        }

        private static PropertyInfo SortFieldPropertyInfo<T>(string sortFieldName)
        {
            return typeof(T).GetProperty(sortFieldName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
        }

        private static IQueryable<T> SkipAndTakeSelector<T>(int? skip, int? take, IQueryable<T> selector)
            where T : ApplicationEntity
        {
            if (skip.HasValue)
            {
                selector = selector.Skip(skip.Value);
            }

            if (take.HasValue)
            {
                selector = selector.Take(take.Value);
            }

            return selector;
        }

        private static IQueryable<T> ActiveSelector<T>(bool? active, IQueryable<T> selector)
            where T : ApplicationEntity
        {
            if (active.HasValue)
            {
                selector = selector.Where(x => x.IsActive == active.Value);
            }

            return selector;
        }

        private static IQueryable<T> SortSelector<T>(PropertyInfo sortFieldProperty, SortOrder? sortOrder, IQueryable<T> selector)
            where T : ApplicationEntity
        {
            if (sortFieldProperty != null)
            {
                SortOrder order = sortOrder ?? SortOrder.Ascending;
                if (order == SortOrder.Descending)
                {
                    selector = selector.OrderByDescending(x => sortFieldProperty.GetValue(x, null));
                }
                else
                {
                    selector = selector.OrderBy(x => sortFieldProperty.GetValue(x, null));
                }
            }

            return selector;
        }
    }
}
