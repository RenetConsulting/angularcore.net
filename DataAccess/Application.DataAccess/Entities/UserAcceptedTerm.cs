﻿namespace Application.DataAccess.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class UserAcceptedTerm
    {
        [Required]
        [Column(Order = 0)]
        public string UserId { get; set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(Order = 1)]
        public int TermsOfServiceId { get; set; }

        [Required]
        [Column(TypeName = "DateTime2")]
        public DateTime AcceptedDate { get; set; }

        [Required]
        public bool? IsActive { get; set; }
    }
}
