using System;
using System.Text;
using Auth;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Users {

      public class Startup {

            public Startup(IConfiguration configuration) {
                  Configuration = configuration;
            }

            public IConfiguration Configuration { get; }

            public void ConfigureServices(IServiceCollection services) {

                  services.Configure<RazorViewEngineOptions>(option => option.ViewLocationExpanders.Add(new FeatureViewLocationExpander()));
                  services.AddMvc();
                  services.AddEmailSender();
                  services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });
                  services.AddCors(options => { options.AddPolicy("EnableCORS", builder => { builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().Build(); }); });
                  services.AddScoped<Token>();
                  services.AddDbContext<AppDbContext>(options => options.UseSqlite(Configuration["ConnectionStrings:SqliteConnection"]));
                  services.AddIdentity<AppUser, IdentityRole>(options => {
                        options.Password.RequireDigit = false;
                        options.Password.RequiredLength = 1;
                        options.Password.RequireNonAlphanumeric = false;
                        options.Password.RequireUppercase = false;
                        options.Password.RequireLowercase = false;
                        options.User.RequireUniqueEmail = true;
                        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(2);
                        options.Lockout.MaxFailedAccessAttempts = 5;
                        options.Lockout.AllowedForNewUsers = true;
                        options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider;
                        options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
                  }).AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

                  services.Configure<SendGridSettings>(options => Configuration.GetSection("SendGridSettings").Bind(options));
                  services.Configure<OutlookSettings>(options => Configuration.GetSection("OutlookSettings").Bind(options));
                  services.Configure<TokenSettings>(options => Configuration.GetSection("TokenSettings").Bind(options));

                  var tokenSettings = Configuration.GetSection("TokenSettings");
                  services.Configure<TokenSettings>(tokenSettings);
                  var appSettings = tokenSettings.Get<TokenSettings>();
                  var key = Encoding.ASCII.GetBytes(appSettings.Secret);

                  services.AddAuthentication(options => {
                              options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                              options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                              options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                        })
                        .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => {
                              options.TokenValidationParameters = new TokenValidationParameters {
                              ValidateIssuerSigningKey = true,
                              ValidateIssuer = true,
                              ValidateAudience = true,
                              ValidIssuer = appSettings.Site,
                              ValidAudience = appSettings.Audience,
                              IssuerSigningKey = new SymmetricSecurityKey(key),
                              ClockSkew = TimeSpan.Zero
                              };
                        }).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
                              Configuration.Bind("CookieSettings", options));

                  services.AddAuthorization(options => {
                        options.AddPolicy("RequireLoggedIn", policy => policy.RequireRole("Admin", "Customer", "Moderator").RequireAuthenticatedUser());
                        options.AddPolicy("RequireAdministratorRole", policy => policy.RequireRole("Admin").RequireAuthenticatedUser());
                  });

            }

            public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
                  if (env.IsDevelopment()) {
                        app.UseDeveloperExceptionPage();
                  } else {
                        app.UseExceptionHandler("/Error/Error");
                        app.UseHsts();
                  }
                  app.UseCors("EnableCORS");
                  app.UseHttpsRedirection();
                  app.UseStaticFiles();
                  app.UseSpaStaticFiles();
                  app.UseAuthentication();
                  app.UseMvc(routes => {
                        routes.MapRoute(
                              name: "default",
                              template: "{controller}/{action=Index}/{id?}"
                        );
                  });
                  app.UseSpa(spa => {
                        spa.Options.SourcePath = "ClientApp";
                        if (env.IsDevelopment()) {
                              spa.UseAngularCliServer(
                                    npmScript: "start"
                              );
                        }
                  });
            }

      }

}