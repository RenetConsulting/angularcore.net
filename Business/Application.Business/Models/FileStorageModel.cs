// <copyright file="FileStorageModel.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Models
{
    using System.ComponentModel.DataAnnotations;
    using Application.DataAccess.Entities;

    public class FileStorageModel : ApplicationModel, IEntityModel<FileStorage>
    {
        [StringLength(125)]
        public string FileId { get; set; }

        [StringLength(255)]
        public string Url { get; set; }

        [StringLength(75)]
        public string Title { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        public FileStorage ToEntity()
        {
            return new FileStorage
            {
                FileId = this.FileId,
                Url = this.Url,
                Description = this.Description,
                Title = this.Title,
            };
        }

        public void ToModel(FileStorage entity)
        {
            if (entity != null)
            {
                this.FileId = entity.FileId;
                this.Url = entity.Url;
                this.Description = entity.Description;
                this.Title = entity.Title;
            }
        }
    }
}
