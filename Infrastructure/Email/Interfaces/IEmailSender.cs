namespace Users {

      public interface IEmailSender {

            SendEmailResponse SendRegistrationEmail(string userEmail, string username, string callbackUrl);
            SendEmailResponse SendResetPasswordEmail(string userEmail, string callbackUrl);
            SendEmailResponse SendResetPasswordFile(string callbackUrl);

      }

}