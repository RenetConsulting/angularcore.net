namespace Application.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Application.DataAccess.Repositories;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;
    using System;
    using Application.Business.Interfaces;
    using Application.Business.Models;

    [Authorize]
    public class UserDataController : BaseController
    {
        private readonly IGlobalRepository repository;

        private readonly IUserManagement userManagement;

        private readonly IOptions<AppSettings> appSettings;

        public UserDataController(IGlobalRepository repository, IOptions<AppSettings> appSettings, ILogger<BlogController> logger, IUserManagement userManagement)
            : base(appSettings, logger)
        {
            this.repository = repository;

            this.appSettings = appSettings;

            this.userManagement = userManagement;
        }

        [HttpGet("{personId}")]
        public async Task<IActionResult> GetPersonInformationAsync(string personId)
        {
            try
            {
                var userData = await this.userManagement.GetPersonInformationAsync(personId, this.UserId).ConfigureAwait(false);

                return this.Ok(userData);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePersonInformationAsync(PersonInformationModel personInformationModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                var result = await this.userManagement.AddPersonInformationAsync(personInformationModel, this.UserId).ConfigureAwait(false);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpPatch]
        public async Task<IActionResult> UpdatePersonInformationAsync(PersonInformationModel personInformationModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                var result = await this.userManagement.UpdatePersonInformationAsync(personInformationModel, this.UserId).ConfigureAwait(false);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }
    }
}
