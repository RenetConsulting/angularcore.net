// <copyright file="DataContext.Initializer.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Application.DataAccess.Entities;
    using Microsoft.EntityFrameworkCore;

    public partial class DataContext
    {
        public async Task<int> Initialize()
        {
            try
            {
                int updatedRowsCount = 0;
                List<CompleteMigration> completeMigrations = await this.CompleteMigrations.ToListAsync();

                using (var dbContextTransaction = await this.BeginTransactionAsync())
                {
                    try
                    {
                        updatedRowsCount += await this.InitializeDbContext(completeMigrations);
                        dbContextTransaction.Commit();
                        return updatedRowsCount;
                    }
                    catch (Exception ex)
                    {
                        dbContextTransaction.Rollback();
                        throw ex;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private async Task<int> InitializeDbContext(IList<CompleteMigration> completeMigrations)
        {
            bool toSave = false;
            int numberUpdatedRecords = 0;

            string initMigrationId = "D31E30D8-321D-4A9B-9757-3B6W3E4A4215";

            if (!completeMigrations.Any(cm => cm.CompleteMigrationId == initMigrationId))
            {
                // example for put a function
                // toSave |= this.Initialize();

                // save only if there is any updates
                if (toSave)
                {
                    numberUpdatedRecords = await this.SaveChangesAsync();
                }
            }

            return numberUpdatedRecords;
        }
    }
}