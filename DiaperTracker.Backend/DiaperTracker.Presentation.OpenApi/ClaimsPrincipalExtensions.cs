using System.Security.Claims;

namespace DiaperTracker.Presentation.OpenApi;

internal static class ClaimsPrincipalExtensions
{
    public static string GetSubjectId(this ClaimsPrincipal principal)
    {
        return principal.FindFirst("sub")?.Value ?? "";
    }
}
