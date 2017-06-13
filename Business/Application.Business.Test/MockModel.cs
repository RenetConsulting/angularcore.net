namespace Application.Business.Test
{
    using System;
    using Application.Business.Models;

    public class MockModel : ApplicationModel, IEntityModel<MockEntity>
    {
        public int Id { get; set; }

        public MockEntity ToEntity()
        {
            return new MockEntity
            {
                Id = this.Id,

                IsActive = this.IsActive,
                Timestamp = this.Timestamp,
            };
        }

        public MockEntity ToEntity(MockEntity entity)
        {
            base.ToEntity(entity);

            entity.Id = this.Id;

            return entity;
        }

        public void ToModel(MockEntity entity)
        {
            this.EntityToModel(entity);

            this.Id = entity.Id;
        }
    }
}
