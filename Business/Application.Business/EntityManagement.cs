namespace Application.Business
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Threading.Tasks;
    using Application.Business.Models;
    using Application.DataAccess.Repositories;

    /// <summary>
    /// Generic Entity Management class for CRUD operations on a single TEntity
    /// </summary>
    /// <typeparam name="TEntity">The Entity</typeparam>
    public class EntityManagement<TEntity> : IEntityManagement<TEntity>
        where TEntity : DataAccess.Entities.ApplicationEntity
    {
        public EntityManagement(DataAccess.Repositories.IGlobalRepository repo)
        {
            this.Repository = repo;
        }

        protected IGlobalRepository Repository { get; private set; }

        public async Task<IEntityModel<TEntity>> AddAsync(IEntityModel<TEntity> model)
        {
            model = model ?? throw new ArgumentNullException(nameof(model));

            TEntity entity = model.ToEntity();

            model.ToModel(await this.Repository.AddAsync<TEntity>(entity));

            return model;
        }

        public async Task<IEntityModel<TEntity>> UpdateAsync(IEntityModel<TEntity> model)
        {
            model = model ?? throw new ArgumentNullException(nameof(model));

            TEntity entity = model.ToEntity();
            try
            {
                model.ToModel(await this.Repository.UpdateAsync<TEntity>(entity));

                return model;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException ex)
            {
                model.ToModel(ex.Entries[0].Entity as TEntity);
                throw new UpdateConcurrencyException<IEntityModel<TEntity>>() { Model = model };
            }
        }

        public async Task<TEntity> FindByIdAsync(params object[] keys)
        {
            keys = keys ?? throw new ArgumentNullException(nameof(keys));

            return await this.Repository.FindByIdAsync<TEntity>(keys);
        }

        internal static List<IEntityModel<T>> ToModelList<T, TModel>(T[] list)
            where T : DataAccess.Entities.ApplicationEntity
            where TModel : ApplicationModel, IEntityModel<T>, new()
        {
            List<IEntityModel<T>> models = new List<IEntityModel<T>>();

            foreach (var item in list)
            {
                TModel model = new TModel();
                model.ToModel(item);
                models.Add(model);
            }

            return models;
        }

        internal(int? skip, int? take) ConvertPageCount(int? page, int? count)
        {
            int skip = (page.HasValue && page.Value > 0) ? page.Value - 1 : 0;
            skip = (count.HasValue && count.Value > 0) ? skip * count.Value : 0;

            int? take = (count.HasValue && count.Value <= 0) ? null : count;

            return (skip, take);
        }
    }
}
