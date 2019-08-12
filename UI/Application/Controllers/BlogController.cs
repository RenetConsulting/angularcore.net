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
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using Application.Services;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.SignalR;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : BaseController
    {
        private readonly IGlobalRepository repository;

        private readonly IOptions<AppSettings> appSettings;

        private readonly IBlogService blogService;

        private readonly IHubContext<BlogHubBase> hubContext;

        public BlogController(IHubContext<BlogHubBase> hubContext, IGlobalRepository repository, IOptions<AppSettings> appSettings, IBlogService blogService, ILogger<BlogController> logger)
            : base(appSettings, logger)
        {
            this.repository = repository;

            this.appSettings = appSettings;

            this.blogService = blogService;

            this.hubContext = hubContext;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateBlogAsync(BlogModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                BlogModel result = await this.blogService.AddBlogAsync(model, this.UserId).ConfigureAwait(false);

                await this.hubContext.Clients.All.SendAsync("create", result);

                return this.Ok(result);
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
                (List<BlogModel> items, int totalAmount) = await this.blogService.GetBlogsAsync(index, count, this.UserId).ConfigureAwait(false);

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

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> UpdateBlogAsync(BlogModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                BlogModel result = await this.blogService.UpdateBlogAsync(model, this.UserId).ConfigureAwait(false);

                await this.hubContext.Clients.All.SendAsync("update", result);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{blogId}")]
        public async Task<IActionResult> DeleteBlogAsync(string blogId)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                await this.blogService.DeleteBlogAsync(blogId, this.UserId).ConfigureAwait(false);

                await this.hubContext.Clients.All.SendAsync("delete");

                return this.Ok();
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }
    }
}
