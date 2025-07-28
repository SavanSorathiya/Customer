using Backend.Data;
using Backend.DTOs;
using Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            try
            {
                return await _context.Products
                    .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error retrieving data from the database");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    return NotFound($"Product with ID {id} not found");
                }

                return product;
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error retrieving data from the database");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var product = new Product
                {
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    StockQuantity = productDto.StockQuantity
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Add categories
                if (productDto.CategoryIds != null && productDto.CategoryIds.Any())
                {
                    foreach (var categoryId in productDto.CategoryIds)
                    {
                        if (await _context.Categories.AnyAsync(c => c.Id == categoryId))
                        {
                            _context.ProductCategories.Add(new ProductCategory
                            {
                                ProductId = product.Id,
                                CategoryId = categoryId
                            });
                        }
                    }
                    await _context.SaveChangesAsync();
                }

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error creating new product");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound($"Product with ID {id} not found");
                }

                // Update product properties
                product.Name = productDto.Name;
                product.Description = productDto.Description;
                product.Price = productDto.Price;
                product.StockQuantity = productDto.StockQuantity;

                // Update categories
                var existingCategories = await _context.ProductCategories
                    .Where(pc => pc.ProductId == id)
                    .ToListAsync();

                _context.ProductCategories.RemoveRange(existingCategories);

                if (productDto.CategoryIds != null && productDto.CategoryIds.Any())
                {
                    foreach (var categoryId in productDto.CategoryIds)
                    {
                        if (await _context.Categories.AnyAsync(c => c.Id == categoryId))
                        {
                            _context.ProductCategories.Add(new ProductCategory
                            {
                                ProductId = id,
                                CategoryId = categoryId
                            });
                        }
                    }
                }

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error updating product");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound($"Product with ID {id} not found");
                }

                // First remove product categories
                var productCategories = await _context.ProductCategories
                    .Where(pc => pc.ProductId == id)
                    .ToListAsync();

                _context.ProductCategories.RemoveRange(productCategories);
                _context.Products.Remove(product);

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error deleting product");
            }
        }
    }
}
