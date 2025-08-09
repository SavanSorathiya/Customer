using Customers.Data;
using Customers.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Customers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductCategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductCategory>>> GetAll()
        {
            return await _context.ProductCategories.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductCategory>> GetById(int id)
        {
            var category = await _context.ProductCategories.FindAsync(id);
            if (category == null)
                return NotFound();

            return category;
        }

        [HttpPost]
        public async Task<ActionResult<ProductCategory>> Create(ProductCategory category)
        {
            _context.ProductCategories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProductCategory updatedCategory)
        {
            var category = await _context.ProductCategories.FindAsync(id);
            if (category == null)
                return NotFound();

            category.Name = updatedCategory.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.ProductCategories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.ProductCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
