namespace Renet.CoreCaptcha
{
    using Microsoft.Extensions.Primitives;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public static class DictionaryExtensions
    {
        public static IEnumerable<KeyValuePair<string, StringValues>> ToStringValuesEnumerable(
            this IDictionary<string, string> dictionary)
        {
            ArgumentNullException.ThrowIfNull(dictionary);

            return dictionary.Select(kvp =>
                new KeyValuePair<string, StringValues>(kvp.Key, new StringValues(kvp.Value)));
        }
    }
}
