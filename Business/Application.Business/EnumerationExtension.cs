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
