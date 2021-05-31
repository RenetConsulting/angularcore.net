namespace Application.Business.Models
{
    using Application.DataAccess.Entities;

    public class PersonInformationModel : ApplicationModel, IEntityModel<PersonInformation>
    {
        private string PersonId { get; set; }

        private string FirstName { get; set; }

        private string LastName { get; set; }

        private string Email { get; set; }

        private string Phone { get; set; }

        private string Address { get; set; }

        private string City { get; set; }

        private string ZipCode { get; set; }

        private string Region { get; set; }

        private string Country { get; set; }

        public PersonInformation ToEntity()
        {
            var entity = new PersonInformation
            {
                PersonId = this.PersonId,
                FirstName = this.FirstName,
                LastName = this.LastName,
                Email = this.Email,
                Phone = this.Phone,
                Address = this.Address,
                City = this.City,
                ZipCode = this.ZipCode,
                Region = this.Region,
                Country = this.Country,
            };

            this.ToEntity(entity);

            return entity;
        }

        public void ToModel(PersonInformation entity)
        {
            if (!Equals(entity, null))
            {
                this.PersonId = entity.PersonId;
                this.FirstName = entity.FirstName;
                this.LastName = entity.LastName;
                this.Email = entity.Email;
                this.Phone = entity.Phone;
                this.Address = entity.Address;
                this.City = entity.City;
                this.ZipCode = entity.ZipCode;
                this.Region = entity.Region;
                this.Country = entity.Country;

                this.EntityToModel(entity);
            }
        }
    }
}
