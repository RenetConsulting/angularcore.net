namespace Application.Business
{
    using System;

    public class UpdateConcurrencyException<T> : Exception
    {
        public T Model { get; set; }
    }
}
