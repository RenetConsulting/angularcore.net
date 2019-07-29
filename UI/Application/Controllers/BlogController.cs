// <copyright file="BlogController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using Application.Business.Interfaces;
    using Application.Business.Models;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// TODO: create integaration with SignalR
    /// TODO: create logic
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IGlobalRepository repository;

        private readonly IOptions<AppSettings> appSettings;

        private readonly IBlogService blogService;

        public BlogController(IGlobalRepository repository, IOptions<AppSettings> appSettings, IBlogService blogService)
        {
            this.repository = repository;

            this.appSettings = appSettings;

            this.blogService = blogService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBlog(BlogModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                await this.blogService.AddBlogAsync(model).ConfigureAwait(false);

                return this.Ok();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetBlogs(int index, int count)
        {
            try
            {
                (List<BlogModel> items, int itemsAmount) = await this.blogService.GetBlogsAsync(index, count);

                return this.Ok();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpGet("{blogId}")]
        public IActionResult GetBlog(string blogId)
        {
            // BlogModel model = this.items.Find(x => x.BlogId == blogId);
            return this.Ok();
        }

        [HttpPatch]
        public IActionResult UpdateBlog(BlogModel model)
        {
            return this.Ok(true);
        }

        [HttpDelete("{blogId}")]
        public IActionResult DeleteBlog(string blogId)
        {
            // this.items.Remove(this.items.Find(x => x.BlogId == blogId));
            return this.Ok();
        }
    }
}