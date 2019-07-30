// <copyright file="BlogHubController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System;
    using System.Threading.Tasks;
    using Application.Business.Interfaces;
    using Application.Business.Models;
    using Application.DataAccess.Repositories;
    using Application.Services;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.SignalR;

    [Route("api/[controller]")]
    [ApiController]
    public class BlogHubController : ControllerBase
    {
        private readonly IGlobalRepository repository;

        private readonly IHubContext<BlogHubBase> hubContext;

        private readonly IBlogService blogService;

        public BlogHubController(IHubContext<BlogHubBase> hubContext, IGlobalRepository repository, IBlogService blogService)
        {
            this.repository = repository;

            this.blogService = blogService;

            this.hubContext = hubContext;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(BlogModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                BlogModel result = await this.blogService.AddBlogAsync(model).ConfigureAwait(false);

                await this.hubContext.Clients.All.SendAsync("create", result);

                return this.Ok(new { Message = "Request Completed" });
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody]BlogModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                BlogModel result = await this.blogService.UpdateBlogAsync(model).ConfigureAwait(false);

                await this.hubContext.Clients.All.SendAsync("update", result);

                return this.Ok(new { Message = "Request Completed" });
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(string blogId)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                await this.blogService.DeleteBlogAsync(blogId).ConfigureAwait(false);

                await this.hubContext.Clients.All.SendAsync("delete", blogId);

                return this.Ok(new { Message = "Request Completed" });
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        //public async Task NotifyUpdates()
        //{
        //    var hubContext = GlobalHost.ConnectionManager.GetHubContext<StatisticsHub>();
        //    if (hubContext != null)
        //    {
        //        var stats = await this.GenerateStatistics();
        //        hubContext.Clients.All.updateStatistics(stats);
        //    }
        //}
    }
}