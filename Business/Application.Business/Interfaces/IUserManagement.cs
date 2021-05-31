// -----------------------------------------------------------------------
// <copyright file="IUserManagement.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------

namespace Application.Business.Interfaces
{
    using System.Threading.Tasks;
    using Application.Business.Models;

    public interface IUserManagement
    {
        Task<PersonInformationModel>
            AddPersonInformationAsync(PersonInformationModel userInformation, string userId);

        Task<PersonInformationModel>
            UpdatePersonInformationAsync(PersonInformationModel userInformation, string userId);

        Task<PersonInformationModel>
            GetPersonInformationAsync(string personId, string userId);
    }
}
