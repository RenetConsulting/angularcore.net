namespace Application.Angular.Controllers
{
    using System.ComponentModel;

    public enum ControllerErrorCode
    {
        None = 0,

        [Description("The record has been modified by another user.")]
        UpdateConcurrencyException = 1000
    }
}
