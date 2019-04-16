// <copyright file="BlogController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System;
    using System.Collections.Generic;
    using Application.Business.Models;
    using Microsoft.AspNetCore.Mvc;

    /// <summary>
    /// TODO: create integaration with SignalR
    /// TODO: create logic
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly List<BlogModel> items = new List<BlogModel>()
        {
            new BlogModel() { BlogId = "1qq", Title = "Title 1", Content = "Brave new world 1", Editable = true, CreatedBy = "Bob" },
            new BlogModel() { BlogId = "2qq", Title = "Title 2", Content = "Brave new world 2", Editable = true, CreatedBy = "Bob" },
            new BlogModel() { BlogId = "3qq", Title = "Title 3", Content = "Brave new world 3", Editable = false, CreatedBy = "Mark" },
            new BlogModel() { BlogId = "4qq", Title = "Title 4", Content = "Brave new world 4", Editable = false, CreatedBy = "Mark" },
            new BlogModel() { BlogId = "5qq", Title = "Title 5", Content = "Brave new world 5", Editable = true, CreatedBy = "Bob" }
        };

        [HttpPost]
        public IActionResult CreateBlog(BlogModel model)
        {
            model.BlogId = "6qq";
            return this.Ok(model);
        }

        [HttpGet]
        public IActionResult GetBlogs()
        {
            return this.Ok(this.items);
        }

        [HttpGet("{blogId}")]
        public IActionResult GetBlog(string blogId)
        {
            BlogModel model = this.items.Find(x => x.BlogId == blogId);
            return this.Ok(model);
        }

        [HttpPatch]
        public IActionResult UpdateBlog(BlogModel model)
        {
            return this.Ok(true);
        }

        [HttpDelete("{blogId}")]
        public IActionResult DeleteBlog(string blogId)
        {
            this.items.Remove(this.items.Find(x => x.BlogId == blogId));
            return this.Ok(true);
        }
    }

    /// <summary>
    /// TODO: refactor to a separate file
    /// </summary>
    public class BlogModel : ApplicationModel
    {
        public string BlogId { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public bool Editable { get; set; }
    }
}