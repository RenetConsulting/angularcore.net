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
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class BlobController : BaseController
    {
        private readonly IGlobalRepository repository;

        private readonly IOptions<AppSettings> appSettings;

        private readonly IAzureBlobManager azureBlobManager;

        private readonly IFileManager fileManager;

        public BlobController(IGlobalRepository repository, IOptions<AppSettings> appSettings, IAzureBlobManager azureBlobManager, IFileManager fileManager, ILogger<BlogController> logger)
            : base(appSettings, logger)
        {
            this.repository = repository;
            this.appSettings = appSettings;
            this.fileManager = fileManager;
            this.azureBlobManager = azureBlobManager;
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile(IFormFileCollection files)
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
                List<FileModel> addedFiles = await this.fileManager.AddAsync(files, this.UserId).ConfigureAwait(false);

                IActionResult result = this.Ok(new { Items = addedFiles });

                if (addedFiles != null)
                {
                    try
                    {
                        foreach (var file in addedFiles)
                        {
                            await this.repository.SaveBlogFileAsync(this.UserId, file.FileId).ConfigureAwait(false);
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
            try
            {
                // check existing images
                await this.CheckExistingImagesAsync().ConfigureAwait(false);

                var result = await this.repository.GetFileStoragesAsync(this.UserId, index, count).ConfigureAwait(false);

                if (result != null)
                {
                    List<FileModel> images = result.FileStorages
                        .Select(i => new FileModel(
                            i.FileId,
                            this.GetFileStorageUrl(this.UserId, i.FileId),
                            i.Title))
                        .ToList();

                    return this.Ok(new { Items = images, ItemsAmount = result.TotalCount });
                }

                return this.BadRequest("Error retrieving user images");
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        public string GetFileStorageUrl(string userId, string fileId)
        {
            return string.Format("{0}{1}/{2}/{3}", this.AppSettings.BlobStorageUrl, this.AppSettings.ContainerName, userId, fileId);
        }

        // one time check function
        public async Task CheckExistingImagesAsync()
        {
            var files = await this.repository.GetAllFilesAsync().ConfigureAwait(false);

            foreach (var file in files)
            {
                try
                {
                    // check if file exists in Images folder
                    bool isFileExists = await this.fileManager
                        .FileExistsAsync(file.FileId, file.UserId)
                        .ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("The specified blob does not exist."))
                    {
                        try
                        {
                            // check if file exists in Image folder
                            bool isFileExists = await this.fileManager
                                .FileExistsAsync(file.FileId, file.UserId)
                                .ConfigureAwait(false);

                            if (isFileExists)
                            {
                                // if image exists in Image folder - move to Images folder
                                await this.fileManager.CopyBlobAsync(file.FileId, file.UserId).ConfigureAwait(false);
                            }
                        }
                        catch (Exception ex2)
                        {
                            if (ex2.Message.Contains("The specified blob does not exist."))
                            {
                                // if image does not exists in any folder - delete it
                                bool isFileDeleted = await this.repository.DeleteBlogFileAsync(file.FileId, file.UserId).ConfigureAwait(false);
                            }
                        }
                    }
                }
            }
        }

        [HttpDelete("{blobName}")]
        public async Task<IActionResult> DeleteFile([FromRoute] string blobName)
        {
            var existingFile = await this.repository.GetBlogFileAsync(blobName).ConfigureAwait(false);

            if (Equals(existingFile, null))
            {
                return this.BadRequest($"File with {blobName} name not found");
            }

            if (!await this.fileManager.FileExistsAsync(blobName, existingFile.UserId).ConfigureAwait(false))
            {
                return this.NotFound();
            }

            var result = await this.fileManager.DeleteAsync(blobName, existingFile.UserId).ConfigureAwait(false);

            if (result.Successful)
            {
                try
                {
                    bool isFileDeleted = await this.repository.DeleteBlogFileAsync(blobName, this.UserId).ConfigureAwait(false);

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
