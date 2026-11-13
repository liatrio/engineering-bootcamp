## What and why

<!-- What changes, and the problem it solves. Link the issue: "Closes #123". -->

## How to check it

<!-- Steps a reviewer can follow: commands, URLs, requests, or screenshots. -->

## Checklist

- [ ] Tests cover the change (new rules written test-first), and `dotnet test` / `uv run pytest` / `npm test` pass locally
- [ ] `openapi.yaml` is updated if an endpoint or JSON shape changed
- [ ] Pact files are regenerated and committed if a client's expectations changed
- [ ] `AGENTS.md` and the service README are updated if a convention, command, or setting changed
- [ ] No secrets, connection strings, or personal data in code, config, or logs
- [ ] Database changes come with an EF Core migration (or Alembic revision)

## Notes for the reviewer

<!-- Anything you want a second opinion on, or that you deliberately left out. -->
