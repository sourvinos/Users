using Microsoft.Extensions.DependencyInjection;

namespace Users {

      public static class SendEmailExtensions {

            public static IServiceCollection AddEmailSender(this IServiceCollection services) {

                  services.AddTransient<IEmailSender, SendGridEmail>();

                  return services;

            }

      }

}