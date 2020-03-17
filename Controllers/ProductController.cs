using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Users.Data;

namespace Users.Controllers {

    [Route("api/[controller]")]
    public class ProductController : Controller {

        private readonly ApplicationDbContext _db;

        public ProductController(ApplicationDbContext db) {
            _db = db;
        }

        [HttpGet("[action]")]
        public IActionResult GetProducts() {

            return Ok(_db.Products.ToList());

        }

    }

}