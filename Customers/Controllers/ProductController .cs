using Customers.Data;
using Customers.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Customers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            return await _context.Products
                .Include(p => p.CategoryMappings)
                    .ThenInclude(m => m.ProductCategory)
                .ToListAsync();
        }

        // GET: api/product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryMappings)
                    .ThenInclude(m => m.ProductCategory)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            return product;
        }

        // POST: api/product
        [HttpPost]
        public async Task<ActionResult<Product>> Create(Product product)
        {
            // Attach categories to product
            foreach (var catId in product?.categoryIds)
            {
                product.CategoryMappings.Add(new ProductCategoryMap
                {
                    ProductCategoryId = catId,
                    Product = product
                });
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        // PUT: api/product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product updatedProduct)
        {
            var existingProduct = await _context.Products
                .Include(p => p.CategoryMappings)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingProduct == null)
                return NotFound();

            // Update product fields
            existingProduct.Name = updatedProduct.Name;
            existingProduct.Description = updatedProduct.Description;
            existingProduct.Price = updatedProduct.Price;
            existingProduct.StockQuantity = updatedProduct.StockQuantity;

            // Update categories
            existingProduct.CategoryMappings.Clear();
            foreach (var catId in updatedProduct?.categoryIds)
            {
                existingProduct.CategoryMappings.Add(new ProductCategoryMap
                {
                    ProductCategoryId = catId,
                    ProductId = id
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryMappings)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<Product>>> GetPagedProducts(int page = 1,int pageSize = 10,string? search = null)
        {
            var query = _context.Products
                .Include(p => p.CategoryMappings)
                    .ThenInclude(m => m.ProductCategory)
                .AsQueryable();

            // Apply filtering
            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.Name.Contains(search));

            // Pagination logic
            var totalCount = await query.CountAsync();

            var pagedData = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Return result
            return Ok(new
            {
                page,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                data = pagedData
            });
        }

    }
}
