// <copyright file="ApplicationEntity.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    /// <summary>
    /// This is an abstract entity base class. All application entities should inherit this class
    /// </summary>
    public abstract class ApplicationEntity
    {
        [Column(TypeName = "DateTime2")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)] // this will prevent the column to be updated
        public DateTime CreatedDate { get; internal set; }

        [Column(TypeName = "DateTime2")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? UpdatedDate { get; internal set; }

        [Required]
        public bool? IsActive { get; set; }

        [NotMapped]
        public virtual string Timestamp
        {
            get { return this.RowVersion == null ? null : Convert.ToBase64String(this.RowVersion); }
            set { this.RowVersion = string.IsNullOrEmpty(value) ? null : Convert.FromBase64String(value); }
        }

        [Timestamp]
        public virtual byte[] RowVersion { get; internal set; }

        [StringLength(450)]
        [Required]
        public string CreatedBy { get; internal set; }

        [StringLength(450)]
        public string UpdatedBy { get; internal set; }
    }
}
