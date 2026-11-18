using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Configuration;

namespace EmployeesService.Infrastructure.Configuration;

/// <summary>
/// Every setting this service reads, bound from environment variables.
/// </summary>
/// <remarks>
/// The options pattern gives the rest of the code a typed object to inject
/// (<c>IOptions&lt;ServiceOptions&gt;</c>) instead of string lookups scattered
/// around. <see cref="ConfigurationKeyNameAttribute"/> maps the SPEC's
/// SCREAMING_CASE variable names onto idiomatic C# property names.
/// The database connection string is the exception: it uses the standard
/// <c>ConnectionStrings__Default</c> key, which EF Core tooling understands.
/// </remarks>
public sealed class ServiceOptions
{
    [Required(ErrorMessage = "RABBITMQ_URL must be set, for example amqp://guest:guest@localhost:5672/.")]
    [ConfigurationKeyName("RABBITMQ_URL")]
    public string RabbitMqUrl { get; init; } = "";

    /// <summary>Insert the seed employees on startup when the table is empty.</summary>
    [ConfigurationKeyName("SEED_DATA")]
    public bool SeedData { get; init; } = true;

    /// <summary>Expose POST /_pact/provider-states for Pact provider verification.</summary>
    [ConfigurationKeyName("ENABLE_PROVIDER_STATES")]
    public bool EnableProviderStates { get; init; }

    /// <summary>When set, every /api/* request needs "Authorization: Bearer {token}".</summary>
    [ConfigurationKeyName("AUTH_TOKEN")]
    public string? AuthToken { get; init; }
}
