﻿namespace Application.DataAccess.Test.MockDbSet
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;

    public class MockAsyncEnumerableExtensions<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
    {
        public MockAsyncEnumerableExtensions(IEnumerable<T> enumerable)
            : base(enumerable)
        {
        }

        public MockAsyncEnumerableExtensions(Expression expression)
            : base(expression)
        {
        }

        public IAsyncEnumerator<T> GetEnumerator()
            => new MockAsyncEnumeratorExtensions<T>(this.AsEnumerable().GetEnumerator());

#pragma warning disable SA1201 // Elements must appear in the correct order
        IQueryProvider IQueryable.Provider
#pragma warning restore SA1201 // Elements must appear in the correct order
            => new MockAsyncDbSetExtensions<T>(this);
    }
}
