using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Users.Data;
using Users.Models;

namespace Users.Controllers {

    [Route("api/[controller]")]
    [Authorize("RequireLoggedIn")]
    public class ProductController : ControllerBase {

        private readonly ApplicationDbContext db;

        public ProductController(ApplicationDbContext db) => (this.db) = (db);

        [HttpGet("[action]")]
        public async Task<IEnumerable<Product>> Get() {
            return await db.Products.ToListAsync();
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetProduct(int id) {
            var findProduct = db.Products.FirstOrDefault(p => p.ProductId == id);
            if (findProduct == null) return NotFound();
            return Ok(findProduct);
        }

        [HttpPost("[action]")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> AddProduct([FromBody] Product formData) {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var newProduct = new Product {
                Name = formData.Name,
                Description = formData.Description,
                OutOfStock = formData.OutOfStock,
                Price = formData.Price,
                ImageUrl = formData.ImageUrl
            };
            await db.Products.AddAsync(newProduct);
            await db.SaveChangesAsync();
            return Ok(newProduct);
        }

        [HttpPut("[action]/{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromBody] Product formData) {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var findProduct = db.Products.FirstOrDefault(p => p.ProductId == id);
            if (findProduct == null) return NotFound();
            findProduct.Name = formData.Name;
            findProduct.Description = formData.Description;
            findProduct.OutOfStock = formData.OutOfStock;
            findProduct.ImageUrl = formData.ImageUrl;
            findProduct.Price = formData.Price;
            db.Entry(findProduct).State = EntityState.Modified;
            db.Products.Update(findProduct);
            await db.SaveChangesAsync();
            return Ok(findProduct);
        }

        [HttpDelete("[action]/{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> DeleteProduct(int id) {
            var findProduct = db.Products.FirstOrDefault(p => p.ProductId == id);
            if (findProduct == null) return NotFound();
            db.Products.Remove(findProduct);
            await db.SaveChangesAsync();
            return Ok(findProduct);
        }

    }

}