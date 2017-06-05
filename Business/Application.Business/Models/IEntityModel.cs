namespace Application.Business.Models
{
    public interface IEntityModel<TEntity>
        where TEntity : class
    {
        TEntity ToEntity();

        void ToModel(TEntity entity);
    }
}
