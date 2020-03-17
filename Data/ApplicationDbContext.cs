using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Users {

    public class ApplicationDbContext : IdentityDbContext<IdentityUser> {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder) {

            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>().HasData(
                new { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
                new { Id = 2, Name = "Customer", NormalizedName = "CUSTOMER" },
                new { Id = 3, Name = "Moderator", NormalizedName = "MODERATOR" }
            );

        }

        public Product Products { get; set; }

    }

}