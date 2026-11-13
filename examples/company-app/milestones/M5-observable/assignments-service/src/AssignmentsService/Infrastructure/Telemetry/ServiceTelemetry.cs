using System.Diagnostics;
using System.Diagnostics.Metrics;

namespace AssignmentsService.Infrastructure.Telemetry;

/// <summary>
/// The service's own ActivitySource (for manual spans) and Meter (for custom
/// metrics). OpenTelemetry only exports sources and meters it was told about,
/// so TelemetryExtensions registers both by <see cref="Name"/>.
/// </summary>
public static class ServiceTelemetry
{
    public const string Name = "AssignmentsService";

    public static readonly ActivitySource ActivitySource = new(Name);
    public static readonly Meter Meter = new(Name);
}
