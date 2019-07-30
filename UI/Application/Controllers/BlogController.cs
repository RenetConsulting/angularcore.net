// <copyright file="BlogController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Application.Business.Interfaces;
    using Application.Business.Models;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

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
        public async Task<IActionResult> CreateBlogAsync(BlogModel model)
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
        public async Task<IActionResult> GetBlogsAsync(int index, int count)
        {
            try
            {
                (List<BlogModel> items, int totalAmount) = await this.blogService.GetBlogsAsync(index, count).ConfigureAwait(false);

                return this.Ok(new { Items = items, TotalAmount = totalAmount });
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpGet("{blogId}")]
        public async Task<IActionResult> GetBlogAsync(string blogId)
        {
            try
            {
                BlogModel model = await this.blogService.GetBlogAsync(blogId).ConfigureAwait(false);

                return this.Ok(model);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpPatch]
        public async Task<IActionResult> UpdateBlogAsync(BlogModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                BlogModel result = await this.blogService.UpdateBlogAsync(model).ConfigureAwait(false);

                return this.Ok();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpDelete("{blogId}")]
        public async Task<IActionResult> DeleteBlogAsync(string blogId)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                await this.blogService.DeleteBlogAsync(blogId).ConfigureAwait(false);

                return this.Ok();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }
    }
}