// <copyright file="TermsOfService.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class TermsOfService
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int TermsOfServiceId { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        [StringLength(30)]
        public string Version { get; set; }

        [Required]
        [Column(TypeName = "DateTime2")]
        public DateTime ReleaseDate { get; set; }

        [Required]
        [Column(TypeName = "DateTime2")]
        public DateTime PublishedDate { get; set; }

        [Required]
        public bool? IsActive { get; set; }
    }
}
