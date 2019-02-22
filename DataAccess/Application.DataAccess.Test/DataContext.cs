// <copyright file="DataContext.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Test
{
    using Microsoft.EntityFrameworkCore;

    public partial class DataContextMock : DataContext
    {
        public DataContextMock(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<MockEntity> MockEntities { get; set; }
    }
}
