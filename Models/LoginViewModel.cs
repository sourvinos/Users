using System.ComponentModel.DataAnnotations;

namespace Users.Models {

    public class LoginViewModel {

        [Required]
        [Display(Name = "User name")]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

    }

}