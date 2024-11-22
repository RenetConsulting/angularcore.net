namespace Renet.CoreCaptcha
{
    using SixLabors.ImageSharp;
    using SixLabors.ImageSharp.Processing;
    using SixLabors.ImageSharp.PixelFormats;
    using System;
    using System.IO;
    using System.Text;
    using SixLabors.Fonts;
    using SixLabors.Primitives;
    using System.Reflection;
    using SixLabors.ImageSharp.Advanced;
    using Microsoft.Extensions.Logging;

    public static class Captcha
    {
        const string Letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        public static string GenerateCaptchaCode(int length)
        {
            Random rand = new Random();
            int maxRand = Letters.Length - 1;

            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < length; i++)
            {
                int index = rand.Next(maxRand);
                sb.Append(Letters[index]);
            }

            return sb.ToString();
        }

        public static CaptchaResult GenerateCaptchaImage(int width, int height, string captchaCode, ILogger logger)
        {
            using (Image<Rgba32> image = new Image<Rgba32>(width, height))
            {
                
                DrawCaptchaCode(image, width, height, captchaCode);

                DrawDisorderLine(image, width, height);

                Image<Rgba32> imageCopy = AdjustRippleEffect(image, width, height);

                MemoryStream ms = new MemoryStream();

                imageCopy.SaveAsPng(ms);

                return new CaptchaResult { CaptchaCode = captchaCode, CaptchaByteData = ms.ToArray(), Timestamp = DateTime.Now };         
            }
        }

        private static Image<Rgba32>  AdjustRippleEffect(Image<Rgba32> image, int width, int height)
        {
            short nWave = 6;
            int nWidth = width;
            int nHeight = height;

            Point[,] pt = new Point[nWidth, nHeight];

            double newX, newY;
            double xo, yo;

            for (int x = 0; x < nWidth; ++x)
            {
                for (int y = 0; y < nHeight; ++y)
                {
                    xo = ((double)nWave * Math.Sin(2.0 * 3.1415 * (float)y / 128.0));
                    yo = ((double)nWave * Math.Cos(2.0 * 3.1415 * (float)x / 128.0));

                    newX = (x + xo);
                    newY = (y + yo);

                    if (newX > 0 && newX < nWidth)
                    {
                        pt[x, y].X = (int)newX;
                    }
                    else
                    {
                        pt[x, y].X = 0;
                    }


                    if (newY > 0 && newY < nHeight)
                    {
                        pt[x, y].Y = (int)newY;
                    }
                    else
                    {
                        pt[x, y].Y = 0;
                    }
                }
            }

            var source = image.Clone();

            var sourceSpan = source.GetPixelSpan();
            var targetSpan = image.GetPixelSpan();

            Point[] ptData = new Point[pt.Length];

            int k = 0;

            int xOffset, yOffset;

            for (int y = 0; y < nHeight; ++y)
            {
                for (int x = 0; x < nWidth; ++x)
                {
                    xOffset = pt[x, y].X;
                    yOffset = pt[x, y].Y;

                    if (yOffset >= 0 && yOffset < nHeight && xOffset >= 0 && xOffset < nWidth)
                    {
                        targetSpan[k] = (sourceSpan.Length > (yOffset * width) + (xOffset)) ? sourceSpan[(yOffset * width) + (xOffset)] : targetSpan[k];
                    }

                    k++;
                }
            }

            return Image.LoadPixelData<Rgba32>(targetSpan, width, height);
        }

        private static void DrawDisorderLine(Image<Rgba32> image, int width, int height)
        {
            Random rand = new Random();

            for (int i = 0; i < rand.Next(5, 8); i++)
            {
                IPen<Rgba32> linePen = new Pen<Rgba32>(new SolidBrush<Rgba32>(GetRandomDeepColor()), (float)(rand.NextDouble() * 2.7));

                Point startPoint = new Point(rand.Next(0, width), rand.Next(0, height));
                Point endPoint = new Point(rand.Next(0, width), rand.Next(0, height));
                image.Mutate(d => d
                .DrawLines(linePen, startPoint, endPoint));

                Point bezierPoint1 = new Point(rand.Next(0, width), rand.Next(0, height));
                Point bezierPoint2 = new Point(rand.Next(0, width), rand.Next(0, height));

                image.Mutate(d => d
                   .DrawBeziers(linePen, startPoint, bezierPoint1, bezierPoint2, endPoint));
            }
        }

        private static int GetFontSize(int imageWidth, int imageHeight, int captchCodeCount)
        {
            var averageSize = imageWidth / captchCodeCount;

            averageSize = Math.Min(averageSize, imageHeight - Convert.ToInt32(imageHeight * 0.15));

            return Convert.ToInt32(averageSize);
        }

        private static Rgba32 GetRandomDeepColor()
        {
            int redlow = 160, greenLow = 100, blueLow = 160;
            Random rand = new Random();

            byte r = Convert.ToByte(rand.Next(redlow));
            byte g = Convert.ToByte(rand.Next(greenLow));
            byte b = Convert.ToByte(rand.Next(blueLow));

            return new Rgba32(r, g, b);
        }

        private static Rgba32 GetRandomLightColor()
        {
            int low = 180, high = 255;
            Random rand = new Random();

            byte r = Convert.ToByte(rand.Next(high) % (high - low) + low);
            byte g = Convert.ToByte(rand.Next(high) % (high - low) + low);
            byte b = Convert.ToByte(rand.Next(high) % (high - low) + low);

            return new Rgba32(r, g, b);
        }

        private static void DrawCaptchaCode(Image<Rgba32> image, int width, int height, string captchaCode)
        {
            Random rand = new Random();

            image.Mutate(d => d.BackgroundColor<Rgba32>(GetRandomLightColor()));

            int fontSize = GetFontSize(width, height, captchaCode.Length);

            FontCollection fonts = new FontCollection();

            const string resourceName = "Renet.CoreCaptcha.Fonts.MICROSS.TTF";

            var assembly = Assembly.Load(new AssemblyName("Renet.CoreCaptcha"));

            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            {
                if (stream == null)
                    throw new ArgumentNullException("stream");
                fonts.Install(stream);
            }


            Font font = fonts.CreateFont("Microsoft Sans Serif", fontSize, FontStyle.Bold);
            for (int i = 0; i < captchaCode.Length; i++)
            {
                SolidBrush<Rgba32> fontBrush = new SolidBrush<Rgba32>(GetRandomDeepColor());

                int shiftPx = fontSize / 6;

                float x = i * fontSize + rand.Next(-shiftPx, shiftPx) + rand.Next(-shiftPx, shiftPx);
                int maxY = height - fontSize;
                if (maxY < 0) maxY = 0;
                float y = rand.Next(0, maxY);

                Rgba32 fontColor = GetRandomDeepColor();
                image.Mutate(d => d
                        .DrawText(captchaCode[i].ToString(), font, fontColor, new PointF(x, y))
                );
            }
        }

    }

    public class CaptchaResult
    {
        public string CaptchaCode { get; set; }

        public byte[] CaptchaByteData { get; set; }

        public string CaptchBase64Data
        {
            get
            {
                return Convert.ToBase64String(CaptchaByteData);
            }
        }

        public DateTime Timestamp { get; set; }
    }
}
