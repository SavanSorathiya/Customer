using Customers.Data;
using Customers.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Customers.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAll()
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return order;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> Create(Order order)
        {
            // Calculate total
            order.TotalAmount = order.OrderItems.Sum(i => i.Quantity * i.UnitPrice);
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order updatedOrder)
        {
            if (id != updatedOrder.Id)
                return BadRequest();

            var existingOrder = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (existingOrder == null)
                return NotFound();

            // Update fields
            existingOrder.CustomerId = updatedOrder.CustomerId;
            existingOrder.OrderDate = updatedOrder.OrderDate;

            // Replace items
            existingOrder.OrderItems.Clear();
            foreach (var item in updatedOrder.OrderItems)
            {
                existingOrder.OrderItems.Add(item);
            }

            existingOrder.TotalAmount = existingOrder.OrderItems.Sum(i => i.Quantity * i.UnitPrice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("latestOrder")]
        public async Task<ActionResult<IEnumerable<Order>>> GetLatestOrdersPerCustomer()
        {
            var allOrders = await _context.Orders.ToListAsync();
            var latestOrders = allOrders.GroupBy(o => o.CustomerId)
                .Select(g => g.OrderByDescending(o => o.OrderDate).First())
                .ToList();
            return Ok(latestOrders);
        }
    }
}
