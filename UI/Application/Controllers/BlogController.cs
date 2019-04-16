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
        private List<BlogModel> items = new List<BlogModel>();

        public BlogController()
        {
            for (int i = 0; i < 350; i++)
            {
                bool editable = i % 2 == 0;
                var date = DateTime.Now;

                BlogModel model = new BlogModel()
                {
                    BlogId = i + "qq",
                    Title = "Title " + i,
                    Content = "Brave new world " + i,
                    Editable = editable,
                    CreatedBy = editable ? "Bob" : "Mark",
                    CreatedDate = date.AddDays(i)
                };
                this.items.Add(model);
            }
        }

        [HttpPost]
        public IActionResult CreateBlog(BlogModel model)
        {
            return this.Ok(model);
        }

        [HttpGet]
        public IActionResult GetBlogs(int index, int count)
        {
            var result = new
            {
                Items = this.items.GetRange(index, count),
                ItemsAmount = this.items.ToArray().Length
            };
            return this.Ok(result);
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
    public class BlogModel
    {
        public string BlogId { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public bool Editable { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
}