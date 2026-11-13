using System.Net.Http.Headers;
using AssignmentsService.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace AssignmentsService.Infrastructure.Clients;

/// <summary>
/// When AUTH_TOKEN is set, every service in the app requires it, so our calls
/// to employees-service and projects-service must carry it too.
/// </summary>
public sealed class ForwardAuthTokenHandler(IOptions<ServiceOptions> options) : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(options.Value.AuthToken))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", options.Value.AuthToken);
        }
        return base.SendAsync(request, cancellationToken);
    }
}
