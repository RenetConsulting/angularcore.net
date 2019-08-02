// <copyright file="IFileManager.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Services
{
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using Application.Business.Helpers;
    using Microsoft.AspNetCore.Http;

    public interface IFileManager
    {
        Task<List<FileModel>> GetAsync();

        Task<FileActionResult> DeleteAsync(string fileName, string userId);

        Task<List<FileModel>> AddAsync(IFormFileCollection files, string userId);

        Task<FileModel> AddAsync(MemoryStream file, string fileUrl, string userId);

        Task<bool> FileExistsAsync(string fileName, string userId);
    }
}
