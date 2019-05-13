// <copyright file="IAzureBlobManager.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Services
{
    using System.IO;
    using System.Threading.Tasks;
    using Application.Business.Helpers;
    using Microsoft.WindowsAzure.Storage.Blob;

    public interface IAzureBlobManager
    {
        CloudBlobContainer BlobContainer { get; }

        Task DeleteAsync(string fileName);

        Task<BlobMetaData> AddAsync(Stream file, string fileName);

        Task<BlobMetaData> UpdateAsync(MemoryStream stream, string blobName);

        Task<bool> FileExistsAsync(string blobName);
    }
}
