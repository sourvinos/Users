using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Users.Email;
using Users.Helpers;
using Users.Models;

namespace Users.Controllers {

    [Route("api/[controller]")]

    public class AccountController : ControllerBase {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly AppSettings appSettings;
        private readonly IEmailSender emailSender;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailSender emailSender, IOptions<AppSettings> appSettings) {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.appSettings = appSettings.Value;
            this.emailSender = emailSender;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel formData) {

            List<string> errorList = new List<string>();

            var user = new ApplicationUser {
                Email = formData.Email,
                UserName = formData.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await userManager.CreateAsync(user, formData.Password);

            if (result.Succeeded) {

                await userManager.AddToRoleAsync(user, "Customer");
                string code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                string callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol : HttpContext.Request.Scheme);

                emailSender.SendRegistrationEmail(user.Email, user.UserName, callbackUrl);

                return Ok(new { username = user.UserName, email = user.Email, status = 1, message = "Registration Successful" });

            }

            foreach (var error in result.Errors) {
                ModelState.AddModelError("", error.Description);
                errorList.Add(error.Description);
            }

            return BadRequest(new JsonResult(errorList));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel formData) {

            var user = await userManager.FindByNameAsync(formData.Username);
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(appSettings.Secret));
            var tokenExpiryTime = Convert.ToDouble(appSettings.ExpireTime);

            if (user != null && await userManager.CheckPasswordAsync(user, formData.Password)) {

                if (!await userManager.IsEmailConfirmedAsync(user)) {
                    ModelState.AddModelError(string.Empty, "User Has not Confirmed Email.");
                    // This will be caught by the login method in the front-end
                    return Unauthorized(new { LoginError = "We sent you an Confirmation Email. Please Confirm Your Registration With Techhowdy.com To Log in." });
                }

                var roles = await userManager.GetRolesAsync(user);
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor {
                    Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                    new Claim("LoggedOn", DateTime.Now.ToString())
                    }),
                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                    Issuer = appSettings.Site,
                    Audience = appSettings.Audience,
                    Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime),
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(new { token = tokenHandler.WriteToken(token), expiration = token.ValidTo, username = user.UserName, role = roles.FirstOrDefault() });

            }

            ModelState.AddModelError("", "Invalid credentials");

            return Unauthorized(new { LoginError = "Invalid credentials" });

        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code) {

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code)) {
                ModelState.AddModelError("", "User Id and code are required");
                return BadRequest(ModelState);
            }

            var user = await userManager.FindByIdAsync(userId);

            if (user == null) { return new JsonResult("Error"); }
            if (user.EmailConfirmed) { return Redirect("/login"); }

            var result = await userManager.ConfirmEmailAsync(user, code);

            if (result.Succeeded) {

                return RedirectToAction("EmailConfirmed", "Notifications", new { userId, code });

            } else {

                List<string> errors = new List<string>();

                foreach (var error in result.Errors) {
                    errors.Add(error.ToString());
                }

                return new JsonResult(errors);

            }

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword model) {

            if (ModelState.IsValid) {

                var user = await userManager.FindByEmailAsync(model.Email);

                if (user != null && await userManager.IsEmailConfirmedAsync(user)) {
                    string token = await userManager.GeneratePasswordResetTokenAsync(user);
                    string callbackUrl = Url.Action("ResetPassword", "Account", new { email = model.Email, token }, protocol : HttpContext.Request.Scheme);
                    emailSender.SendResetPasswordEmail(user.Email, callbackUrl);
                    return Ok(new { email = user.Email, status = 1, message = "Reset email sent Successful" });
                }

                return Ok(new { message = "This user was not found or the email is not confirmed yet." });

            }

            return BadRequest(new { message = "Password must not be blank" });

        }

    }

}