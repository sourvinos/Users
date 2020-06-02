using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using static System.Environment;
using static System.IO.Path;

namespace Users {

      public class SendOutlookEmail : IEmailSender {

            private readonly OutlookSettings outlookSettings;

            public SendOutlookEmail(IOptions<OutlookSettings> outlookSettings) =>
                  this.outlookSettings = outlookSettings.Value;

            public SendEmailResponse SendRegistrationEmail(string userEmail, string username, string callbackUrl) {

                  using(MailMessage mail = new MailMessage()) {
                        mail.From = new MailAddress(outlookSettings.From);
                        mail.To.Add(userEmail);
                        mail.Subject = "Complete your account setup";
                        mail.Body = "<h1 style='color: #FE9F36; font-family: Roboto Condensed;'>Hello, " + username + "!" + "</h1>";
                        mail.Body += "<h2 style='color: #2e6c80;'>Welcome to People Movers!</h2>";
                        mail.Body += "<p>Click the following button to confirm your email account.</p>";
                        mail.Body += "<div id='button' style='padding: 1rem;'>";
                        mail.Body += "<a style='background-color: #57617B; color: #ffffff; border-radius: 5px; padding: 1rem 2rem; text-decoration: none;' href=" + callbackUrl + ">Confirm email</a>";
                        mail.Body += "</div>";
                        mail.Body += "<p>If clicking doesn't work, copy and paste this link:</p>";
                        mail.Body += "<p>" + callbackUrl + "</p>";
                        mail.Body += "<p style='font-size: 11px; margin: 2rem 0;'>&copy; People Movers " + DateTime.Now.ToString("yyyy") + "</p>";
                        mail.IsBodyHtml = true;
                        using(SmtpClient smtp = new SmtpClient(outlookSettings.SmtpClient, outlookSettings.Port)) {
                              smtp.UseDefaultCredentials = true;
                              smtp.Credentials = new NetworkCredential(outlookSettings.Username, outlookSettings.Password);
                              smtp.EnableSsl = true;
                              smtp.Send(mail);
                        }
                  }

                  return new SendEmailResponse();

            }

            public SendEmailResponse SendResetPasswordEmail(string userEmail, string callbackUrl) {

                  using(MailMessage mail = new MailMessage()) {
                        mail.From = new MailAddress(outlookSettings.From);
                        mail.To.Add(userEmail);
                        mail.Subject = "Password reset";
                        mail.Body = "<h1 style='color: #FE9F36; font-family: Roboto Condensed;'>Hello, " + userEmail + "!" + "</h1>";
                        mail.Body += "<h2 style='color: #2e6c80;'>You have requested a password reset</h2>";
                        mail.Body += "<p>Click the following button to reset your password.</p>";
                        mail.Body += "<div id='button' style='padding: 1rem;'>";
                        mail.Body += "<a style='background-color: #57617B; color: #ffffff; border-radius: 5px; padding: 1rem 2rem; text-decoration: none;' href=" + callbackUrl + ">Reset password</a>";
                        mail.Body += "</div>";
                        mail.Body += "<p>If clicking doesn't work, copy and paste this link:</p>";
                        mail.Body += "<p>" + callbackUrl + "</p>";
                        mail.Body += "<p style='font-size: 11px; margin: 2rem 0;'>&copy; People Movers " + DateTime.Now.ToString("yyyy") + "</p>";
                        mail.IsBodyHtml = true;
                        using(SmtpClient smtp = new SmtpClient(outlookSettings.SmtpClient, outlookSettings.Port)) {
                              smtp.UseDefaultCredentials = true;
                              smtp.Credentials = new NetworkCredential(outlookSettings.Username, outlookSettings.Password);
                              smtp.EnableSsl = true;
                              smtp.Send(mail);
                        }
                  }

                  return new SendEmailResponse();

            }

            public SendEmailResponse SendResetPasswordFile(string callbackUrl) {
                  string textFile = Combine(CurrentDirectory, "Streams.txt");
                  StreamWriter text = File.AppendText(textFile);
                  text.WriteLine(callbackUrl);
                  text.Close();
                  return new SendEmailResponse();
            }

      }

}