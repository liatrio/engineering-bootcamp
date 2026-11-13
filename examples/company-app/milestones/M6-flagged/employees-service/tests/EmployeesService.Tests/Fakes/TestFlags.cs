using EmployeesService.Features.Employees;
using OpenFeature;
using OpenFeature.Providers.Memory;

namespace EmployeesService.Tests.Fakes;

/// <summary>
/// Feature flags for tests: OpenFeature's in-memory provider instead of flagd.
/// Flags start on; a test turns one off with SetAsync.
/// </summary>
public sealed class TestFlags
{
    private readonly Dictionary<string, bool> _state = new() { [EmployeeFlags.Events] = true };

    // A provider belongs to one OpenFeature API instance, and every app a test
    // boots has its own, so each gets its own provider and SetAsync updates all.
    private readonly List<InMemoryProvider> _providers = [];

    public InMemoryProvider NewProvider()
    {
        var provider = new InMemoryProvider(Build());
        lock (_providers)
        {
            _providers.Add(provider);
        }
        return provider;
    }

    public async Task SetAsync(string flag, bool on)
    {
        _state[flag] = on;
        List<InMemoryProvider> providers;
        lock (_providers)
        {
            providers = [.. _providers];
        }
        foreach (var provider in providers)
        {
            await provider.UpdateFlagsAsync(Build());
        }
    }

    /// <summary>A client on its own OpenFeature domain, so parallel tests never share flags.</summary>
    public async Task<IFeatureClient> CreateClientAsync()
    {
        var domain = Guid.NewGuid().ToString();
        await Api.Instance.SetProviderAsync(domain, NewProvider());
        return Api.Instance.GetClient(domain);
    }

    private Dictionary<string, Flag> Build() => _state.ToDictionary(
        kv => kv.Key,
        kv => (Flag)new Flag<bool>(new Dictionary<string, bool> { ["on"] = true, ["off"] = false }, kv.Value ? "on" : "off"));
}
