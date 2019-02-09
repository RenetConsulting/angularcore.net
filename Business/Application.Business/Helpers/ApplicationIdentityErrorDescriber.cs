namespace Application.Business.Helpers
{
    using Microsoft.AspNetCore.Identity;

    public class ApplicationIdentityErrorDescriber : IdentityErrorDescriber
    {
        public virtual IdentityError ConfirmPasswordMismatch()
        {
            return new IdentityError
            {
                Code = "ConfirmPasswordMismatch",
                Description = "The confirm password you entered does not match."
            };
        }
    }
}
