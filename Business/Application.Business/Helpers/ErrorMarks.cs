namespace Application.Business.Helpers
{
    using Application.DataAccess.Enums;
    using Microsoft.AspNetCore.Identity;

    public static class ErrorMarks
    {
        public static ErrorMark GetErrorMark(string errorCode)
        {
            IdentityErrorDescriber errorType = new IdentityErrorDescriber();

            switch (errorCode)
            {
                case nameof(errorType.InvalidEmail):
                case nameof(errorType.DuplicateEmail):
                    return ErrorMark.Email;

                case nameof(errorType.PasswordMismatch):
                case nameof(errorType.UserAlreadyHasPassword):
                case nameof(errorType.PasswordTooShort):
                case nameof(errorType.PasswordRequiresUniqueChars):
                case nameof(errorType.PasswordRequiresNonAlphanumeric):
                case nameof(errorType.PasswordRequiresDigit):
                case nameof(errorType.PasswordRequiresLower):
                case nameof(errorType.PasswordRequiresUpper):
                    return ErrorMark.Password;

                case nameof(errorType.DefaultError):
                    return ErrorMark.ConfirmPassword;
            }

            return ErrorMark.None;
        }
    }
}
