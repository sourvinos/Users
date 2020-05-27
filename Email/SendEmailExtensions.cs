using Microsoft.Extensions.DependencyInjection;

namespace Users.Email {

    public static class SendEmailExtensions {

        public static IServiceCollection AddEmailSender(this IServiceCollection services) {

            services.AddTransient<IEmailSender, SendMailKitEmail>();

            return services;

        }

    }

}