// <copyright file="ApplicationModelFixture.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Test
{
    using System;
    using Xunit;

    public class ApplicationModelFixture
    {
        [Fact]
        public void ToEntityTest_EntityIsNull()
        {
            MockModel model = new MockModel { Id = 1, IsActive = true, Timestamp = "AAAAAAAAB90=" };

            Exception ex = Assert.Throws<ArgumentNullException>(() => model.ToEntity(null));
            Assert.Equal("Value cannot be null.\r\nParameter name: entity", ex.Message);
        }

        [Fact]
        public void ToEntityTest_EntityNotNull()
        {
            MockModel model = new MockModel { Id = 1, IsActive = true, Timestamp = "AAAAAAAAB90=" };

            MockEntity entity = new MockEntity();

            model.ToEntity(entity);

            Assert.Equal(model.Timestamp, entity.Timestamp);
            Assert.Equal(model.IsActive, entity.IsActive);
        }

        [Fact]
        public void EntityToModelTest_EntityIsNull()
        {
            MockModel model = new MockModel { Id = 1, IsActive = true, Timestamp = "AAAAAAAAB90=" };

            Exception ex = Assert.Throws<ArgumentNullException>(() => model.ToModel(null));
            Assert.Equal("Value cannot be null.\r\nParameter name: entity", ex.Message);
        }

        [Fact]
        public void EntityToModelTest_EntityNotNull()
        {
            MockModel model = new MockModel { Id = 1, IsActive = true, Timestamp = "AAAAAAAAB90=", CreatedBy = "Alex", UpdatedBy = "John" };

            MockEntity entity = new MockEntity { Id = 1, IsActive = true, Timestamp = "AAAAAAABftI=", CreatedBy = "Jim", UpdatedBy = "Kim", CreatedDate = new DateTime(2000, 1, 20), UpdatedDate = new DateTime(2001, 2, 22) };

            model.ToModel(entity);

            Assert.Equal(model.Timestamp, entity.Timestamp);
            Assert.Equal(model.IsActive, entity.IsActive);

            Assert.Equal(model.CreatedBy, entity.CreatedBy);
            Assert.Equal(model.UpdatedBy, entity.UpdatedBy);
            Assert.Equal(model.CreatedDate, entity.CreatedDate);
            Assert.Equal(model.UpdatedDate, entity.UpdatedDate);
        }
    }
}
