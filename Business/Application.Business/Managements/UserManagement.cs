// -----------------------------------------------------------------------
// <copyright file="UserManagement.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
// -----------------------------------------------------------------------
namespace Application.Business.Managements
{
    using System;
    using System.Threading.Tasks;
    using Application.Business.Interfaces;
    using Application.Business.Models;
    using Application.DataAccess.Entities;
    using Application.DataAccess.Repositories;

    public class UserManagement : EntityManagement<PersonInformation>, IUserManagement
    {
        public UserManagement(IGlobalRepository repository)
            : base(repository)
        {
        }

        public async Task<PersonInformationModel> AddPersonInformationAsync(PersonInformationModel userInformation, string userId)
        {
            try
            {
                var userInformationData = await Repository.CreateUserInformationAsync(userInformation.ToEntity(), userId);

                userInformation.ToModel(userInformationData);

                return userInformation;
            }
            catch
            {
                throw new Exception("Something wrong with adding user.");
            }
        }

        public async Task<PersonInformationModel> UpdatePersonInformationAsync(PersonInformationModel userInformation, string userId)
        {
            try
            {
                var userInformationData = await Repository.UpdateUserInformationAsync(userInformation.ToEntity(), userId);

                userInformation.ToModel(userInformationData);

                return userInformation;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException ex)
            {
                if (ex.Entries[0].Entity is PersonInformation)
                {
                    userInformation.ToModel(ex.Entries[0].Entity as PersonInformation);

                    throw new UpdateConcurrencyException<PersonInformationModel>() { Model = userInformation };
                }
                else
                {
                    throw new Exception("Something wrong with update user information.");
                }
            }
            catch
            {
                throw new Exception("Something wrong with update user information.");
            }
        }
    }
}
