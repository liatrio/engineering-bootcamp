const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# PostgreSQL goes down for two minutes. What should assignments-service's \`/healthz\` and \`/readyz\` report meanwhile?

- [x] \`/healthz\` 200 and \`/readyz\` 503
  > The process is fine, so it shouldn't be restarted. It just can't do its job, so the platform should stop routing traffic to it until the database is back.
- [ ] \`/healthz\` 503 and \`/readyz\` 503
  > A failing liveness check makes the platform restart the container, which doesn't bring the database back and can cause a restart loop.
- [ ] \`/healthz\` 503 and \`/readyz\` 200
  > This is backwards: the process is alive, and it can't serve requests that need the database.
- [ ] Both 200, since requests will fail with 500 anyway
  > Then the platform keeps sending traffic to an instance that can't serve it, and nobody sees why until users complain.

# A teammate deploys assignments-service with \`PROJECTS_URL\` missing. With \`ValidateOnStart()\` in place, when do they find out?

- [x] When the service starts, from a log line naming the variable
  > Startup validation turns a missing setting into an immediate, readable failure instead of an error deep inside a request.
- [ ] On the first request that calls projects-service, as a 500
  > That is what happens without startup validation: the failure waits until some request needs the value.
- [ ] At build time, because the compiler checks environment variables
  > The compiler can't see the environment the image will run in. Validation happens when the app starts.
- [ ] Never, because the options class falls back to localhost
  > The class has no default URL on purpose. A silent localhost default would hide the mistake in a container.

# Inside compose, assignments-service calls employees-service. Which base URL belongs in its \`EMPLOYEES_URL\`?

- [x] \`http://employees-service:8080\`
  > Containers reach each other by service name, on the port the container listens on.
- [ ] \`http://localhost:5101\`
  > Inside a container, localhost is the container itself. 5101 is the host port, for calls from your laptop.
- [ ] \`http://localhost:8080/api/employees\`
  > That is the proxy as seen from your laptop. A service calls its dependency directly, not through the browser's entry point.
- [ ] \`http://employees-service:5101\`
  > 5101 exists only on the host. The container itself listens on 8080.

# Why does the Company app leave URLs and credentials out of \`appsettings.json\`?

- [x] So one image runs anywhere, with only its environment changing
  > Values baked into the image would need a rebuild per environment, and secrets in the file end up in Git and in every image layer.
- [ ] Because ASP.NET Core ignores \`appsettings.json\` inside containers
  > ASP.NET Core reads it in every environment. The rule is a choice the app makes, not a limit of the framework.
- [ ] Because JSON files can't hold connection strings safely
  > The format isn't the problem. The problem is where the file lives: in the repository and the image.
- [ ] Because environment variables are faster to read at runtime
  > Configuration is read once at startup, so speed is irrelevant here.

# The template's \`launchSettings.json\` sets \`applicationUrl\`. Why remove it in assignments-service?

- [x] It overrides the listen port the app reads from \`PORT\`
  > \`dotnet run\` passes it as the URL to listen on, which takes precedence over the port setting in \`Program.cs\`.
- [ ] It makes the container listen on the wrong port in compose
  > The container never reads launch settings; they only apply to \`dotnet run\`. The problem is local runs drifting from every other environment.
- [ ] It turns on HTTPS, which the Dockerfile can't build
  > HTTPS is in the separate https profile. The Dockerfile doesn't use launch settings at all.
- [ ] It conflicts with the solution file created by \`dotnet new sln\`
  > The solution file only lists projects. It has nothing to do with listen URLs.
`;

export { rawQuizdown }
