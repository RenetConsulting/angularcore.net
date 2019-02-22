// <copyright file="IEntityModel.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Models
{
    public interface IEntityModel<TEntity>
        where TEntity : class
    {
        TEntity ToEntity();

        void ToModel(TEntity entity);
    }
}
