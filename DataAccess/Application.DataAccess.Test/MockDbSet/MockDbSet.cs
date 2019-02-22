// <copyright file="MockDbSet.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Test.MockDbSet
{
    using Microsoft.EntityFrameworkCore;
    using Moq;

    public static class MockDbSet
    {
        public static Mock<DbSet<T>> Create<T>(params T[] elements)
            where T : class
        {
            return elements.AsDbSetMock();
        }
    }
}
