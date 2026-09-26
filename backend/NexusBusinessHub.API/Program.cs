using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Application.Interfaces;
using NexusBusinessHub.Application.Services;
using NexusBusinessHub.Infrastructure.Persistence;
using NexusBusinessHub.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Seed product catalog
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var seedFilePath = Path.Combine(
        app.Environment.ContentRootPath,
        "SeedData",
        "nexus-products-1000.json");

    await CatalogSeeder.SeedAsync(db, seedFilePath);
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();