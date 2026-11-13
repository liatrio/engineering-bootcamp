/**
 * Consumer contract: web → projects-service.
 *
 * Runs the real API functions from ./api against a Pact mock server and writes
 * pacts/web-projects-service.json. projects-service verifies that file against its provider
 * states ("projects exist" resets to the seed rows in SPEC.md).
 *
 * Covered: GET /api/projects, GET /api/projects/{id}, and POST /api/projects (the New
 * project form). Added in 3.4.6: the UI used POST, but no contract protected it.
 */
import path from 'node:path';
import { MatchersV3, PactV3 } from '@pact-foundation/pact';
import { setApiBaseUrl } from '../../lib/api';
import { createProject, getProject, listProjects } from './api';
import type { ProjectInput } from './types';

const { eachLike, like, regex, uuid } = MatchersV3;

const provider = new PactV3({
  consumer: 'web',
  provider: 'projects-service',
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'warn',
});

const PLATFORM_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const NEW_PROJECT_ID = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
// Any ISO-8601 UTC timestamp: .NET, Python, and Go format fractions and offsets differently.
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;

// Shape of one project as the UI reads it. Matchers check types and formats, not values,
// so the provider's real seed timestamps still satisfy the contract.
const projectShape = (id: string, name: string, status: string, startDate: string) => ({
  id: uuid(id),
  name: like(name),
  description: like(''),
  startDate: regex(/^\d{4}-\d{2}-\d{2}$/, startDate),
  status: regex(/^(planned|active|completed)$/, status),
  createdAt: regex(ISO_DATETIME, '2026-01-01T00:00:00Z'),
  updatedAt: regex(ISO_DATETIME, '2026-01-01T00:00:00Z'),
});

describe('projects-service contract', () => {
  it('GET /api/projects returns the list of projects', async () => {
    provider
      .given('projects exist')
      .uponReceiving('a request for all projects')
      .withRequest({
        method: 'GET',
        path: '/api/projects',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': regex(/application\/json/, 'application/json') },
        body: eachLike(projectShape(PLATFORM_ID, 'Platform Modernization', 'active', '2026-01-05')),
      });

    await provider.executeTest(async (mockServer) => {
      setApiBaseUrl(mockServer.url);
      const projects = await listProjects();
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0]).toMatchObject({ id: PLATFORM_ID, status: 'active' });
    });
  });

  it('GET /api/projects/{id} returns one project', async () => {
    provider
      .given('projects exist')
      .uponReceiving('a request for the Platform Modernization project')
      .withRequest({
        method: 'GET',
        path: `/api/projects/${PLATFORM_ID}`,
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': regex(/application\/json/, 'application/json') },
        body: projectShape(PLATFORM_ID, 'Platform Modernization', 'active', '2026-01-05'),
      });

    await provider.executeTest(async (mockServer) => {
      setApiBaseUrl(mockServer.url);
      const project = await getProject(PLATFORM_ID);
      expect(project).toMatchObject({ id: PLATFORM_ID, name: 'Platform Modernization' });
    });
  });

  it('POST /api/projects creates a project', async () => {
    // Exactly what the New project form sends. The name isn't in the seed data, so the
    // provider's "projects exist" state can't turn this into a 409.
    const newProject: ProjectInput = {
      name: 'Mobile App',
      description: 'Native app for field staff',
      startDate: '2026-04-01',
      status: 'planned',
    };

    provider
      .given('projects exist')
      .uponReceiving('a request to create a project')
      .withRequest({
        method: 'POST',
        path: '/api/projects',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: newProject,
      })
      .willRespondWith({
        // The UI reads only the body; it doesn't depend on the Location header.
        status: 201,
        headers: { 'Content-Type': regex(/application\/json/, 'application/json') },
        body: {
          // The provider generates the ID; uuid() matches any UUID, this one is only an example.
          ...projectShape(NEW_PROJECT_ID, newProject.name, newProject.status, newProject.startDate),
          name: newProject.name,
          description: newProject.description,
          startDate: newProject.startDate,
          status: newProject.status,
        },
      });

    await provider.executeTest(async (mockServer) => {
      setApiBaseUrl(mockServer.url);
      const project = await createProject(newProject);
      expect(project).toMatchObject(newProject);
    });
  });
});
