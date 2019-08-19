// <copyright file="BlogModel.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Models
{
    using Application.DataAccess.Entities;

    public class BlogModel : ApplicationModel, IEntityModel<Blog>
    {
        public string BlogId { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public bool Editable { get; set; }

        public string UserId { get; set; }

        public Blog ToEntity()
        {
            return new Blog
            {
                BlogId = this.BlogId,
                Title = this.Title,
                Content = this.Content,
                UserId = this.UserId
            };
        }

        public void ToModel(Blog entity)
        {
            if (entity != null)
            {
                this.BlogId = entity.BlogId;
                this.Title = entity.Title;
                this.Content = entity.Content;
                this.CreatedDate = entity.CreatedDate;
                this.CreatedBy = entity.CreatedBy;
            }
        }
    }
}
