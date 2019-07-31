// <copyright file="BlobController.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Application.Business.Helpers;
    using Application.DataAccess.Repositories;
    using Application.Services;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    [ApiController]
    public class BlobController : ControllerBase
    {
        private readonly IGlobalRepository repository;

        private readonly IOptions<AppSettings> appSettings;

        private readonly IAzureBlobManager azureBlobManager;

        private readonly IFileManager fileManager;

        public BlobController(IGlobalRepository repository, IOptions<AppSettings> appSettings, IAzureBlobManager azureBlobManager, IFileManager fileManager)
        {
            this.repository = repository;
            this.appSettings = appSettings;
            this.fileManager = fileManager;
            this.azureBlobManager = azureBlobManager;
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile(IFormFileCollection files, string blogId)
        {
            // IFormFileCollection files = this.HttpContext.Request.Form.Files;
            // Check if the request contains multipart/form-data.
            if (!this.HttpContext.Request.HasFormContentType)
            {
                return this.BadRequest("Unsupported media type");
            }

            if (files.Count == 0)
            {
                files = this.HttpContext.Request.Form.Files;
            }

            try
            {
                List<FileModel> addedFiles = await this.fileManager.AddAsync(files, blogId).ConfigureAwait(false);

                IActionResult result = this.Ok(new { ItemsList = addedFiles });

                if (addedFiles != null)
                {
                    try
                    {
                        foreach (var file in addedFiles)
                        {
                            await this.repository.SaveBlogFileAsync(blogId, file.Name).ConfigureAwait(false);
                        }
                    }
                    catch (Exception ex)
                    {
                        result = this.BadRequest(ex.GetBaseException().Message);
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetFilesAsync(int index, int count)
        {
            List<FileModel> files = await this.fileManager.GetAsync().ConfigureAwait(false);

            var result = new
            {
                Items = files.Skip(index).Take(count),
                ItemsAmount = files.Count
            };

            return this.Ok(result);
        }

        [HttpDelete("{blobName}")]
        public async Task<IActionResult> DeleteFile([FromRoute] string blobName)
        {
            var existingFile = await this.repository.GetBlogFileAsync(blobName).ConfigureAwait(false);

            if (Equals(existingFile, null))
            {
                return this.BadRequest($"File with {blobName} name not found");
            }

            if (!await this.fileManager.FileExistsAsync(blobName, existingFile.BlogId).ConfigureAwait(false))
            {
                return this.NotFound();
            }

            var result = await this.fileManager.DeleteAsync(blobName, existingFile.BlogId).ConfigureAwait(false);

            if (result.Successful)
            {
                try
                {
                    bool isFileDeleted = await this.repository.DeleteBlogFileAsync(blobName).ConfigureAwait(false);

                    if (isFileDeleted)
                    {
                        return this.Ok(result.Message);
                    }

                    return this.BadRequest($"Error deleting {blobName} file");
                }
                catch (Exception ex)
                {
                    // return this.BadRequest(GetInternalErrorMessage(ex));
                    return this.BadRequest(ex.Message);
                }
            }
            else
            {
                return this.BadRequest(result.Message);
            }
        }
    }
}