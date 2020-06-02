using System.ComponentModel.DataAnnotations;

namespace Users {

      public class ConfirmEmailViewModel {

            [Required]
            public string UserId { get; set; }

            [Required]
            public string Token { get; set; }

      }

}