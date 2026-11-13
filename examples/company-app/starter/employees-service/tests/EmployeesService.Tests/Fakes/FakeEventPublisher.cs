using EmployeesService.Infrastructure.Messaging;

namespace EmployeesService.Tests.Fakes;

/// <summary>Records published events instead of sending them anywhere.</summary>
public sealed class FakeEventPublisher : IEventPublisher
{
    private readonly List<(string Type, object Data)> _published = [];

    public IReadOnlyList<(string Type, object Data)> Published
    {
        get { lock (_published) { return [.. _published]; } }
    }

    public Task PublishAsync(string type, object data, CancellationToken ct)
    {
        lock (_published)
        {
            _published.Add((type, data));
        }
        return Task.CompletedTask;
    }
}
