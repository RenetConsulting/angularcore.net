// <copyright file="Startup.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// </copyright>

namespace Application
{
    using System;
    using System.Diagnostics;
    using System.IO.Compression;
    using System.Linq;
    using System.Security.Principal;
    using System.Text.Json;
    using System.Text.Json.Serialization;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using Application.Business;
    using Application.Business.Communications;
    using Application.Business.CoreCaptcha;
    using Application.Business.Interfaces;
    using Application.Business.Services;
    using Application.DataAccess;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;
    using Application.Services;
    using AspNet.Security.OAuth.Validation;
    using AspNet.Security.OpenIdConnect.Primitives;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.ResponseCompression;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Net.Http.Headers;
    using OpenIddict.Abstractions;
    using SendGrid;

    public class DateTimeConverterUsingDateTimeParse : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            Debug.Assert(typeToConvert == typeof(DateTime));
            return DateTime.Parse(reader.GetString());
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString());
        }
    }
}
