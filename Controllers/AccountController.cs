using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
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
                var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol : HttpContext.Request.Scheme);
                emailSender.SendRegistrationEmail(user.Email, user.UserName, callbackUrl);
                return Ok(new { message = "Registration Successful, confirm your email address" });

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
                    byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
                    var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
                    string passwordResetLink = Url.Action("ResetPassword", "Account", new { email = model.Email, codeEncoded }, Request.Scheme);
                    emailSender.SendResetPasswordEmail(user.Email, passwordResetLink);
                    return Ok(new { message = "Reset email sent successfully" });
                }

                return Ok(new { message = "This user was not found or the email is not confirmed yet." });

            }

            return BadRequest(new { message = "Password must not be blank" });

        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model) {

            if (ModelState.IsValid) {

                var user = await userManager.FindByEmailAsync(model.Email);

                if (user != null) {
                    var codeDecodedBytes = WebEncoders.Base64UrlDecode(model.Token);
                    var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);
                    var result = await userManager.ResetPasswordAsync(user, codeDecoded, model.Password);
                    if (result.Succeeded) {
                        return RedirectToAction("ResetPasswordConfirmed", "Notifications");
                    }
                    List<string> errors = new List<string>();

                    foreach (var error in result.Errors) {
                        errors.Add(error.Description);
                    }

                    return new JsonResult(errors);
                }

            }

            return BadRequest();
        }

    }

}