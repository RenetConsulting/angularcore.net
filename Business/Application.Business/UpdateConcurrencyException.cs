// <copyright file="UpdateConcurrencyException.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business
{
    using System;

    public class UpdateConcurrencyException<T> : Exception
    {
        public T Model { get; set; }
    }
}
