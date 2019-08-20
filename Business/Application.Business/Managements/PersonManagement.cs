namespace Application.Business.Managements
{
    using System;
    using System.Threading.Tasks;
    using Application.Business.Interfaces;
    using Application.Business.Models;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;

    public class PersonManagement : IPersonManagement
    {
        public PersonManagement(IGlobalRepository repo)
        {
            this.Repository = repo;
        }

        protected IGlobalRepository Repository { get; set; }

        public async Task<PersonModel> GetUserProfileAsync(string userId)
        {
            try
            {
                userId = userId ?? throw new ArgumentNullException(nameof(userId));

                Person entity = await this.Repository.GetUserProfileAsync(userId);

                PersonModel model = new PersonModel();
                model.ToModel(entity);

                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<PersonModel> UpdateUserProfileAsync(PersonModel person)
        {
            try
            {
                person = person ?? throw new ArgumentNullException(nameof(person));

                Person entity = await this.Repository.UpdateUserProfileAsync(person.ToEntity());

                PersonModel model = new PersonModel();
                model.ToModel(entity);

                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
