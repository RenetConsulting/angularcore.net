namespace Application.Business.Helpers
{
    using System;

    public class BlobMetaData
    {
        public string Name { get; set; }

        public long Size { get; set; }

        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public string Url { get; set; }
    }
}
