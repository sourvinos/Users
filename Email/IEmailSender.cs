using System.Threading.Tasks;

namespace Users.Email {

    public interface IEmailSender {
        Task<SendEmailResponse> SendEmailAsync(string userEmail, string emailSubject, string message);
    }

}