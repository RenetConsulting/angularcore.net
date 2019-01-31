namespace Application.Business.Test
{
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using Application.Business.Models;
    using Application.DataAccess.Enums;
    using Application.DataAccess.Repositories;
    using Moq;
    using Xunit;

    public class EntityManagementFixture
    {
        private Mock<IGlobalRepository> mockRepo;

        public EntityManagementFixture()
        {
            this.mockRepo = new Mock<IGlobalRepository>();
        }

        #region AddAsync
        [Fact]
        public async Task AddAsyncTest_Exception_ParameterIsNull()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            Exception ex = await Assert.ThrowsAsync<ArgumentNullException>(async () => await um.AddAsync(null));
            Assert.Equal("Value cannot be null.\r\nParameter name: model", ex.Message);
        }

        [Fact]
        public async Task AddAsyncTest_Validate_TrueResult()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            // Create mock model
            Mock<IEntityModel<MockEntity>> mockModel = new Mock<IEntityModel<MockEntity>>();

            // Create object MockEntity
            MockEntity mockEntity = new MockEntity();

            // Setup Moq
            mockModel.Setup(x => x.ToEntity())
                .Returns(mockEntity);

            this.mockRepo.Setup(x => x.AddAsync(mockEntity))
                .Returns(Task.FromResult(mockEntity)).Verifiable();

            // Run Code
            var result = await um.AddAsync(mockModel.Object);

            // Validate true result
            Assert.Equal(mockModel.Object, result);
        }
        #endregion

        #region UpdateAsync
        [Fact]
        public async Task UpdateAsyncTest_Exception_ParameterIsNull()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            Exception ex = await Assert.ThrowsAsync<ArgumentNullException>(async () => await um.UpdateAsync(null));
            Assert.Equal("Value cannot be null.\r\nParameter name: model", ex.Message);
        }

        [Fact]
        public async Task UpdateAsyncTest_Validate_TrueResult()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            // Create mock model
            Mock<IEntityModel<MockEntity>> mockModel = new Mock<IEntityModel<MockEntity>>();

            // Create object MockEntity
            MockEntity mockEntity = new MockEntity();

            // Setup Moq
            mockModel.Setup(x => x.ToEntity())
                .Returns(mockEntity);

            this.mockRepo.Setup(x => x.UpdateAsync(mockEntity))
                .Returns(Task.FromResult(mockEntity)).Verifiable();

            // Run Code
            var result = await um.UpdateAsync(mockModel.Object);

            // Validate true result
            Assert.Equal(mockModel.Object, result);
        }
        #endregion

        #region FindByIdAsync
        [Fact]
        public async Task FindByIdAsyncTest_Exception_ParameterIsNull()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            Exception ex = await Assert.ThrowsAsync<ArgumentNullException>(async () => await um.FindByIdAsync(null));
            Assert.Equal("Value cannot be null.\r\nParameter name: keys", ex.Message);
        }

        [Fact]
        public async Task FindByIdAsyncTest_Validate_FoundResult()
        {
            int key = 1;
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            // Create mock model
            Mock<IEntityModel<MockEntity>> mockModel = new Mock<IEntityModel<MockEntity>>();

            // Create object MockEntity
            MockEntity mockEntity = new MockEntity();

            this.mockRepo.Setup(x => x.FindByIdAsync<MockEntity>(key))
                .Returns(Task.FromResult(mockEntity)).Verifiable();

            // Run Code
            var result = await um.FindByIdAsync(key);

            // Validate true result
            Assert.Equal(mockEntity, result);
        }

        #endregion

        #region ListTest
        [Fact]
        public void ToModelListTest_ValidateDataCreation()
        {
            List<MockEntity> list = new List<MockEntity>();
            list.Add(new MockEntity { Id = 1 });
            list.Add(new MockEntity { Id = 2 });

            var result = EntityManagement<MockEntity>.ToModelList<MockEntity, MockModel>(list.ToArray());

            Assert.Equal(list.Count, result.Count);
            Assert.Equal(list[0].Id, ((MockModel)result[0]).Id);
            Assert.Equal(list[0].CreatedDate, ((MockModel)result[0]).CreatedDate);
            Assert.Equal(list[1].Id, ((MockModel)result[1]).Id);
        }

        [Fact]
        public async Task ListTest_ReturnsSuccessResult()
        {
            int? page = 1;
            int? count = 10;
            bool? active = true;
            string sortFieldName = "unitId";
            SortOrder? sortOrder = SortOrder.Ascending;

            List<MockEntity> listMockEntity = new List<MockEntity>
            {
                new MockEntity { Id = 1 },
                new MockEntity { Id = 2 }
            };

            long totalItems = 50;

            this.mockRepo.Setup(x => x.ListAsync<MockEntity>(0, count, active, sortFieldName, sortOrder))
                .Returns(Task.FromResult((listMockEntity.ToArray(), totalItems))).Verifiable();

            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            var result = await um.ListAsync<MockModel>(page, count, active, sortFieldName, sortOrder);

            Assert.Equal(listMockEntity.Count, result.list.Length);
            Assert.Equal(totalItems, result.totalItems);
        }
        #endregion

        [Fact]
        public void ConvertPageCountTest_ValidateBothNull()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            var converter = um.ConvertPageCount(null, null);

            Assert.Equal(0, converter.skip);
            Assert.Null(converter.take);
        }

        [Fact]
        public void ConvertPageCountTest_ValidateNegative()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            var converter = um.ConvertPageCount(-1, -1);

            Assert.Equal(0, converter.skip);
            Assert.Null(converter.take);
        }

        [Fact]
        public void ConvertPageCountTest_ValidateZero()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            var converter = um.ConvertPageCount(0, 0);

            Assert.Equal(0, converter.skip);
            Assert.Null(converter.take);
        }

        [Fact]
        public void ConvertPageCountTest_ValidatePositiveFirstPage()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            var converter = um.ConvertPageCount(1, 10);

            Assert.Equal(0, converter.skip);
            Assert.Equal(10, converter.take);
        }

        [Fact]
        public void ConvertPageCountTest_ValidatePositiveSecondPage()
        {
            EntityManagement<MockEntity> um = new EntityManagement<MockEntity>(this.mockRepo.Object);

            var converter = um.ConvertPageCount(2, 10);

            Assert.Equal(10, converter.skip);
            Assert.Equal(10, converter.take);
        }
    }
}
