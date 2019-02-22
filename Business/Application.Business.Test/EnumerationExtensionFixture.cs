// <copyright file="EnumerationExtensionFixture.cs" company="Renet Consulting, Inc">
// Copyright (c) Renet Consulting, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>

namespace Application.Business.Test
{
    using System.ComponentModel;
    using Xunit;

    public class EnumerationExtensionFixture
    {
        private enum SampleEnum
        {
            [Description("TestDescription")]
            ValueFirst = 1,
            ValueSecond
        }

        [Fact]
        public void EnumerationExtensionDescriptionTest_ReturnsSuccessResult()
        {
            SampleEnum se = SampleEnum.ValueFirst;

            string result = se.Description();

            Assert.Equal("TestDescription", result);
        }

        [Fact]
        public void EnumerationExtensionDescriptionTest_ReturnsDescriptionNotFoundResult()
        {
            SampleEnum se = SampleEnum.ValueSecond;
            string result = se.Description();

            Assert.Equal("Description not found.", result);
        }
    }
}
