namespace Application.Business
{
    using System.Threading.Tasks;
    using Application.Business.Models;
    using Application.DataAccess.Entities;

    public interface IEntityManagement<TEntity>
        where TEntity : ApplicationEntity
    {
        Task<IEntityModel<TEntity>> AddAsync(IEntityModel<TEntity> model);

        Task<IEntityModel<TEntity>> UpdateAsync(IEntityModel<TEntity> model);

        Task<TEntity> FindByIdAsync(params object[] keys);
    }
}