namespace CoreCaptcha
{
    using System;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;

    public class Cryptor
    {
        private static readonly int saltLength = 10;
        public static string ComputeHash(string input)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                return GetHash(sha256Hash, input);
            }
        }

        private static string GetHash(HashAlgorithm hashAlgorithm, string input)
        {
            // Convert the input string to a byte array and compute the hash.
            byte[] data = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes and create a string.   
            StringBuilder builder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int index = 0; index < data.Length; index++)
            {
                builder.Append(data[index].ToString("x2"));
            }

            // Return the hexadecimal string.
            return builder.ToString();
        }

        private static Random random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static string ComputeHashWithSalt(string rawData, string ClientId)
        {
            string salt = RandomString(saltLength);

            return salt + ComputeHash(salt + ClientId + rawData);
        }

        public static bool ValidateHash(string hash, string value, string clientId)
        {
            if(string.IsNullOrEmpty(hash) || string.IsNullOrEmpty(value) || hash.Length <= saltLength + 1 || string.IsNullOrEmpty(clientId))
            {
                return false;
            }

            string salt = hash.Substring(0, saltLength);
            string hashValue = hash.Substring(saltLength);

            if(hashValue.Equals(ComputeHash(salt + clientId + value.ToUpperInvariant()), StringComparison.InvariantCultureIgnoreCase))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
