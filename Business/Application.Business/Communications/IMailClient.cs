namespace Application.Business.Communications
{
    using System.Net.Mail;
    using System.Threading.Tasks;
    using SendGrid;

    public interface IMailClient
    {
        Task<Response> SendEmailAsync(MailMessage mailMessage);

        Task<Response> SendEmailAsync(string emailFrom, string emailTo, string subject, string messageBody);
    }
}