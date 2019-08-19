// <copyright file="FileStoragesPagingModel.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Models
{
    using System.Collections.Generic;
    using Application.DataAccess.Entities;

    public class FileStoragesPagingModel
    {
        public List<FileStorage> FileStorages { get; set; }

        public int TotalCount { get; set; }
    }
}
