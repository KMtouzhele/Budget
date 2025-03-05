using Microsoft.EntityFrameworkCore;
using Budget.DB;
using Budget.DB.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Budget.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BudgetDBContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("DevDBConnection"))
);

builder.Services.AddIdentity<AspNetUser, IdentityRole>()
    .AddEntityFrameworkStores<BudgetDBContext>()
    .AddDefaultTokenProviders();

// builder.Services.AddTransient<AuthService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    string? key = builder.Configuration["Jwt:Key"];
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!));
    securityKey.KeyId = "budget-app";

    Console.WriteLine($"Key: {key}");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = securityKey
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
    {
        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
        Console.WriteLine($"Auth header: {authHeader}");

        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring("Bearer ".Length).Trim();
            context.Token = token;
            Console.WriteLine($"Token extracted: {token}");
        }
        else
        {
            Console.WriteLine("No valid authorization header found");
        }

        return Task.CompletedTask;
    },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Failed to validate JWT Token: {context.Exception}");
            if (context.Exception is SecurityTokenInvalidIssuerException)
                Console.WriteLine("❌ Wrong Issuer! ");
            if (context.Exception is SecurityTokenInvalidAudienceException)
                Console.WriteLine("❌ Wrong Audience! ");
            if (context.Exception is SecurityTokenExpiredException)
                Console.WriteLine("❌ Token expired! ");
            if (context.Exception is SecurityTokenInvalidSignatureException)
                Console.WriteLine("❌ Wrong Signature! ");
            return Task.CompletedTask;
        },
    };
}
);

builder.Services.AddAuthorization();

builder.Services.AddScoped<AuthService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5108); // HTTP port
    // options.ListenAnyIP(7240, listenOptions => listenOptions.UseHttps()); // HTTPS port
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/test", () => "OK!")
    .RequireAuthorization();
app.Run();
