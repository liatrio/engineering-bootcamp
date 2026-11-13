# Copied from employees-service; you'll write your own in Chapter 4.4.
# Only the project name changed.

# Build stage: the full SDK, used only to compile. None of it ships.
FROM mcr.microsoft.com/dotnet/sdk:10.0.404 AS build
WORKDIR /src

# Restore first, from the project file alone, so Docker can cache the
# downloaded packages until the package list itself changes.
COPY global.json ./
COPY src/AssignmentsService/AssignmentsService.csproj src/AssignmentsService/
RUN dotnet restore src/AssignmentsService/AssignmentsService.csproj

COPY src/AssignmentsService/ src/AssignmentsService/
RUN dotnet publish src/AssignmentsService/AssignmentsService.csproj \
    --configuration Release --no-restore --output /app

# Runtime stage: just the ASP.NET Core runtime and the published app.
FROM mcr.microsoft.com/dotnet/aspnet:10.0.15
WORKDIR /app
COPY --from=build /app ./

# The base image ships a non-root "app" user; $APP_UID is its numeric ID.
USER $APP_UID
ENV PORT=8080
EXPOSE 8080
# No HEALTHCHECK: compose and Kubernetes define their own probes against /healthz and /readyz.
ENTRYPOINT ["dotnet", "AssignmentsService.dll"]
