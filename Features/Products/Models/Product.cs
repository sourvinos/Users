using System.ComponentModel.DataAnnotations;

namespace Users {

      public class Product {

            [Key]
            public int ProductId { get; set; }

            [Required]
            [MaxLength(50)]
            public string Name { get; set; }

            [Required]
            [MaxLength(50)]
            public string Description { get; set; }

            [Required]
            public bool OutOfStock { get; set; }

            [Required]
            public string ImageUrl { get; set; }

            [Required]
            public decimal Price { get; set; }

      }

}