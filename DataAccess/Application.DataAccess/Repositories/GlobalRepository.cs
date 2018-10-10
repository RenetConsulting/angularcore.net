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

        #region UserManagement

        public async Task<IdentityResult> RegisterUserAsync(string password, string email)
        {
            ApplicationUser user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = false
            };

            var result = await this.userManager.CreateAsync(user, password);

            return result;
        }

        public async Task<IdentityResult> RegisterUserAsync(string password, ApplicationUser user)
        {
            try
            {
                return await this.userManager.CreateAsync(user, password);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Finds and returns a user, if any, who has the specified userId.
        /// </summary>
        /// <param name="userId">The user ID to search for.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing</returns>
        public async Task<ApplicationUser> FindUserByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException("userId");
            }

            return await this.userManager.FindByIdAsync(userId);
        }

        /// <summary>
        /// Gets the user, if any, associated with the normalized value of the specified email address.
        /// </summary>
        /// <param name="email">The email address to return the user for.</param>
        /// <returns>The task object containing the results of the asynchronous lookup operation, the user, if any, associated with a normalized value of the specified email address.</returns>
        public async Task<ApplicationUser> FindUserByEmailAsync(string email)
        {
            return await this.userManager.FindByEmailAsync(email);
        }

        /// <summary>
        /// Updates the specified user in the backing store.
        /// </summary>
        /// <param name="user">The user to update.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing the Microsoft.AspNetCore.Identity.IdentityResult of the operation.</returns>
        /// <exception cref="ArgumentNullException">Throw ArgumentNullException if the user is null</exception>
        public async Task<IdentityResult> UpdateUserAsync(ApplicationUser user)
        {
            user = user ?? throw new ArgumentNullException(nameof(user));

            return await this.userManager.UpdateAsync(user);
        }

        /// <summary>
        /// Resets the user's password to the specified newPassword after validating the given password reset token.
        /// </summary>
        /// <param name="user">The user whose password should be reset.</param>
        /// <param name="token">The password reset token to verify.</param>
        /// <param name="newPassword">The new password to set if reset token verification fails.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing the Microsoft.AspNetCore.Identity.IdentityResult of the operation.</returns>
        /// <exception cref="System.ArgumentNullException">Throw ArgumentNullException if the ApplicationUser parameter is null</exception>
        public async Task<IdentityResult> ResetUserPasswordAsync(ApplicationUser user, string token, string newPassword)
        {
            user = user ?? throw new ArgumentNullException(nameof(user));

            return await this.userManager.ResetPasswordAsync(user, token, newPassword);
        }

        /// <summary>
        /// Resets the user's password to the specified newPassword after validating the given password reset token.
        /// </summary>
        /// <param name="userId">The userId whose password should be reset.</param>
        /// <param name="token">The password reset token to verify.</param>
        /// <param name="newPassword">The new password to set if reset token verification fails.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing the Microsoft.AspNetCore.Identity.IdentityResult of the operation.</returns>
        /// <exception cref="System.ArgumentNullException">Throw ArgumentNullException if the userId parameter is null or empty or user not found</exception>
        public async Task<IdentityResult> ResetUserPasswordAsync(string userId, string token, string newPassword)
        {
            ApplicationUser user = await this.FindUserByIdAsync(userId);

            return await this.ResetUserPasswordAsync(user, token, newPassword);
        }

        /// <summary>
        /// Generates a password reset token for the specified user, using the configured password reset token provider.
        /// </summary>
        /// <param name="user">The user to generate a password reset token for.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing a password reset token for the specified user.</returns>
        /// <exception cref="System.ArgumentNullException">Throw ArgumentNullException if the ApplicationUser parameter is null</exception>
        public async Task<string> GenerateUserPasswordResetTokenAsync(ApplicationUser user)
        {
            user = user ?? throw new ArgumentNullException(nameof(user));

            return await this.userManager.GeneratePasswordResetTokenAsync(user);
        }

        /// <summary>
        /// Generates a password reset token for the specified user, using the configured password reset token provider.
        /// </summary>
        /// <param name="userId">The userId to generate a password reset token for.</param>
        /// <returns>The System.Threading.Tasks.Task that represents the asynchronous operation, containing a password reset token for the specified user.</returns>
        /// <exception cref="System.ArgumentNullException">Throw ArgumentNullException if the userId parameter is null or empty or user not found</exception>
        public async Task<string> GenerateUserPasswordResetTokenAsync(string userId)
        {
            ApplicationUser user = await this.FindUserByIdAsync(userId);

            return await this.GenerateUserPasswordResetTokenAsync(user);
        }

        #endregion

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
