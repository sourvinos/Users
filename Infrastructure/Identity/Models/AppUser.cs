using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Users {

      public class AppUser : IdentityUser {

            public string DisplayName { get; set; }
            public virtual List<Token> Tokens { get; set; }

      }

}