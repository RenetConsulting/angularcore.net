// <copyright file="Blog.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Entities
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Blog : ApplicationEntity
    {
        [Key]
        [StringLength(50)]
        public string BlogId { get; set; }

        [StringLength(255)]
        public string Title { get; set; }

        [StringLength(2550)]
        public string Content { get; set; }

        [ForeignKey("ApplicationUser")]
        [StringLength(450)]
        public string UserId { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }

        public ICollection<FileStorage> FileStorages { get; set; }
    }
}
