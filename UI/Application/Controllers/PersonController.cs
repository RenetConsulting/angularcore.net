namespace Application.Controllers
{
    using System;
    using System.Threading.Tasks;
    using Application.Business.Interfaces;
    using Application.Business.Models;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    [Route("api/[controller]")]
    public class PersonController : BaseController
    {
        private readonly IGlobalRepository repository;
        private readonly IPersonManagement personManagement;

        public PersonController(
            IGlobalRepository repository,
            IOptions<AppSettings> appSettings,
            IPersonManagement personManagement,
            ILogger<AccountController> logger)
            : base(appSettings, logger)
        {
            this.repository = repository;
            this.personManagement = personManagement;
        }

        [Authorize]
        [HttpGet("Profile")]
        public async Task<IActionResult> ProfileAsync()
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                PersonModel model = await this.personManagement.GetUserProfileAsync(this.UserId);

                return this.Ok(model);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateProfileAsync(PersonModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                PersonModel result = await this.personManagement.UpdateUserProfileAsync(model);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }
    }
}
