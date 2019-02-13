using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Speech.AudioFormat;
using System.Speech.Synthesis;
using System.Text;
using System.Threading.Tasks;

namespace CoreCaptcha
{
    public class CaptchaSound
    {
        public byte[] GenerateCaptchaSound(string data)
        {
            using (SpeechSynthesizer synthesizer = new SpeechSynthesizer())
            {
                synthesizer.Volume = 100;  // 0...100
                synthesizer.Rate = -1;     // -10...10

                using (MemoryStream s = new MemoryStream())
                {

                    synthesizer.SetOutputToWaveStream(s);
                    //SpeechAudioFormatInfo synthFormat = new SpeechAudioFormatInfo(EncodingFormat.Pcm, 88200, 16, 1, 16000, 2, null);
                    //synthesizer.SetOutputToAudioStream(s, synthFormat);

                    // Synchronous
                    synthesizer.Speak(data);

                    // Set the synthesizer output to null to release the stream.   
                    synthesizer.SetOutputToNull();

                    return s.ToArray();
                }
            }
        }
    }
}
