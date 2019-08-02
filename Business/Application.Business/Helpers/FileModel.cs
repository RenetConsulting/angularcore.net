// <copyright file="FileModel.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Helpers
{
    using Application.Business.Models;
    using System;

    public class FileModel 
    {
        public FileModel()
        {
        }

        public FileModel(string fileId, BlobMetaData blob)
        {
            this.FileId = fileId;
            this.CreatedDate = blob.Created;
            this.FileUrl = blob.Url;
        }

        public FileModel(string fileId, string url, string title)
        {
            this.FileId = fileId;
            this.Title = title;
            this.FileUrl = url;
        }

        public string FileId { get; set; }

        public string Title { get; set; }

        public string FileUrl { get; set; }

        public long Size { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
