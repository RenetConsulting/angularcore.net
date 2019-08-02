// <copyright file="AzureFileManager.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Services
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Application.Business.Helpers;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Options;
    using Microsoft.WindowsAzure.Storage.Blob;

    // TODO: Review which need filetype of files(FileModel).
    public class AzureFileManager : IFileManager
    {
        public AzureFileManager(IOptions<AppSettings> appSettings, IAzureBlobManager azureBlobManager)
        {
            this.AppSettings = appSettings.Value;
            this.BlobManager = azureBlobManager;
        }

        private AppSettings AppSettings { get; }

        private IAzureBlobManager BlobManager { get; }

        public async Task<List<FileModel>> GetAsync()
        {
            try
            {
                // note the browser will get the actual images directly from the container we are not passing actual files back just references
                if (!await this.BlobManager.BlobContainer.ExistsAsync().ConfigureAwait(false))
                {
                    await this.BlobManager.BlobContainer.CreateAsync(BlobContainerPublicAccessType.Blob, null, null).ConfigureAwait(false);
                }

                var files = new List<FileModel>();

                BlobContinuationToken token = null;
                do
                {
                    BlobResultSegment resultSegment = await this.BlobManager.BlobContainer.ListBlobsSegmentedAsync(token).ConfigureAwait(false);
                    token = resultSegment.ContinuationToken;

                    foreach (IListBlobItem item in resultSegment.Results.Where(bi => bi.GetType() == typeof(CloudBlockBlob)))
                    {
                        CloudBlockBlob blobItem = (CloudBlockBlob)item;

                        await blobItem.FetchAttributesAsync().ConfigureAwait(false);

                        files.Add(new FileModel
                        {
                            Name = blobItem.Name,
                            Size = blobItem.Properties.Length / 1024,
                            Created = blobItem.Metadata["Created"] == null ? DateTime.Now : DateTime.Parse(blobItem.Metadata["Created"]),
                            Url = blobItem.Uri.AbsoluteUri
                        });
                    }
                }
                while (token != null);

                return files;
            }
            catch
            {
                throw;
            }
        }

        public async Task<FileActionResult> DeleteAsync(string fileName, string userId)
        {
            string path = this.BuildPath(userId, fileName);

            try
            {
                await this.BlobManager.DeleteAsync(path).ConfigureAwait(false);

                return new FileActionResult { Successful = true, Message = $"{fileName} deleted successfully" };
            }
            catch (Exception ex)
            {
                return new FileActionResult { Successful = false, Message = $"Error deleting {fileName} file: {ex.GetBaseException().Message}" };
            }
        }

        public async Task<List<FileModel>> AddAsync(IFormFileCollection files, string userId)
        {
            try
            {
                List<FileModel> addedFiles = new List<FileModel>();

                foreach (IFormFile file in files)
                {
                    string fileId = string.Format("{0}{1}", Guid.NewGuid().ToString(), Path.GetExtension(file.Name));

                    string fileName = this.BuildPath(userId, fileId);

                    BlobMetaData blob;

                    using (var fileStream = file.OpenReadStream())
                    {
                        blob = await this.BlobManager.AddAsync(fileStream, fileName).ConfigureAwait(false);
                    }

                    if (blob != null)
                    {
                        addedFiles.Add(new FileModel(fileId, blob));
                    }
                }

                return addedFiles;
            }
            catch
            {
                throw;
            }
        }

        public async Task<FileModel> AddAsync(MemoryStream file, string fileUrl, string userId)
        {
            try
            {
                string fileId = string.Format("{0}{1}", Guid.NewGuid().ToString(), Path.GetExtension(fileUrl));

                string fileName = this.BuildPath(userId, fileId);

                BlobMetaData blob = await this.BlobManager.AddAsync(file, fileName).ConfigureAwait(false);

                if (blob != null)
                {
                    return new FileModel(fileId, blob);
                }

                return null;
            }
            catch
            {
                throw;
            }
        }

        public Task<bool> FileExistsAsync(string fileName, string userId)
        {
            string path = this.BuildPath(userId, fileName);

            return this.BlobManager.FileExistsAsync(path);
        }

        #region Private methods

        private string BuildPath(string userId, string fileId)
        {
            return string.Format("{0}/{1}", userId, fileId);
        }

        #endregion
    }
}
