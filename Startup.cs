using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Users {

    public class Startup {

        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {
            services.AddDbContext<ApplicationDbContext>(options => options.UseMySql(Configuration["ConnectionStrings:MySqlServerConnection"]));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });
            services.AddCors(options => { options.AddPolicy("EnableCORS", builder => { builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowCredentials().Build(); }); });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            } else {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseCors("EnableCORS");
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseMvc(routes => { routes.MapRoute(name: "default", template: "{controller}/{action=Index}/{id?}"); });
            app.UseSpa(spa => { spa.Options.SourcePath = "ClientApp"; if (env.IsDevelopment()) { spa.UseAngularCliServer(npmScript: "start"); } });
        }

    }

}