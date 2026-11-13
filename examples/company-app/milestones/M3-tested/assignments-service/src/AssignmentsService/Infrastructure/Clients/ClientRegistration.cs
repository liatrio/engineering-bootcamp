using AssignmentsService.Infrastructure.Configuration;
using Microsoft.Extensions.Http.Resilience;
using Microsoft.Extensions.Options;

namespace AssignmentsService.Infrastructure.Clients;

public static class ClientRegistration
{
    /// <summary>
    /// Typed HttpClients for the services we call. IHttpClientFactory owns the
    /// connections (no socket exhaustion, DNS changes are picked up), and the
    /// standard resilience handler wraps every call in a timeout, retries with
    /// backoff for transient failures, and a circuit breaker.
    /// </summary>
    public static IServiceCollection AddDependencyClients(this IServiceCollection services)
    {
        services.AddTransient<ForwardAuthTokenHandler>();

        services.AddHttpClient<IEmployeesClient, EmployeesClient>((sp, http) =>
                http.BaseAddress = new Uri(sp.GetRequiredService<IOptions<ServiceOptions>>().Value.EmployeesUrl))
            .AddHttpMessageHandler<ForwardAuthTokenHandler>()
            .AddStandardResilienceHandler(ConfigureResilience);

        services.AddHttpClient<IProjectsClient, ProjectsClient>((sp, http) =>
                http.BaseAddress = new Uri(sp.GetRequiredService<IOptions<ServiceOptions>>().Value.ProjectsUrl))
            .AddHttpMessageHandler<ForwardAuthTokenHandler>()
            .AddStandardResilienceHandler(ConfigureResilience);

        return services;
    }

    // The defaults allow up to 30 seconds per request. A user waiting on a form
    // should hear "try again" much sooner than that, so keep the budget small:
    // each attempt gets 2 seconds, and the whole call, retries included, 5.
    private static void ConfigureResilience(HttpStandardResilienceOptions options)
    {
        options.AttemptTimeout.Timeout = TimeSpan.FromSeconds(2);
        options.TotalRequestTimeout.Timeout = TimeSpan.FromSeconds(5);
        options.Retry.MaxRetryAttempts = 2;
        options.Retry.Delay = TimeSpan.FromMilliseconds(200);
    }
}
