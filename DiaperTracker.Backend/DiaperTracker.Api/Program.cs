using DiaperTracker.Api.Configurations;
using System.Text.Json.Serialization;
using DiaperTracker.Persistence;
using DiaperTracker.Presentation.OpenApi;
using DiaperTracker.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Duende.IdentityServer;
using DiaperTracker.Api;
using DiaperTracker.Authentication;
using DiaperTracker.Authentication.Google;
using DiaperTracker.Email.Sendgrid;
using DiaperTracker.Domain;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
// Add services to the container.
builder.Services.Configure<GoogleOptions>(x =>
{
    builder.Configuration.GetSection("Authentication:Google").Bind(x);
});

builder.Services.Configure<SendgridOptions>(x =>
{
    builder.Configuration.GetSection("Email:Sendgrid").Bind(x);
});

builder.Services.Configure<InviteOptions>(x =>
{
    builder.Configuration.GetSection("Email:Invite").Bind(x);
});

builder.Services
    .AddHttpClient()
    .AddServices()
    .AddSocialLoginServices()
    .AddEmailServices()
    .AddRepositories(builder.Configuration.GetConnectionString("Database"))
    .AddExceptionMappings(builder.Environment.IsDevelopment())
    .AddIdentity();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<HttpResponseExceptionFilter>();
})
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    })
    .AddApplicationPart(typeof(DiaperTracker.Presentation.OpenApi.AssemblyReference).Assembly);

# region configure Swagger

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(config =>
{
    config.CustomOperationIds(e => e.ActionDescriptor.RouteValues["action"]);
    config.UseOneOfForPolymorphism();

    config.SelectDiscriminatorNameUsing(baseType => "TypeName");
    config.SelectDiscriminatorValueUsing(subType => subType.Name);

    var controllersXmlFilename = $"{typeof(DiaperTracker.Presentation.OpenApi.AssemblyReference).Assembly.GetName().Name}.xml";
    var contractsXmlFilename = $"{typeof(DiaperTracker.Contracts.AssemblyReference).Assembly.GetName().Name}.xml";

    config.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, controllersXmlFilename));
    config.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, contractsXmlFilename));
    config.SupportNonNullableReferenceTypes();
});

#endregion

# region cookie configration

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.MinimumSameSitePolicy = builder.Environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict;

});

builder.Services.Configure<CookieAuthenticationOptions>(IdentityServerConstants.DefaultCheckSessionCookieName, options =>
{
    options.Cookie.SameSite = builder.Environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict;
    options.ExpireTimeSpan = TimeSpan.FromDays(1);
});


builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = builder.Environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict;
    options.ExpireTimeSpan = TimeSpan.FromDays(1);
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
});

builder.Services.ConfigureExternalCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromDays(1);
    options.Cookie.SameSite = builder.Environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict;
});

# endregion

var app = builder.Build();

// add middleware
app.UseHttpsRedirection()
    .UseRouting()
    .UseAuthentication()
    .UseIdentityServer()
    .UseAuthorization();

Console.WriteLine($"Starting in environemnt: {app.Environment.EnvironmentName}");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();

    app.UseCors(c =>
    {
        c.WithOrigins(new string[] { "https://localhost:3000" });
        c.AllowAnyMethod();
        c.AllowAnyHeader();
        c.AllowCredentials();
    });

    app.UseExceptionHandler("/error-development");
}
else
{
    var options = new DefaultFilesOptions();
    options.DefaultFileNames.Clear();
    options.DefaultFileNames.Add("index.html");
    app.UseDefaultFiles(options);
    app.UseStaticFiles();
    app.UseExceptionHandler("/error");
}

using (var scope = app.Services.CreateScope())
{
    await scope.ServiceProvider.AddDatabaseMigrations();
    if (app.Environment.IsDevelopment())
    {
        await scope.ServiceProvider.AddDatabaseTestData();
    }
}

app.MapControllers();
app.Run();
