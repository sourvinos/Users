using Microsoft.Extensions.DependencyInjection;
using Users.Services;

namespace Users.Email {

    public static class SendGridExtensions {

        public static IServiceCollection AddSendGridEmailSender(this IServiceCollection services) {

            // Create a new instance every time a user registers and an email is sent
            services.AddTransient<IEmailSender, SendGridEmailSender>();

            return services;

        }

    }

}