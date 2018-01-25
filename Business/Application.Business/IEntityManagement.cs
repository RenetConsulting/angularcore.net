namespace Application.Business
{
    using System.Diagnostics.CodeAnalysis;
    using System.Threading.Tasks;
    using Application.Business.Models;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Enums;

    public interface IEntityManagement<TEntity>
        where TEntity : ApplicationEntity
    {
        Task<IEntityModel<TEntity>> AddAsync(IEntityModel<TEntity> model);

        Task<IEntityModel<TEntity>> UpdateAsync(IEntityModel<TEntity> model);

        Task<TEntity> FindByIdAsync(params object[] keys);

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        Task<(IEntityModel<TEntity>[] list, long totalItems)> ListAsync<TModel>(int? page, int? count, bool? active, string sortFieldName, SortOrder? sortOrder)
            where TModel : ApplicationModel, IEntityModel<TEntity>, new();
    }
}