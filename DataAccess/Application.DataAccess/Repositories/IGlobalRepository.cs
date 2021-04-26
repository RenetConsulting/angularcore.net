// <copyright file="IGlobalRepository.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Repositories
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Threading;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Enums;
    using Microsoft.EntityFrameworkCore.Storage;

    public interface IGlobalRepository
    {
        #region Transactions
        IDbContextTransaction BeginTransaction();

        Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default(CancellationToken));

        Task<IDbContextTransaction> BeginTransactionAsync(System.Data.IsolationLevel isolationLevel, CancellationToken cancellationToken = default(CancellationToken));
        #endregion

        Task<T> AddAsync<T>(T entity)
            where T : class;

        Task<T> UpdateAsync<T>(T entity)
             where T : ApplicationEntity;

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        Task<(TEntity[] list, long totalItems)> ListAsync<TEntity>(int? skip, int? take, bool? active, string sortFieldName, SortOrder? sortOrder)
            where TEntity : ApplicationEntity;

        Task<T> FindByIdAsync<T>(params object[] keys)
            where T : ApplicationEntity;

        Task<bool> SaveBlogFileAsync(string blogId, string fileBlobName, string title);

        Task<FileStorage> GetBlogFileAsync(string fileBlobName);

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        Task<(List<Blog>, int)> GetBlogsAsync(int index, int count);

        Task<Blog> AddBlogAsync(Blog blog);

        Task<Blog> UpdateBlogAsync(string blogId, string title, string content, string userId);

        Task<bool> DeleteBlogFileAsync(string fileBlobName, string userId);

        Task<bool> DeleteBlogAsync(string blogId, string userId);

        Task<Blog> GetBlogAsync(string blogId);

        Task<List<FileStorage>> GetAllFilesAsync();

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        Task<(List<FileStorage>, int)> GetFileStoragesAsync(string userId, int index, int count);

        Task<Person> GetUserProfileAsync(string userId);

        Task<Person> UpdateUserProfileAsync(Person person);

        Task<Person> AddPersonIfDataBaseIsEmpty(string userId);
    }
}
