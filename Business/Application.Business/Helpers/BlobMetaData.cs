// <copyright file="BlobMetaData.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Helpers
{
    using System;

    public class BlobMetaData
    {
        public string Name { get; set; }

        public long Size { get; set; }

        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public string Url { get; set; }
    }
}
