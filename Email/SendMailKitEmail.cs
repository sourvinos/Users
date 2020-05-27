using System;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using Users.Helpers;

namespace Users.Email {

    public class SendMailKitEmail : IEmailSender {

        private readonly AppSettings _appSettings;

        public SendMailKitEmail(IOptions<AppSettings> appSettings) {
            _appSettings = appSettings.Value;
        }

        public SendEmailResponse SendRegistrationEmail(string userEmail, string username, string callbackUrl) {
            throw new NotImplementedException();
        }

        public SendEmailResponse SendResetPasswordEmail(string userEmail, string callbackUrl) {

            var message = new MailMessage();

            message.To.Add("peoplemovers@outlook.com");
            message.Subject = "Hello!";
            message.Body = "Whatever...";
            message.From = new MailAddress("gatopoulidis@gmail.com");
            message.IsBodyHtml = false;

            var smtp = new SmtpClient("smtp.gmail.com");
            smtp.Port = 587;
            smtp.UseDefaultCredentials = true;
            smtp.EnableSsl = true;
            smtp.Credentials = new NetworkCredential("gatopoulidis@gmail.com", "Ncc74656");
            smtp.Send(message);

            return new SendEmailResponse();

        }

    }

}