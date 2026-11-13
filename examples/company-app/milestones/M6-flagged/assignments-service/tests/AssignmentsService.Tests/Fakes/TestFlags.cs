using AssignmentsService.Features.Assignments;
using OpenFeature;
using OpenFeature.Providers.Memory;

namespace AssignmentsService.Tests.Fakes;

/// <summary>
/// Feature flags for tests: OpenFeature's InMemoryProvider instead of flagd.
/// Every flag starts on, so tests exercise the full behaviour unless they turn
/// something off. The code under test still goes through IFeatureClient, so
/// the evaluation path is the real one.
/// </summary>
public sealed class TestFlags
{
    private readonly Dictionary<string, bool> _state = new()
    {
        [AssignmentFlags.Writes] = true,
        [AssignmentFlags.Notifications] = true,
        [AssignmentFlags.AllocationCheck] = true,
    };

    // An OpenFeature provider belongs to one API instance, and every app a
    // test boots has its own. So each gets its own provider, and SetAsync
    // updates them all.
    private readonly List<InMemoryProvider> _providers = [];

    /// <summary>The targeting key the last allocation-check evaluation was given.</summary>
    public string? LastTargetingKey { get; private set; }

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

    /// <summary>
    /// A client bound to this provider. Each TestFlags gets its own OpenFeature
    /// domain, so tests running in parallel never see each other's flags.
    /// </summary>
    public async Task<IFeatureClient> CreateClientAsync()
    {
        var domain = Guid.NewGuid().ToString();
        await Api.Instance.SetProviderAsync(domain, NewProvider());
        return Api.Instance.GetClient(domain);
    }

    private Dictionary<string, Flag> Build() => _state.ToDictionary(
        kv => kv.Key,
        kv => (Flag)new Flag<bool>(
            new Dictionary<string, bool> { ["on"] = true, ["off"] = false },
            defaultVariant: kv.Value ? "on" : "off",
            contextEvaluator: ctx =>
            {
                if (kv.Key == AssignmentFlags.AllocationCheck)
                {
                    LastTargetingKey = ctx.TargetingKey;
                }
                return kv.Value ? "on" : "off";
            }));
}
