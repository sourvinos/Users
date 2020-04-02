using System.ComponentModel.DataAnnotations;

namespace Users {

    public class ForgotPassword {

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        [MaxLength(128, ErrorMessage = "Email can not be longer than 128 characters")]
        public string Email { get; set; }

    }

}