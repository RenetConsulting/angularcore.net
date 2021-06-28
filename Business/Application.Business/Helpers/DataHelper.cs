// <copyright file="DataHelper.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Helpers
{
    using System;
    using System.Text;

    public static class DataHelper
    {
        public static string GenerateRandomPassword(int length = 16)
        {
            var pass = new StringBuilder();

            var random = new Random();

            while (pass.Length < length)
            {
                var c = (char)random.Next(33, 125);

                if (char.IsLetterOrDigit(c))
                {
                    pass.Append(c);
                }
            }

            return pass.ToString();
        }
    }
}
