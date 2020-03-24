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
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol : HttpContext.Request.Scheme);
                _emailSender.SendRegistrationEmail(user.Email, user.UserName, callbackUrl);
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

        [HttpPost("[action]")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword model) {

            if (ModelState.IsValid) {

                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user != null && await _userManager.IsEmailConfirmedAsync(user)) {
                    string token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var callbackUrl = Url.Action("ResetPassword", "Account", new { Email = model.Email, Token = token }, protocol : HttpContext.Request.Scheme);
                    _emailSender.SendResetPasswordEmail(user.Email, callbackUrl);
                    return Ok(new { message = "Reset email sent successfully" });
                }

                return Ok(new { message = "This user was not found or the email is not confirmed yet." });

            }

            return BadRequest(new { message = "Password must not be blank" });

        }

    }

}