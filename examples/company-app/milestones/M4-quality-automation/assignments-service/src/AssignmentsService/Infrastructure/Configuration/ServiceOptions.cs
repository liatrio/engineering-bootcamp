using System.ComponentModel.DataAnnotations;

namespace AssignmentsService.Infrastructure.Configuration;

/// <summary>
/// Every setting this service reads, bound from environment variables.
/// </summary>
/// <remarks>
/// Same pattern as employees-service: a typed object to inject instead of
/// string lookups, with <see cref="ConfigurationKeyNameAttribute"/> mapping the
/// SPEC's variable names onto C# property names. The connection string uses the
/// standard <c>ConnectionStrings__Default</c> key.
/// </remarks>
public sealed class ServiceOptions
{
    [Required(ErrorMessage = "RABBITMQ_URL must be set, for example amqp://guest:guest@localhost:5672/.")]
    [ConfigurationKeyName("RABBITMQ_URL")]
    public string RabbitMqUrl { get; init; } = "";

    /// <summary>Base URL of employees-service, for example http://employees-service:8080.</summary>
    [Required(ErrorMessage = "EMPLOYEES_URL must be set, for example http://localhost:5101.")]
    [Url]
    [ConfigurationKeyName("EMPLOYEES_URL")]
    public string EmployeesUrl { get; init; } = "";

    /// <summary>Base URL of projects-service, for example http://projects-service:8000.</summary>
    [Required(ErrorMessage = "PROJECTS_URL must be set, for example http://localhost:5102.")]
    [Url]
    [ConfigurationKeyName("PROJECTS_URL")]
    public string ProjectsUrl { get; init; } = "";

    /// <summary>
    /// When set, every /api/* request needs "Authorization: Bearer {token}",
    /// and this service sends the same token when it calls the others.
    /// </summary>
    [ConfigurationKeyName("AUTH_TOKEN")]
    public string? AuthToken { get; init; }
}
