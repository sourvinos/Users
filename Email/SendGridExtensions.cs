using Microsoft.Extensions.DependencyInjection;

namespace Users.Email {

    public static class SendGridExtensions {

        public static IServiceCollection AddSendGridEmailSender(this IServiceCollection services) {

            services.AddTransient<IEmailSender, SendOutlookEmail>();

            return services;

        }

    }

}