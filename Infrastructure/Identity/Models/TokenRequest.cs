using System.ComponentModel.DataAnnotations;

namespace Users {

      public class TokenRequest {

            public string UserName { get; set; }
            public string Password { get; set; }
            public string GrantType { get; set; }
            public string RefreshToken { get; set; }

      }

}