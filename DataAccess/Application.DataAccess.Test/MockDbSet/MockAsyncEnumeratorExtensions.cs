// <copyright file="MockAsyncEnumeratorExtensions.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Test.MockDbSet
{
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    public class MockAsyncEnumeratorExtensions<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> inner;

        public MockAsyncEnumeratorExtensions(IEnumerator<T> inner)
           => this.inner = inner;

        public T Current
           => this.inner.Current;

        public ValueTask<bool> MoveNextAsync()
             => new ValueTask<bool>(this.inner.MoveNext());

        public ValueTask DisposeAsync()
        {
            this.inner.Dispose();
            return new ValueTask();
        }
    }
}
