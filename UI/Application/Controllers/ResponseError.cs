// <copyright file="ResponseError.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
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
