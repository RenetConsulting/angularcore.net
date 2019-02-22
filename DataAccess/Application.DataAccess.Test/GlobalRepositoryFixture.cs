// <copyright file="GlobalRepositoryFixture.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Test
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Enums;
    using Application.DataAccess.Repositories;
    using Application.DataAccess.Test.MockDbSet;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Storage;
    using Moq;
    using Xunit;

    public class GlobalRepositoryFixture : IDisposable
    {
        // Flag: Has Dispose already been called?
        private bool disposed = false;

        private GlobalRepository repo;

        private Mock<IUserStore<ApplicationUser>> mockStore;

        private Mock<DataContextMock> mockContext;

        private Mock<UserManager<ApplicationUser>> mockUserManager;

        private UserManager<ApplicationUser> userManager;

        public GlobalRepositoryFixture()
        {
            var mockOptions = new DbContextOptions<DataContext>();
            this.mockContext = new Mock<DataContextMock>(mockOptions);
            this.mockStore = new Mock<IUserStore<ApplicationUser>>();
            this.mockUserManager = new Mock<UserManager<ApplicationUser>>(this.mockStore.Object, null, null, null, null, null, null, null, null);
            this.userManager = this.mockUserManager.Object;

            this.repo = new GlobalRepository(this.mockContext.Object, this.userManager);
        }

        ~GlobalRepositoryFixture()
        {
            this.Dispose(false);
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        #region BeginTransaction
        [Fact]
        public void BeginTransaction_Success()
        {
            Mock<IDbContextTransaction> mockTransaction = new Mock<IDbContextTransaction>();

            // Setup Moq
            this.mockContext.Setup(x => x.BeginTransaction())
                .Returns(mockTransaction.Object).Verifiable();

            var result = this.repo.BeginTransaction();

            Assert.Equal(result, mockTransaction.Object);
        }

        [Fact]
        public async Task BeginTransactionAsync_Success()
        {
            Mock<IDbContextTransaction> mockTransaction = new Mock<IDbContextTransaction>();
            CancellationToken cancel = default(CancellationToken);

            // Setup Moq
            this.mockContext.Setup(x => x.BeginTransactionAsync(cancel))
                .Returns(Task.FromResult(mockTransaction.Object)).Verifiable();

            var result = await this.repo.BeginTransactionAsync(cancel);

            Assert.Equal(result, mockTransaction.Object);
        }

        [Fact]
        public async Task BeginTransactionAsync_Params_Success()
        {
            Mock<IDbContextTransaction> mockTransaction = new Mock<IDbContextTransaction>();
            System.Data.IsolationLevel isolationLevel = default(System.Data.IsolationLevel);
            CancellationToken cancel = default(CancellationToken);

            // Setup Moq
            this.mockContext.Setup(x => x.BeginTransactionAsync(isolationLevel, cancel))
                .Returns(Task.FromResult(mockTransaction.Object)).Verifiable();

            var result = await this.repo.BeginTransactionAsync(isolationLevel, cancel);

            Assert.Equal(result, mockTransaction.Object);
        }

        #endregion

        #region AddAsync
        [Fact]
        public async Task AddAsync_Exception_ReturnsNullResult()
        {
            Exception ex = await Assert.ThrowsAsync<ArgumentNullException>(async () => await this.repo.AddAsync<object>(null));
        }

        [Fact]
        public async Task AddAsync_ReturnsSuccessResult()
        {
            string entity = "entity";

            object returnVal = new object();

            this.mockContext.Setup(x => x.Add<string>(entity));

            int savedRecords = 1;
            CancellationToken ct = default(CancellationToken);
            this.mockContext.Setup(x => x.SaveChangesAsync(ct))
                .Returns(Task.FromResult(savedRecords)).Verifiable();

            var result = await this.repo.AddAsync<string>(entity);

            Assert.Equal(entity, result);
        }
        #endregion

        #region UpdateAsync
        [Fact]
        public async Task UpdateAsync_Exception_ReturnsNullResult()
        {
            Exception ex = await Assert.ThrowsAsync<ArgumentNullException>(async () => await this.repo.UpdateAsync<ApplicationEntity>(null));
        }

        [Fact]
        public async Task UpdateAsync_ReturnsSuccessResult()
        {
            Mock<ApplicationEntity> mockApEntity = new Mock<ApplicationEntity>();

            this.mockContext.Setup(x => x.Update<ApplicationEntity>(mockApEntity.Object));

            int savedRecords = 1;
            CancellationToken ct = default(CancellationToken);
            this.mockContext.Setup(x => x.SaveChangesAsync(ct))
                .Returns(Task.FromResult(savedRecords)).Verifiable();

            var result = await this.repo.UpdateAsync<ApplicationEntity>(mockApEntity.Object);

            Assert.Equal(mockApEntity.Object, result);
        }

        #endregion

        [Fact]
        public async Task FindItems_Success()
        {
            int? skip = 0;
            int? take = 10;
            PropertyInfo sortFieldProperty = null;
            SortOrder? sortOrder = SortOrder.Ascending;

            Expression<Func<ApplicationEntity, bool>> whereAnd = x => x.IsActive.GetValueOrDefault();

            List<ApplicationEntity> entityList = new List<ApplicationEntity>
            {
                new Mock<ApplicationEntity>().Object,
                new Mock<ApplicationEntity>().Object,
            };

            long total = entityList.Count;

            this.mockContext.Setup(x => x.Set<ApplicationEntity>())
                .Returns(entityList.AsDbSetMock().Object);

            var(list, totalItems) = await this.repo.FindItems<ApplicationEntity, Expression<Func<ApplicationEntity, bool>>, object>(whereAnd, null, skip, take, sortFieldProperty, sortOrder);

            Assert.Equal(entityList.Count, list.Length);
            Assert.Equal(total, totalItems);
        }

        [Fact]
        public async Task ItemListTest_Success()
        {
            int? skip = 0;
            int? take = 10;
            bool active = true;
            PropertyInfo sortFieldProperty = null;
            SortOrder? sortOrder = SortOrder.Ascending;

            Mock<ApplicationEntity> app1 = new Mock<ApplicationEntity>();
            app1.Object.IsActive = true;
            Mock<ApplicationEntity> app2 = new Mock<ApplicationEntity>();
            app2.Object.IsActive = true;

            List<ApplicationEntity> entityList = new List<ApplicationEntity>
            {
                app1.Object,
                app2.Object
            };

            IQueryable<ApplicationEntity> selector = entityList.AsDbSetMock().Object.AsQueryable();

            this.mockContext.Setup(x => x.Set<ApplicationEntity>())
                .Returns(entityList.AsDbSetMock().Object);

            long total = entityList.Count;

            var(list, totalItems) = await this.repo.ItemList(selector, skip, take, active, sortFieldProperty, sortOrder);

            Assert.Equal(total, totalItems);
        }

        [Fact]
        public async Task ListAsyncTest_Success()
        {
            int? skip = 0;
            int? take = 10;
            bool active = true;
            string sortFieldName = "IsActive";
            SortOrder? sortOrder = SortOrder.Ascending;

            Mock<ApplicationEntity> app1 = new Mock<ApplicationEntity>();
            app1.Object.IsActive = true;
            Mock<ApplicationEntity> app2 = new Mock<ApplicationEntity>();
            app2.Object.IsActive = true;

            List<ApplicationEntity> entityList = new List<ApplicationEntity>
            {
                app1.Object,
                app2.Object
            };

            this.mockContext.Setup(x => x.Set<ApplicationEntity>())
                .Returns(entityList.AsDbSetMock().Object);

            long total = entityList.Count;

            var(list, totalItems) = await this.repo.ListAsync<ApplicationEntity>(skip, take, active, sortFieldName, sortOrder);

            Assert.Equal(total, totalItems);
        }

        [Fact]
        public async Task FindByIdAsyncTest_Found()
        {
            var dummyUnit = new MockEntity() { MockEntityId = 1, FirstName = "A1" };

            // Setup Moq
            this.mockContext.Setup(x => x.FindAsync<MockEntity>(1))
                .Returns(Task.FromResult(dummyUnit));

            // Run Code
            var unit = await this.repo.FindByIdAsync<MockEntity>(dummyUnit.MockEntityId);

            // Validate result
            Assert.Equal(dummyUnit, unit);
        }

        [Fact]
        public async Task FindByIdAsyncTest_NotFound()
        {
            int id = 2;

            // Setup Moq
            this.mockContext.Setup(x => x.FindAsync<EntitySample>(1))
                .Returns(Task.FromResult((EntitySample)null));

            // Run Code
            var unit = await this.repo.FindByIdAsync<EntitySample>(id);

            // Validate result
            Assert.Null(unit);
        }

        [Fact]
        public void WhereSelectorTest_NullEntity()
        {
            DbSet<EntitySample> obj = null;

            // Setup Moq
            this.mockContext.Setup(x => x.Set<EntitySample>())
                .Returns(obj);

            // Run Code
            var result = this.repo.WhereSelector<EntitySample, SearchMockEntityRequest, SearchPhoneMockRequest>(null, null);

            Assert.Equal(obj, result);
        }

        [Fact]
        public void WhereSelectorTest_AndOrAreNull()
        {
            // the default selection IsActive == True if the object is not supplied
            List<MockEntity> mockOwners = new List<MockEntity>
            {
                new MockEntity { MockEntityId = 1, IsActive = true },
                new MockEntity { MockEntityId = 2, IsActive = false }
            };

            // Setup Moq
            var mockDbSet = mockOwners.AsDbSetMock();
            this.mockContext.Setup(x => x.MockEntities).Returns(mockDbSet.Object);
            this.mockContext.Setup(x => x.Set<MockEntity>()).Returns(mockDbSet.Object);

            // Run Code
            var result = this.repo.WhereSelector<MockEntity, SearchMockEntityRequest, SearchPhoneMockRequest>(null, null);

            Assert.NotNull(result);
            var data = result.ToArray();
            Assert.NotNull(data);
            Assert.Equal(2, data.Length);
        }

        [Fact]
        public void WhereSelectorTest_OrIsNull()
        {
            List<MockEntity> mockOwners = new List<MockEntity>
            {
                new MockEntity { MockEntityId = 1, IsActive = true },
                new MockEntity { MockEntityId = 2, IsActive = false }
            };

            // Setup Moq
            var mockDbSet = mockOwners.AsDbSetMock();
            this.mockContext.Setup(x => x.MockEntities).Returns(mockDbSet.Object);
            this.mockContext.Setup(x => x.Set<MockEntity>()).Returns(mockDbSet.Object);

            SearchMockEntityRequest andObj = new SearchMockEntityRequest();

            // Run Code
            var result = this.repo.WhereSelector<MockEntity, SearchMockEntityRequest, SearchPhoneMockRequest>(andObj, null);

            Assert.NotNull(result);
            var data = result.ToArray();
            Assert.NotNull(data);
            Assert.Equal(2, data.Length);
        }

        [Fact]
        public void WhereSelectorTest_AndHasValuesTheOrIsNull()
        {
            // the default selection IsActive == False as the default for bool == false
            List<MockEntity> mockOwners = new List<MockEntity>
            {
                new MockEntity { MockEntityId = 1, FirstName = "Alex", IsActive = true },
                new MockEntity { MockEntityId = 2, FirstName = "Alex", IsActive = false },
                new MockEntity { MockEntityId = 3, FirstName = "Alexander", IsActive = true }
            };

            // Setup Moq
            var mockDbSet = mockOwners.AsDbSetMock();
            this.mockContext.Setup(x => x.MockEntities).Returns(mockDbSet.Object);
            this.mockContext.Setup(x => x.Set<MockEntity>()).Returns(mockDbSet.Object);

            SearchMockEntityRequest andObj = new SearchMockEntityRequest { FirstName = "Alex", IsActive = true };

            // Run Code
            var result = this.repo.WhereSelector<MockEntity, SearchMockEntityRequest, SearchPhoneMockRequest>(andObj, null);

            Assert.NotNull(result);
            var data = result.ToArray();
            Assert.NotNull(data);
            Assert.Equal(2, data.Length);
            Assert.Equal(1, data[0].MockEntityId);
            Assert.Equal(3, data[1].MockEntityId);
        }

        [Fact]
        public void WhereSelectorTest_BothAndOrHasValues()
        {
            // the default selection IsActive == False as the default for bool == false
            List<MockEntity> mockOwners = new List<MockEntity>
            {
                new MockEntity { MockEntityId = 1, FirstName = "John", IsActive = true, MobilePhone = "503", HomePhone = "5033", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 2, FirstName = "Alex", IsActive = true, MobilePhone = "5033482346", HomePhone = "5033", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 3, FirstName = "Alexander", IsActive = true, MobilePhone = "5033482341", HomePhone = "5033", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 4, FirstName = "Alexandr", IsActive = true, MobilePhone = "5033482341", HomePhone = "5033482346", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 5, FirstName = "Alexander2", IsActive = false, MobilePhone = "5033482346", HomePhone = "5033", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 6, FirstName = "Alexa", IsActive = true, MobilePhone = string.Empty, HomePhone = string.Empty, WorkPhone = "5033482346" }
            };

            // Setup Moq
            var mockDbSet = mockOwners.AsDbSetMock();
            this.mockContext.Setup(x => x.MockEntities).Returns(mockDbSet.Object);
            this.mockContext.Setup(x => x.Set<MockEntity>()).Returns(mockDbSet.Object);

            SearchMockEntityRequest andObj = new SearchMockEntityRequest
            {
                FirstName = "Alex",
                IsActive = true
            };

            SearchPhoneMockRequest orObj = new SearchPhoneMockRequest
            {
                MobilePhone = "5033482346",
                HomePhone = "5033482346",
                WorkPhone = "5033482346",
            };

            // Run Code
            var result = this.repo.WhereSelector<MockEntity, SearchMockEntityRequest, SearchPhoneMockRequest>(andObj, orObj);

            Assert.NotNull(result);
            var data = result.ToArray();
            Assert.NotNull(data);
            Assert.Equal(3, data.Length);
            Assert.Equal(2, data[0].MockEntityId);
            Assert.Equal(4, data[1].MockEntityId);
            Assert.Equal(6, data[2].MockEntityId);
        }

        [Fact]
        public void WhereSelectorTest_OrHasValuesAndIsNull()
        {
            // the default selection IsActive == False as the default for bool == false
            List<MockEntity> mockOwners = new List<MockEntity>
            {
                new MockEntity { MockEntityId = 1, FirstName = "John", IsActive = true, MobilePhone = "503", HomePhone = "5033482346", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 2, FirstName = "Alex", IsActive = true, MobilePhone = "5033482346", HomePhone = "5033", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 3, FirstName = "Alexander", IsActive = true, MobilePhone = "5033482341", HomePhone = "5033", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 4, FirstName = "Alexandr", IsActive = true, MobilePhone = "5033482341", HomePhone = "5033482346", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 5, FirstName = "Alexander2", IsActive = false, MobilePhone = "5033482346", HomePhone = "5033", WorkPhone = string.Empty },
                new MockEntity { MockEntityId = 6, FirstName = "Alexa", IsActive = true, MobilePhone = string.Empty, HomePhone = string.Empty, WorkPhone = "5033482346" }
            };

            // Setup Moq
            var mockDbSet = mockOwners.AsDbSetMock();
            this.mockContext.Setup(x => x.MockEntities).Returns(mockDbSet.Object);
            this.mockContext.Setup(x => x.Set<MockEntity>()).Returns(mockDbSet.Object);

            SearchPhoneMockRequest orObj = new SearchPhoneMockRequest
            {
                MobilePhone = "5033482346",
                HomePhone = "5033482346",
                WorkPhone = "5033482346",
            };

            // Run Code
            var result = this.repo.WhereSelector<MockEntity, SearchMockEntityRequest, SearchPhoneMockRequest>(null, orObj);

            Assert.NotNull(result);
            var data = result.ToArray();
            Assert.NotNull(data);
            Assert.Equal(5, data.Length);
            Assert.Equal(1, data[0].MockEntityId);
            Assert.Equal(2, data[1].MockEntityId);
            Assert.Equal(4, data[2].MockEntityId);
            Assert.Equal(5, data[3].MockEntityId);
            Assert.Equal(6, data[4].MockEntityId);
        }

        private void Dispose(bool disposing)
        {
            if (this.disposed)
            {
                return;
            }

            if (disposing)
            {
                this.userManager.Dispose();
            }

            this.disposed = true;
        }
    }
}
