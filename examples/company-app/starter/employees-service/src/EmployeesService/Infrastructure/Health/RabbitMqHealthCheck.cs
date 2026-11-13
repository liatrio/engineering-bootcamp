using EmployeesService.Infrastructure.Messaging;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace EmployeesService.Infrastructure.Health;

/// <summary>Ready only when the shared RabbitMQ connection is (or can be) opened.</summary>
public sealed class RabbitMqHealthCheck(RabbitMqConnection rabbit) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await rabbit.EnsureConnectedAsync(cancellationToken);
            return HealthCheckResult.Healthy();
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("RabbitMQ is unreachable", ex);
        }
    }
}
