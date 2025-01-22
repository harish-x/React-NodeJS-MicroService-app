import * as fs from 'fs-extra';

fs.cpSync('src/emails', 'build/src/emails', { recursive: true });