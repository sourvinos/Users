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

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppSettings _appSettings;
        private readonly IEmailSender _emailSender;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailSender emailSender, IOptions<AppSettings> appSettings) {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
            _emailSender = emailSender;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel formData) {

            List<string> errorList = new List<string>();

            var user = new ApplicationUser {
                Email = formData.Email,
                UserName = formData.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, formData.Password);

            if (result.Succeeded) {

                await _userManager.AddToRoleAsync(user, "Customer");

                // Create email token
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                // Create the full url that will be sent via email
                var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol : HttpContext.Request.Scheme);

                // Send the email
                await _emailSender.SendEmailAsync(user.Email, "Techhowdy.com - Confirm Your Email", "Please confirm your e-mail by clicking this link: <a href=\"" + callbackUrl + "\">click here</a>");

                // MUST return JSON or NOTHING, otherwise Angular will complain with 'invalid characters'
                // i.e. return Ok()
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

            var user = await _userManager.FindByNameAsync(formData.Username);
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));
            var tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);

            if (user != null && await _userManager.CheckPasswordAsync(user, formData.Password)) {

                if (!await _userManager.IsEmailConfirmedAsync(user)) {
                    ModelState.AddModelError(string.Empty, "User Has not Confirmed Email.");
                    // This will be caught by the login method in the front-end
                    return Unauthorized(new { LoginError = "We sent you an Confirmation Email. Please Confirm Your Registration With Techhowdy.com To Log in." });
                }

                var roles = await _userManager.GetRolesAsync(user);
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
                    Issuer = _appSettings.Site,
                    Audience = _appSettings.Audience,
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

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) { return new JsonResult("Error"); }
            if (user.EmailConfirmed) { return Redirect("/login"); }

            var result = await _userManager.ConfirmEmailAsync(user, code);

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

    }

}