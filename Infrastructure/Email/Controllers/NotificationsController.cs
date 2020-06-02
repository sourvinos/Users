using Microsoft.AspNetCore.Mvc;

namespace Users {

      public class NotificationsController : Controller {

            public IActionResult EmailConfirmation(string userId, string token) {
                  if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token)) {
                        return RedirectToAction("Login", "Account");
                  }
                  return View();
            }

            public IActionResult ResetPasswordConfirmation() {
                  return View();
            }

      }

}