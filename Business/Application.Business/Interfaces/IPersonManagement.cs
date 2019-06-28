namespace Application.Business.Interfaces
{
    using System.Threading.Tasks;
    using Application.Business.Models;

    public interface IPersonManagement
    {
        Task<PersonModel> GetUserProfileAsync(string userId);

        Task<PersonModel> UpdateUserProfileAsync(PersonModel person);
    }
}
