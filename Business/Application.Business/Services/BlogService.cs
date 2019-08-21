// <copyright file="BlogService.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Services
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Threading.Tasks;
    using Application.Business.Interfaces;
    using Application.Business.Models;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;

    public class BlogService : IBlogService
    {
        private readonly IGlobalRepository globalRepository;

        public BlogService(IGlobalRepository globalRepository)
        {
            this.globalRepository = globalRepository;
        }

        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        public async Task<(List<BlogModel>, int)> GetBlogsAsync(int index, int count, string userId)
        {
            try
            {
                (List<Blog> blogs, int totalAmount) = await this.globalRepository.GetBlogsAsync(index, count).ConfigureAwait(false);

                List<BlogModel> models = new List<BlogModel>();

                if (!Equals(userId, null))
                {
                    foreach (Blog blog in blogs)
                    {
                        BlogModel model = new BlogModel();
                        model.ToModel(blog);
                        model.Editable = blog.UserId == userId;
                        models.Add(model);
                    }
                }
                else
                {
                    foreach (Blog blog in blogs)
                    {
                        BlogModel model = new BlogModel();
                        model.ToModel(blog);
                        model.Editable = false;
                        models.Add(model);
                    }
                }

                return (models, totalAmount);
            }
            catch
            {
                throw;
            }
        }

        public async Task<BlogModel> GetBlogAsync(string blogId, string userId)
        {
            try
            {
                Blog blog = await this.globalRepository.GetBlogAsync(blogId).ConfigureAwait(false);
                BlogModel model = new BlogModel();

                if (!Equals(userId, null))
                {
                    model.Editable = blog.UserId == userId;
                }
                else
                {
                    model.Editable = false;
                }

                model.ToModel(blog);

                return model;
            }
            catch
            {
                throw;
            }
        }

        public async Task<BlogModel> AddBlogAsync(BlogModel model, string userId)
        {
            try
            {
                model = model ?? throw new ArgumentNullException(nameof(model));

                userId = userId ?? throw new ArgumentNullException(nameof(userId));

                model.UserId = userId;

                Blog entity = await this.globalRepository.AddBlogAsync(model.ToEntity()).ConfigureAwait(false);

                BlogModel returnModel = new BlogModel();
                returnModel.ToModel(entity);
                returnModel.Editable = true;

                return returnModel;
            }
            catch
            {
                throw;
            }
        }

        public async Task<BlogModel> UpdateBlogAsync(BlogModel model, string userId)
        {
            try
            {
                model = model ?? throw new ArgumentNullException(nameof(model));

                userId = userId ?? throw new ArgumentNullException(nameof(userId));

                Blog entity = await this.globalRepository.UpdateBlogAsync(model.BlogId, model.Title, model.Content, userId).ConfigureAwait(false);

                BlogModel returnModel = new BlogModel();
                returnModel.ToModel(entity);
                returnModel.Editable = true;

                return returnModel;
            }
            catch
            {
                throw;
            }
        }

        public async Task DeleteBlogAsync(string blogId, string userId)
        {
            try
            {
                blogId = blogId ?? throw new ArgumentNullException(nameof(blogId));
                userId = userId ?? throw new ArgumentNullException(nameof(userId));

                await this.globalRepository.DeleteBlogAsync(blogId, userId).ConfigureAwait(false);
            }
            catch
            {
                throw;
            }
        }
    }
}
