// <copyright file="ResponseError.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Controllers
{
    public class ResponseError<T>
    {
        public ControllerErrorCode ErrorCode { get; set; }

        public string ErrorMessage { get; set; }

        public T Data { get; set; }
    }
}
