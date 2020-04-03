using System.ComponentModel.DataAnnotations;

namespace Users.Models {

    public class TokenRequest {

        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Grant type is required")]
        public string GrantType { get; set; }

        public string RefreshToken { get; set; }

    }

}