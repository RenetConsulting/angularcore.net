using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace CoreCaptcha
{
    public class Cryptor
    {
        private static readonly int saltLength = 10;
        public static string ComputeHash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
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

        public static bool ValidateHash(string hash, string value, string ClientId)
        {
            string salt = hash.Substring(0, 10);
            string hashValue = hash.Substring(10);

            if(hashValue == ComputeHash(salt + ClientId + value.ToUpperInvariant()))
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
