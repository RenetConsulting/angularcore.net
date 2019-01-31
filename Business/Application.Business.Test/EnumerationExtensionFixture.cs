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
