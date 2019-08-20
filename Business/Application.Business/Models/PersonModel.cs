namespace Application.Business.Models
{
    using System.ComponentModel.DataAnnotations;
    using Application.DataAccess.Entities;

    public class PersonModel : IEntityModel<Person>
    {
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

        public Person ToEntity()
        {
            return new Person
            {
                Address = this.Address,
                City = this.City,
                Country = this.Country,
                Email = this.Email,
                FirstName = this.FirstName,
                LastName = this.LastName,
                Phone = this.Phone,
                Region = this.Region,
                ZipCode = this.ZipCode
            };
        }

        public void ToModel(Person entity)
        {
            this.Address = entity.Address;
            this.City = entity.City;
            this.Country = entity.Country;
            this.Email = entity.Email;
            this.FirstName = entity.FirstName;
            this.LastName = entity.LastName;
            this.Phone = entity.Phone;
            this.Region = entity.Region;
            this.ZipCode = entity.ZipCode;
        }
    }
}
