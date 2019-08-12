// <copyright file="IBlogService.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Interfaces
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Threading.Tasks;
    using Application.Business.Models;

    public interface IBlogService
    {
        [SuppressMessage("StyleCop.CSharp.SpacingRules", "SA1009:ClosingParenthesisMustBeSpacedCorrectly", Justification = "ValueTuple.")]
        Task<(List<BlogModel>, int)> GetBlogsAsync(int index, int count, string userId);

        Task<BlogModel> GetBlogAsync(string blogId);

        Task<BlogModel> AddBlogAsync(BlogModel model, string userId);

        Task<BlogModel> UpdateBlogAsync(BlogModel model, string userId);

        Task DeleteBlogAsync(string blogId, string userId);
    }
}
