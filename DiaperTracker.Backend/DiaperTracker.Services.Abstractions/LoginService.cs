using DiaperTracker.Domain;

namespace DiaperTracker.Services.Abstractions;

public interface LoginService
{
    public Task<ExternalLoginPayload> ValidateAsync(string token);
}
