// <copyright file="ErrorMarks.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Helpers
{
    using Application.DataAccess.Enums;
    using Microsoft.AspNetCore.Identity;

    public static class ErrorMarks
    {
        public static ErrorMark GetErrorMark(string errorCode)
        {
            ApplicationIdentityErrorDescriber errorType = new ApplicationIdentityErrorDescriber();

            switch (errorCode)
            {
                case nameof(errorType.InvalidEmail):
                case nameof(errorType.DuplicateEmail):
                    return ErrorMark.Email;

                case nameof(errorType.PasswordMismatch):
                    return ErrorMark.OldPassword;

                case nameof(errorType.UserAlreadyHasPassword):
                case nameof(errorType.PasswordTooShort):
                case nameof(errorType.PasswordRequiresUniqueChars):
                case nameof(errorType.PasswordRequiresNonAlphanumeric):
                case nameof(errorType.PasswordRequiresDigit):
                case nameof(errorType.PasswordRequiresLower):
                case nameof(errorType.PasswordRequiresUpper):
                    return ErrorMark.Password;

                case nameof(errorType.DefaultError):
                case nameof(errorType.ConfirmPasswordMismatch):
                    return ErrorMark.ConfirmPassword;
            }

            return ErrorMark.None;
        }
    }
}
