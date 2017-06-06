namespace Application.Angular.Controllers
{
    public class ResponseError<T>
    {
        public ControllerErrorCode ErrorCode { get; set; }

        public string ErrorMessage { get; set; }

        public T Data { get; set; }
    }
}
