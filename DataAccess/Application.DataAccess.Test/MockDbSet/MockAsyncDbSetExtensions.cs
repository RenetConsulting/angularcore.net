// <copyright file="MockAsyncDbSetExtensions.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Test.MockDbSet
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore.Query.Internal;

    public class MockAsyncDbSetExtensions<TEntity> : IAsyncQueryProvider
    {
        private readonly IQueryProvider inner;

        public MockAsyncDbSetExtensions(IQueryProvider inner)
        {
            this.inner = inner;
        }

        public IQueryable CreateQuery(Expression expression)
            => new MockAsyncEnumerableExtensions<TEntity>(expression);

        public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
            => new MockAsyncEnumerableExtensions<TElement>(expression);

        public object Execute(Expression expression)
            => this.inner.Execute(expression);

        public TResult Execute<TResult>(Expression expression)
            => this.inner.Execute<TResult>(expression);

        public IAsyncEnumerable<TResult> ExecuteAsync<TResult>(Expression expression)
            => new MockAsyncEnumerableExtensions<TResult>(expression);

        public Task<TResult> ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken)
            => Task.FromResult(this.Execute<TResult>(expression));
    }
}
