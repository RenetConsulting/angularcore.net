// <copyright file="ApplicationModel.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Models
{
    using System;
    using Application.DataAccess.Entities;

    public abstract class ApplicationModel
    {
        public DateTime CreatedDate { get; protected set; }

        public DateTime? UpdatedDate { get; private set; }

        public bool IsActive { get; set; }

        public virtual string Timestamp { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }

        /// <summary>
        /// The method assign values of this object to the passing ApplicationEntity
        /// </summary>
        /// <param name="entity">The non null ApplicationEntity</param>
        protected void ToEntity(ApplicationEntity entity)
        {
            entity = entity ?? throw new ArgumentNullException(nameof(entity));

            entity.IsActive = this.IsActive;
            entity.Timestamp = this.Timestamp;
        }

        /// <summary>
        /// The method assign the property of the ApplicationEntity to this  model
        /// </summary>
        /// <param name="entity">The non null ApplicationEntity</param>
        protected void EntityToModel(ApplicationEntity entity)
        {
            entity = entity ?? throw new ArgumentNullException(nameof(entity));

            this.IsActive = entity.IsActive ?? true;
            this.Timestamp = entity.Timestamp;
            this.CreatedDate = entity.CreatedDate;
            this.UpdatedDate = entity.UpdatedDate;
            this.CreatedBy = entity.CreatedBy;
            this.UpdatedBy = entity.UpdatedBy;
        }
    }
}
