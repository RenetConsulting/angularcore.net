// <copyright file="BlogService.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Services
{
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
        public async Task<(List<BlogModel>, int)> GetBlogsAsync(int index, int count)
        {
            try
            {
                (List<Blog> blogs, int totalItems) = await this.globalRepository.GetBlogsAsync(index, count).ConfigureAwait(false);

                List<BlogModel> models = new List<BlogModel>();
                foreach (Blog blog in blogs)
                {
                    BlogModel model = new BlogModel();
                    model.ToModel(blog);
                    models.Add(model);
                }

                return (models, totalItems);
            }
            catch
            {
                throw;
            }
        }

        public async Task AddBlogAsync(BlogModel model)
        {
            try
            {
                await this.globalRepository.AddBlogAsync(model.ToEntity()).ConfigureAwait(false);
            }
            catch
            {
                throw;
            }
        }
    }
}
