// <copyright file="FileStorage.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class FileStorage : ApplicationEntity
    {
        [Key]
        [StringLength(125)]
        public string FileId { get; set; }

        [StringLength(255)]
        public string Url { get; set; }

        [StringLength(75)]
        public string Title { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [ForeignKey("ApplicationUser")]
        [StringLength(450)]
        public string UserId { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
