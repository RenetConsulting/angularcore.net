﻿// <copyright file="GlobalRepository.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Repositories
{
    using System;
    using System.Collections.Generic;
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

        /// <summary>
        /// Initializes a new instance of the <see cref="GlobalRepository"/> class.
        /// </summary>
        /// <param name="context">The DataContext class</param>
        /// <param name="userManager">Provides the APIs for managing user in a persistence store.</param>
        public GlobalRepository(DataContext context, UserManager<ApplicationUser> userManager)
        {
            this.context = context;
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

            this.context.Add(entity);

            await this.context.SaveChangesAsync();

            return entity;
        }

        public async Task<T> UpdateAsync<T>(T entity)
            where T : ApplicationEntity
        {
            entity = entity ?? throw new ArgumentNullException(nameof(entity));

            this.context.Entry(entity);

            this.context.Update(entity);
            try
            {
                await this.context.SaveChangesAsync();

                return entity;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                await ex.Entries[0].ReloadAsync();
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
        public async Task<(TEntity[] list, long totalItems)> FindItems<TEntity, TAndObject, TOrObject>(TAndObject whereAnd, TOrObject whereOr, int? skip, int? take, PropertyInfo sortFieldProperty, SortOrder? sortOrder)
           where TEntity : ApplicationEntity
        {
            IQueryable<TEntity> selector = this.WhereSelector<TEntity, TAndObject, TOrObject>(whereAnd, whereOr);

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

            return await this.ItemList(entity, skip, take, active, propertyInfo, sortOrder);
        }

        #region Blog

        // any user should see a blog
        public async Task<Blog> GetBlogAsync(string blogId)
        {
            return await this.context.Blogs.Where(bl => bl.BlogId.Equals(blogId)).OrderByDescending(a => a.CreatedDate).FirstOrDefaultAsync();
        }

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        public async Task<(List<Blog>, int)> GetBlogsAsync(int index, int count)
        {
            int totalAmount = await this.context.Blogs.CountAsync();

            List<Blog> blogs = await this.context.Blogs.OrderByDescending(a => a.CreatedDate).Skip(index).Take(count).ToListAsync();

            return (blogs, totalAmount);
        }

        public async Task<Blog> AddBlogAsync(Blog blog)
        {
            await using IDbContextTransaction dbContextTransaction = await this.BeginTransactionAsync();
            try
            {
                blog.BlogId ??= Guid.NewGuid().ToString();

                this.context.Blogs.Add(blog);

                await this.context.SaveChangesAsync();

                await dbContextTransaction.CommitAsync();

                return blog;
            }
            catch
            {
                await dbContextTransaction.RollbackAsync();

                throw;
            }
        }

        public async Task<Blog> UpdateBlogAsync(string blogId, string title, string content, string userId)
        {
            Blog blog = await this.context.Blogs.FirstOrDefaultAsync(bl => bl.IsActive.Value && bl.BlogId.Equals(blogId));

            if (!Equals(blog, null))
            {
                if (!blog.UserId.Equals(userId))
                {
                    throw new Exception("You can update only own blogs!");
                }

                blog.Title = title;
                blog.Content = content;
            }
            else
            {
                throw new Exception($"Blog with id {blogId} not found.");
            }

            await this.context.SaveChangesAsync();

            return blog;
        }

        public async Task<bool> DeleteBlogAsync(string blogId, string userId)
        {
            Blog deleteBlog = await this.context.Blogs.FirstOrDefaultAsync(a => a.IsActive.Value && a.BlogId.Equals(blogId));

            if (!Equals(deleteBlog, null))
            {
                if (!deleteBlog.UserId.Equals(userId))
                {
                    throw new Exception("You can remove only own blogs!");
                }

                this.context.Blogs.Remove(deleteBlog);
            }
            else
            {
                throw new Exception($"Blog with id {blogId} not found.");
            }

            return await this.context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SaveBlogFileAsync(string userId, string fileBlobName, string title)
        {
            FileStorage blogFile = new FileStorage { FileId = fileBlobName, UserId = userId, Title = title ?? string.Empty };

            this.context.FileStorages.Add(blogFile);

            return await this.context.SaveChangesAsync() > 0;
        }

        public async Task<FileStorage> GetBlogFileAsync(string fileBlobName)
        {
            return await this.context.FileStorages.FirstOrDefaultAsync(f => f.FileId.Equals(fileBlobName));
        }

        public async Task<List<FileStorage>> GetAllFilesAsync()
        {
            return await this.context.FileStorages.ToListAsync();
        }

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        public async Task<(List<FileStorage>, int)> GetFileStoragesAsync(string userId, int index, int count)
        {
            var filesQuery = this.context.FileStorages.Where(x => x.UserId == userId);
            int totalAmount = await filesQuery.CountAsync();

            List<FileStorage> fileStorage = await filesQuery
                .OrderByDescending(a => a.CreatedDate)
                .Skip(index)
                .Take(count)
                .ToListAsync();

            return (fileStorage, totalAmount);
        }

        public async Task<bool> DeleteBlogFileAsync(string fileBlobName, string userId)
        {
            var deletedFile = await this.context.FileStorages.FirstOrDefaultAsync(f => f.FileId.Equals(fileBlobName) && f.UserId.Equals(userId));

            if (deletedFile != null)
            {
                this.context.FileStorages.Remove(deletedFile);

                return await this.context.SaveChangesAsync() > 0;
            }
            else
            {
                throw new Exception($"File with {fileBlobName} name not found");
            }
        }

        #endregion

        internal IQueryable<TEntity> WhereSelector<TEntity, TAndObject, TOrObject>(TAndObject whereAnd, TOrObject whereOr)
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
