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

        public void ToModel(MockEntity entity)
        {
            entity = entity ?? throw new ArgumentNullException(nameof(entity));

            this.Id = entity.Id;

            this.IsActive = entity.IsActive;
            this.Timestamp = entity.Timestamp;
            this.CreatedDate = entity.CreatedDate;
            this.UpdatedDate = entity.UpdatedDate;
        }
    }
}
