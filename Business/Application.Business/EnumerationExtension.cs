// <copyright file="EnumerationExtension.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business
{
    using System;
    using System.Linq;
    using System.Reflection;

    public static class EnumerationExtension
    {
        public static string Description(this Enum value)
        {
            // get attributes
            var field = value.GetType().GetField(value.ToString());
            var attributes = field.GetCustomAttributes(false);

            // Description is in a hidden Attribute class called DisplayAttribute
            // Not to be confused with DisplayNameAttribute
            dynamic displayAttribute = null;

            if (attributes.Any())
            {
                displayAttribute = attributes.First();
            }

            // return description
            return displayAttribute?.Description ?? "Description not found.";
        }
    }
}
