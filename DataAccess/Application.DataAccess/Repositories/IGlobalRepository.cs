namespace Application.DataAccess.Repositories
{
    using System.Diagnostics.CodeAnalysis;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using Application.DataAccess.Enums;
    using Entities;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Storage;

    public interface IGlobalRepository
    {
        #region UserManagement
        Task<ApplicationUser> FindUserByIdAsync(string userId);

        Task<ApplicationUser> FindUserByEmailAsync(string email);

        Task<IdentityResult> UpdateUserAsync(ApplicationUser user);

        Task<IdentityResult> ResetUserPasswordAsync(ApplicationUser user, string token, string newPassword);

        Task<IdentityResult> ResetUserPasswordAsync(string userId, string token, string newPassword);

        Task<string> GenerateUserPasswordResetTokenAsync(ApplicationUser user);

        Task<string> GenerateUserPasswordResetTokenAsync(string userId);

        #endregion

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
        Task<(T[] list, long totalItems)> ItemList<T>(DbSet<T> entity, int? page, int? count, bool? active, PropertyInfo sortFieldName, SortOrder? sortOrder)
            where T : ApplicationEntity;

        Task<T> FindByIdAsync<T>(params object[] keys)
            where T : ApplicationEntity;
    }
}
