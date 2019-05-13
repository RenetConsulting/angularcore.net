// <copyright file="AzureBlobManager.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Services
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Application.Business.Helpers;
    using Microsoft.Extensions.Options;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;

    public class AzureBlobManager : IAzureBlobManager
    {
        public AzureBlobManager(IOptions<AppSettings> appSettings)
        {
            this.StorageAccount = CloudStorageAccount.Parse(appSettings.Value.BlobStorage);
            this.ContainerName = appSettings.Value.ContainerName;
            CloudBlobClient blobClient = this.StorageAccount.CreateCloudBlobClient();
            this.BlobContainer = blobClient.GetContainerReference(this.ContainerName);
        }

        public CloudBlobContainer BlobContainer { get; }

        private CloudStorageAccount StorageAccount { get; }

        private string ContainerName { get; }

        public async Task<BlobMetaData> AddAsync(Stream file, string fileName)
        {
            try
            {
                await this.BlobContainer.CreateIfNotExistsAsync().ConfigureAwait(false);

                CloudBlockBlob blob = this.BlobContainer.GetBlockBlobReference(fileName);

                blob.Metadata["Created"] = DateTime.Now.ToString();

                await blob.UploadFromStreamAsync(file).ConfigureAwait(false);

                await blob.FetchAttributesAsync().ConfigureAwait(false);

                return this.CreateBlobMetaData(blob);
            }
            catch
            {
                throw;
            }
        }

        public async Task DeleteAsync(string fileName)
        {
            try
            {
                await this.BlobContainer.CreateIfNotExistsAsync().ConfigureAwait(false);

                ICloudBlob blob = await this.BlobContainer.GetBlobReferenceFromServerAsync(fileName).ConfigureAwait(false);

                await blob.DeleteAsync().ConfigureAwait(false);
            }
            catch
            {
                throw;
            }
        }

        public async Task<BlobMetaData> UpdateAsync(MemoryStream stream, string blobName)
        {
            try
            {
                await this.BlobContainer.CreateIfNotExistsAsync().ConfigureAwait(false);

                CloudBlockBlob blob = this.BlobContainer.GetBlockBlobReference(blobName);

                await blob.UploadFromStreamAsync(stream).ConfigureAwait(false);

                return this.CreateBlobMetaData(blob);
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> FileExistsAsync(string blobName)
        {
            try
            {
                await this.BlobContainer.CreateIfNotExistsAsync().ConfigureAwait(false);

                ICloudBlob blob = await this.BlobContainer.GetBlobReferenceFromServerAsync(blobName).ConfigureAwait(false);

                return await blob.ExistsAsync().ConfigureAwait(false);
            }
            catch
            {
                throw;
            }
        }

        private BlobMetaData CreateBlobMetaData(CloudBlockBlob blob)
        {
            return new BlobMetaData
            {
                Name = blob.Name,
                Size = blob.Properties.Length / 1024,
                Created = !blob.Metadata.ContainsKey("Created") || blob.Metadata["Created"] == null ? DateTime.Now : DateTime.Parse(blob.Metadata["Created"]),
                Url = blob.Uri.AbsoluteUri
            };
        }
    }
}
