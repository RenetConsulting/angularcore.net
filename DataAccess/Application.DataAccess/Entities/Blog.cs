// <copyright file="Blog.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Entities
{
    using System.ComponentModel.DataAnnotations;

    public class Blog
    {
        [Key]
        public string BlogId { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public bool Editable { get; set; }
    }
}
