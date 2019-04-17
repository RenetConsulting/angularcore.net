// <copyright file="BlobController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System;
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class BlobController : ControllerBase
    {
        private List<FileModel> items = new List<FileModel>();

        public BlobController()
        {
            for (int i = 0; i < 80; i++)
            {
                bool editable = i % 2 == 0;
                var date = DateTime.Now;

                FileModel model = new FileModel()
                {
                    FileId = i + "qq",
                    Title = "Title " + i,
                    FileUrl = "https://angular.io/assets/images/logos/angular/angular.svg",
                    CreatedDate = date.AddDays(i)
                };
                this.items.Add(model);
            }
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        public IActionResult UploadFile()
        {
            IFormFileCollection files = this.HttpContext.Request.Form.Files;
            return this.Ok(this.items[0]);
        }

        [HttpGet]
        public IActionResult GetFiles(int index, int count)
        {
            var result = new
            {
                Items = this.items.GetRange(index, count),
                ItemsAmount = this.items.ToArray().Length
            };
            return this.Ok(result);
        }

        [HttpDelete("{blogId}")]
        public IActionResult DeleteFile(string blogId)
        {
            this.items.Remove(this.items.Find(x => x.FileId == blogId));
            return this.Ok(true);
        }
    }

    /// <summary>
    /// TODO: refactor to a separate file
    /// </summary>
    public class FileModel
    {
        public string FileId { get; set; }

        public string Title { get; set; }

        public string FileUrl { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
}