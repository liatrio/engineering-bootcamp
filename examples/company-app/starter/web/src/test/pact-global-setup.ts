import { rmSync } from 'node:fs';
import path from 'node:path';

// Pact merges interactions into an existing file. Start each run from a clean file so a
// removed interaction doesn't linger in the committed contract.
export default function setup(): void {
  rmSync(path.resolve(process.cwd(), 'pacts', 'web-projects-service.json'), { force: true });
}
