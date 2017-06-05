namespace Application.Business.Models
{
    using System;
    using Application.DataAccess.Entities;

    public abstract class ApplicationModel
    {
        public DateTime CreatedDate { get; protected set; }

        public DateTime? UpdatedDate { get; protected set; }

        public bool IsActive { get; set; }

        public virtual string Timestamp { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }

        protected void ToEntity(ApplicationEntity entity)
        {
            entity.IsActive = this.IsActive;
            entity.Timestamp = this.Timestamp;
        }

        protected void EntityToModel(ApplicationEntity entity)
        {
            this.IsActive = entity.IsActive;
            this.Timestamp = entity.Timestamp;
            this.CreatedDate = entity.CreatedDate;
            this.UpdatedDate = entity.UpdatedDate;
            this.CreatedBy = entity.CreatedBy;
            this.UpdatedBy = entity.UpdatedBy;
        }
    }
}
