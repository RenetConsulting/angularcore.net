// <copyright file="BrotliCompressionProvider.cs" company="RenetConsulting Inc.">
// Copyright (c) RenetConsulting Inc.. All rights reserved.
// </copyright>

namespace Application.Providers
{
    using System.IO;
    using System.IO.Compression;
    using Microsoft.AspNetCore.ResponseCompression;

    public class BrotliCompressionProvider : ICompressionProvider
    {
        public string EncodingName => "br";

        public bool SupportsFlush => true;

        public Stream CreateStream(Stream outputStream) => new BrotliStream(outputStream, CompressionMode.Compress);
    }
}
