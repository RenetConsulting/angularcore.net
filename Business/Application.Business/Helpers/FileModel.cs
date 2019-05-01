// <copyright file="FileModel.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Helpers
{
    using System;

    public class FileModel
    {
        public FileModel()
        {
        }

        public FileModel(string fileId, BlobMetaData blob)
        {
            this.Name = fileId;
            // this.FileType = fileType;
            this.Size = blob.Size;
            this.Created = blob.Created;
            this.Url = blob.Url;
        }

        public FileModel(string fileId, string url, string description)
        {
            this.Name = fileId;
            this.Url = url;
            this.Description = description;
            // this.FileType = fileType;
        }

        public string Name { get; set; }

        public string Url { get; set; }

        public string Description { get; set; }

        // public FileType FileType { get; set; }

        public long Size { get; set; }

        public DateTime Created { get; set; }

        // public int BindingsCount { get; set; }

        // public int ItemBindingsCount { get; set; }
    }
}
