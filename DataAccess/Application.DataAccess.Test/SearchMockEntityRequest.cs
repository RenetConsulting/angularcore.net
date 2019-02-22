// <copyright file="SearchMockEntityRequest.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.DataAccess.Test
{
    using Application.DataAccess.Enums;

    public class SearchMockEntityRequest
    {
        public int Page { get; set; }

        public int Count { get; set; }

        public string SortFieldName { get; set; }

        public SortOrder SortOrder { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string PostalCode { get; set; }

        public string Country { get; set; }

        public string HomePhone { get; set; }

        public string WorkPhone { get; set; }

        public string MobilePhone { get; set; }

        public bool? IsActive { get; set; }
    }
}
