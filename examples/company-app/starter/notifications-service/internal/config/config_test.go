package config

import "testing"

func env(m map[string]string) func(string) string {
	return func(k string) string { return m[k] }
}

func TestLoadDefaults(t *testing.T) {
	cfg, err := LoadFrom(env(map[string]string{"RABBITMQ_URL": "amqp://x"}))
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Port != 8080 || cfg.ServiceName != DefaultServiceName || cfg.AuthToken != "" {
		t.Fatalf("unexpected defaults: %+v", cfg)
	}
}

func TestLoadOverrides(t *testing.T) {
	cfg, err := LoadFrom(env(map[string]string{
		"RABBITMQ_URL": "amqp://x", "PORT": "9090", "AUTH_TOKEN": "s3cret", "OTEL_SERVICE_NAME": "n",
	}))
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Port != 9090 || cfg.AuthToken != "s3cret" || cfg.ServiceName != "n" {
		t.Fatalf("overrides not applied: %+v", cfg)
	}
}

func TestLoadErrors(t *testing.T) {
	for name, m := range map[string]map[string]string{
		"missing RABBITMQ_URL": {},
		"bad PORT":             {"RABBITMQ_URL": "amqp://x", "PORT": "eighty"},
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := LoadFrom(env(m)); err == nil {
				t.Fatal("expected an error")
			}
		})
	}
}
