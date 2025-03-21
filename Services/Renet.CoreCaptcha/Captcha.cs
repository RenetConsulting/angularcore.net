namespace Renet.CoreCaptcha
{
    using SixLabors.ImageSharp;
    using SixLabors.ImageSharp.Processing;
    using SixLabors.ImageSharp.PixelFormats;
    using System;
    using System.IO;
    using System.Text;
    using SixLabors.Fonts;
    using System.Reflection;
    using Microsoft.Extensions.Logging;
    using SixLabors.ImageSharp.Drawing.Processing;

    public static class Captcha
    {
        const string Letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        public static string GenerateCaptchaCode(int length)
        {
            Random rand = new();
            int maxRand = Letters.Length - 1;

            StringBuilder sb = new();

            for (int i = 0; i < length; i++)
            {
                int index = rand.Next(maxRand);
                sb.Append(Letters[index]);
            }

            return sb.ToString();
        }

        public static CaptchaResult GenerateCaptchaImage(int width, int height, string captchaCode, ILogger logger)
        {
            using Image<Rgba32> image = new(width, height);

            DrawCaptchaCode(image, width, height, captchaCode);

            DrawDisorderLine(image, width, height);

            Image<Rgba32> imageCopy = AdjustRippleEffect(image, width, height);

            MemoryStream ms = new();

            imageCopy.SaveAsPng(ms);

            return new CaptchaResult { CaptchaCode = captchaCode, CaptchaByteData = ms.ToArray(), Timestamp = DateTime.Now };
        }

        private static Image<Rgba32> AdjustRippleEffect(Image<Rgba32> image, int width, int height)
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
                    xo = nWave * Math.Sin(2.0 * Math.PI * y / 128.0);
                    yo = nWave * Math.Cos(2.0 * Math.PI * x / 128.0);

                    newX = x + xo;
                    newY = y + yo;

                    pt[x, y] = new Point(
                        (newX > 0 && newX < nWidth) ? (int)newX : 0,
                        (newY > 0 && newY < nHeight) ? (int)newY : 0
                    );
                }
            }

            var source = image.Clone();

            for (int y = 0; y < nHeight; ++y)
            {
                for (int x = 0; x < nWidth; ++x)
                {
                    int xOffset = pt[x, y].X;
                    int yOffset = pt[x, y].Y;

                    if (yOffset >= 0 && yOffset < nHeight && xOffset >= 0 && xOffset < nWidth)
                    {
                        image[x, y] = source[xOffset, yOffset];
                    }
                }
            }

            return image;
        }

        private static void DrawDisorderLine(Image<Rgba32> image, int width, int height)
        {
            Random rand = new Random();

            for (int i = 0; i < rand.Next(5, 8); i++)
            {
                var linePen = Pens.Solid(GetRandomDeepColor(), (float)(rand.NextDouble() * 2.7));

                Point startPoint = new Point(rand.Next(0, width), rand.Next(0, height));
                Point endPoint = new Point(rand.Next(0, width), rand.Next(0, height));
                image.Mutate(d => d
                .DrawLine(linePen, startPoint, endPoint));

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
            Random rand = new();

            byte r = Convert.ToByte(rand.Next(redlow));
            byte g = Convert.ToByte(rand.Next(greenLow));
            byte b = Convert.ToByte(rand.Next(blueLow));

            return new Rgba32(r, g, b);
        }

        private static Rgba32 GetRandomLightColor()
        {
            int low = 180, high = 255;
            Random rand = new();

            byte r = Convert.ToByte(rand.Next(high) % (high - low) + low);
            byte g = Convert.ToByte(rand.Next(high) % (high - low) + low);
            byte b = Convert.ToByte(rand.Next(high) % (high - low) + low);

            return new Rgba32(r, g, b);
        }

        private static void DrawCaptchaCode(Image<Rgba32> image, int width, int height, string captchaCode)
        {
            Random rand = new();

            image.Mutate(d => d.Fill(GetRandomLightColor()));

            int fontSize = GetFontSize(width, height, captchaCode.Length);

            FontCollection fonts = new();

            const string resourceName = "Renet.CoreCaptcha.Fonts.MICROSS.TTF";

            var assembly = Assembly.Load(new AssemblyName("Renet.CoreCaptcha"));

            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            {
                if (stream == null)
                    throw new ArgumentNullException("stream");
                fonts.Add(stream);
            }

            FontFamily fontFamily = fonts.Get("Microsoft Sans Serif");
            Font font = fontFamily.CreateFont(fontSize, FontStyle.Bold);
            for (int i = 0; i < captchaCode.Length; i++)
            {
                SolidBrush fontBrush = new SolidBrush(GetRandomDeepColor());

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
