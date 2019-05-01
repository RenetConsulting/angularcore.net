// <copyright file="BlogController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
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

        public BlogController(IGlobalRepository repository, IOptions<AppSettings> appSettings)
        {
            this.repository = repository;

            this.appSettings = appSettings;
        }

        [HttpPost]
        public IActionResult CreateBlog(BlogModel model)
        {
            return this.Ok(model);
        }

        [HttpGet]
        public IActionResult GetBlogs(int index, int count)
        {
            //var result = new
            //{
            //    Items = this.items.GetRange(index, count),
            //    ItemsAmount = this.items.ToArray().Length
            //};
            return this.Ok();
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