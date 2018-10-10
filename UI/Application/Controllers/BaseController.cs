// <copyright file="BaseController.cs" company="RenetConsulting Inc.">
// Copyright (c) RenetConsulting Inc.. All rights reserved.
// </copyright>

namespace Application.Controllers
{
    using Application;
    using Application.DataAccess.Repositories;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    [ApiController]
    public class BaseController : ControllerBase
    {
        public BaseController(IOptions<AppSettings> appSettings)
        {
            this.AppSettings = appSettings.Value;
        }

        public BaseController(IGlobalRepository repository, IOptions<AppSettings> appSettings)
        {
            this.Repository = repository;
            this.AppSettings = appSettings.Value;
        }

        protected IGlobalRepository Repository { get; }

        protected AppSettings AppSettings { get; private set; }
    }
}
