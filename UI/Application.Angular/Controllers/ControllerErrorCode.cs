// <copyright file="ControllerErrorCode.cs" company="RenetConsulting Inc.">
// Copyright (c) RenetConsulting Inc.. All rights reserved.
// </copyright>

namespace Application.Controllers
{
    using System.ComponentModel;

    public enum ControllerErrorCode
    {
        None = 0,

        [Description("The record has been modified by another user.")]
        UpdateConcurrencyException = 1000
    }
}
