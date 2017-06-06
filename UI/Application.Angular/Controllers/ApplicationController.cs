namespace Application.Angular.Controllers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.Models;
    using Application.DataAccess.Entities;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    public abstract class ApplicationController<TModel, TEntity> : Controller
         where TEntity : ApplicationEntity
         where TModel : IEntityModel<TEntity>, new()
    {
        public ApplicationController(IEntityManagement<TEntity> entityManagement)
        {
            this.EntityManagement = entityManagement;
        }

        protected IEntityManagement<TEntity> EntityManagement { get; private set; }

        // [HttpPost]
        protected async Task<IActionResult> AddAsync([FromBody] TModel modelToAdd)
        {
            var model = await this.EntityManagement.AddAsync(modelToAdd);

            return this.Ok(model);
        }

        // [HttpPut]
        protected async Task<IActionResult> UpdateAsync([FromBody] TModel modelToUpdate)
        {
            try
            {
                var model = await this.EntityManagement.UpdateAsync(modelToUpdate);

                return this.Ok(model);
            }
            catch (UpdateConcurrencyException<IEntityModel<TEntity>> ex)
            {
                var responseError = new ResponseError<IEntityModel<TEntity>>
                {
                    ErrorCode = ControllerErrorCode.UpdateConcurrencyException,
                    ErrorMessage = ControllerErrorCode.UpdateConcurrencyException.Description(),
                    Data = ex.Model,
                };

                return this.StatusCode(StatusCodes.Status409Conflict, responseError);
            }
        }

        // [HttpGet("{Id}")]
        protected async Task<IActionResult> GetModelById<T>([FromRoute] T id)
        {
            TModel model = new TModel();

            var result = await this.EntityManagement.FindByIdAsync(id);

            model.ToModel(result);

            return this.Ok(model);
        }
    }
}
