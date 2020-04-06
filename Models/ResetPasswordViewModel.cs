using System.ComponentModel.DataAnnotations;

namespace Users.Models {

    public class ResetPasswordViewModel {

        public string Email { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required")]
        [MaxLength(128, ErrorMessage = "Password can not be longer than 128 characters")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Token is required")]
        public string Token { get; set; }

    }

}