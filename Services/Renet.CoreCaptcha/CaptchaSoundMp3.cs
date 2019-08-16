// <copyright file="CaptchaSoundMp3.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Renet.CoreCaptcha
{
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;

    public class CaptchaSoundMp3
    {
        public async Task<byte[]> GenerateCaptchaSound(string data, string functionAppDirectory)
        {
            using (MemoryStream s = new MemoryStream())
            {
                foreach (char element in data.AsEnumerable())
                {
                    string fileName = (element + ".mp3").ToLower();

                    string mp3Location = Path.Combine(functionAppDirectory, @"MP3");

                    string fullPath = Path.Combine(mp3Location, fileName);

                    await File.OpenRead(fullPath).CopyToAsync(s);
                }

                return s.ToArray();
            }
        }
    }
}
