namespace Application.DataAccess.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Person
    {
        [Key]
        public int PersonId { get; set; }

        [StringLength(30)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        [StringLength(100)]
        public string Address { get; set; }

        [StringLength(30)]
        public string City { get; set; }

        [StringLength(10)]
        public string ZipCode { get; set; }

        [StringLength(30)]
        public string Country { get; set; }

        [StringLength(30)]
        public string Region { get; set; }

        [StringLength(30)]
        public string Phone { get; set; }

        [StringLength(255)]
        public string Email { get; set; }

        [ForeignKey("ApplicationUser")]
        [StringLength(450)]
        public string UserId { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
