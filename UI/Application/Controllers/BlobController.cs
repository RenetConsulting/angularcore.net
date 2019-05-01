// <copyright file="BlobController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    [ApiController]
    public class BlobController : ControllerBase
    {
        private readonly IGlobalRepository repository;

        private readonly IOptions<AppSettings> appSettings;

        public BlobController(IGlobalRepository repository, IOptions<AppSettings> appSettings)
        {
            this.repository = repository;

            this.appSettings = appSettings;
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        public IActionResult UploadFile()
        {
            // IFormFileCollection files = this.HttpContext.Request.Form.Files;
            return this.Ok();
        }

        [HttpGet]
        public IActionResult GetFiles(int index, int count)
        {
            //var result = new
            //{
            //    Items = this.items.GetRange(index, count),
            //    ItemsAmount = this.items.ToArray().Length
            //};
            return this.Ok();
        }

        [HttpDelete("{blogId}")]
        public IActionResult DeleteFile(string blogId)
        {
            // this.items.Remove(this.items.Find(x => x.FileId == blogId));
            return this.Ok(true);
        }
    }
}