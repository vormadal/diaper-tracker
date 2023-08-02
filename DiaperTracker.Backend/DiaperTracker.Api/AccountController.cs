using Duende.IdentityServer.Extensions;
using DiaperTracker.Contracts;
using DiaperTracker.Services.Abstractions;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using DiaperTracker.Persistence;
using Duende.IdentityServer.Services;
using Duende.IdentityServer.Stores;

namespace DiaperTracker.Api;

public class ExternalLoginRequest
{
    public string Token { get; set; }
}

[ApiController]
[Route("api/identity")]
[Produces("application/json")]
[Consumes("application/json")]
public class AccountController : ControllerBase
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IServiceProvider _serviceProvider;

    public AccountController(
        SignInManager<ApplicationUser> signInManager, 
        UserManager<ApplicationUser> userManager, 
        IServiceProvider serviceProvider)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _serviceProvider = serviceProvider;
    }

    [HttpGet("me")]
    public async Task<UserProfile> Me()
    {
        var isSignedIn = _signInManager.IsSignedIn(User);
        if (isSignedIn)
        {
            var user = await _userManager.FindByIdAsync(User.Identity.GetSubjectId());
            
            var profile = user.Adapt<UserProfile>();
            profile.IsLoggedIn = true;
            profile.Idp = User.Identity.GetIdentityProvider();
            return profile;
        }

        return new UserProfile
        {
            IsLoggedIn = false
        };
    }

    [HttpPost("{provider}/signin")]

    public async Task<ActionResult> ExternalLogin([FromRoute] string provider, [FromBody] ExternalLoginRequest content)
    {
        var loginServices = _serviceProvider.GetServices<LoginService>();

        var loginService = loginServices.FirstOrDefault(x => x.Name == provider);

        if(loginService == null)
        {
            throw new Exception($"No login service for {provider}");
        }

        var payload = await loginService.ValidateAsync(content.Token);
        var user = await _userManager.FindByLoginAsync(provider, payload.Id);
        if (user == null)
        {
            user = await _userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                user = payload.Adapt<ApplicationUser>();
                user.EmailConfirmed = true;
                user.UserName = user.Email;

                var idResult = await _userManager.CreateAsync(user);
                if (!idResult.Succeeded)
                {
                    throw new AuthenticationException(idResult.Errors);
                }
            }
            else
            {
                throw new AuthenticationException("The user already exists with another login provider");
            }

            var res = await _userManager.AddLoginAsync(user, new UserLoginInfo(provider, user.Id, payload.FullName));
            if (!res.Succeeded)
            {
                throw new AuthenticationException(res.Errors);
            }
        }

        var result = await _signInManager.ExternalLoginSignInAsync(provider, payload.Id, false);

        if (result.Succeeded)
        {
            payload.Adapt(user);
            await _userManager.UpdateAsync(user);
            return Ok(payload);
        }

        throw new AuthenticationException(result.ToString());
    }

    [HttpPost("signout")]
    public async Task<ActionResult> Signout()
    {
        await _signInManager.SignOutAsync();

        return Ok();
    }


}

public class AuthenticationException : Exception
{
    public AuthenticationException(IEnumerable<IdentityError> errors) : base(string.Join("\n", errors.Select(x => x.Description)))
    {

    }

    public AuthenticationException(string message) : base(message) { }
}
