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

    public class ProductController : Controller {

        private readonly ApplicationDbContext _db;

        public ProductController(ApplicationDbContext db) {
            _db = db;
        }

        [HttpGet("[action]")]
        public IActionResult Get() {

            return Ok(_db.Products.ToList());

        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetProduct(int id) {

            var findProduct = _db.Products.FirstOrDefault(p => p.ProductId == id);

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

            await _db.Products.AddAsync(newProduct);
            await _db.SaveChangesAsync();

            return Ok(newProduct);

        }

        [HttpPut("[action]/{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromBody] Product formData) {

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var findProduct = _db.Products.FirstOrDefault(p => p.ProductId == id);

            if (findProduct == null) return NotFound();

            findProduct.Name = formData.Name;
            findProduct.Description = formData.Description;
            findProduct.OutOfStock = formData.OutOfStock;
            findProduct.ImageUrl = formData.ImageUrl;
            findProduct.Price = formData.Price;

            _db.Entry(findProduct).State = EntityState.Modified;
            _db.Products.Update(findProduct);

            await _db.SaveChangesAsync();

            return Ok(findProduct);

        }

        [HttpDelete("[action]/{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> DeleteProduct(int id) {

            var findProduct = _db.Products.FirstOrDefault(p => p.ProductId == id);

            if (findProduct == null) return NotFound();

            _db.Products.Remove(findProduct);

            await _db.SaveChangesAsync();

            return Ok(findProduct);

        }

    }

}