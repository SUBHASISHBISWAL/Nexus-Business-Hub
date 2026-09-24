using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Infrastructure.Data;

namespace NexusBusinessHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var totalProducts = await _context.Products
            .AsNoTracking()
            .CountAsync();

        var totalOrders = await _context.Orders
            .AsNoTracking()
            .CountAsync();

        var pendingOrders = await _context.Orders
            .AsNoTracking()
            .CountAsync(o =>
                o.OrderStatus == "Placed" ||
                o.OrderStatus == "Processing");

        var paidOrders = await _context.Orders
            .AsNoTracking()
            .CountAsync(o =>
                o.PaymentStatus == "Paid");

        var pendingPayments = await _context.Orders
            .AsNoTracking()
            .CountAsync(o =>
                o.PaymentStatus == "Pending");

        var totalRevenue = await _context.Orders
            .AsNoTracking()
            .Where(o => o.PaymentStatus == "Paid")
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

        var pendingShipments = await _context.Shipments
            .AsNoTracking()
            .CountAsync(s =>
                s.ShipmentStatus != "Delivered");

        var deliveredOrders = await _context.Orders
            .AsNoTracking()
            .CountAsync(o =>
                o.OrderStatus == "Delivered");

        var recentOrders = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Payment)
            .OrderByDescending(o => o.OrderDate)
            .Take(8)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                o.OrderDate,
                o.TotalAmount,
                o.PaymentStatus,
                o.OrderStatus
            })
            .ToListAsync();

        var orderStatusSummary = await _context.Orders
            .AsNoTracking()
            .GroupBy(o => o.OrderStatus)
            .Select(group => new
            {
                status = group.Key,
                count = group.Count()
            })
            .OrderByDescending(x => x.count)
            .ToListAsync();

        var shipmentStatusSummary = await _context.Shipments
            .AsNoTracking()
            .GroupBy(s => s.ShipmentStatus)
            .Select(group => new
            {
                status = group.Key,
                count = group.Count()
            })
            .OrderByDescending(x => x.count)
            .ToListAsync();

        return Ok(new
        {
            totalProducts,
            totalOrders,
            pendingOrders,
            paidOrders,
            pendingPayments,
            totalRevenue,
            pendingShipments,
            deliveredOrders,

            recentOrders,

            orderStatusSummary,

            shipmentStatusSummary
        });
    }
}