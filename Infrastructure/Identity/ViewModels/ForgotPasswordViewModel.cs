using System.ComponentModel.DataAnnotations;

namespace Users {

      public class ForgotPasswordViewModel {

            [EmailAddress]
            [Required(ErrorMessage = "Email is required")]
            public string Email { get; set; }

      }

}