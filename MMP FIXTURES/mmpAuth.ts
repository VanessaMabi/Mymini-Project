import path from 'node:path';

/**
 * Session Supabase du compte USER_EMAIL1, générée par tests/auth.setup.ts.
 * Dossier ignoré par git (.gitignore : /playwright/.auth/).
 * Usage dans un spec : test.use({ storageState: STORAGE_STATE_USER1 });
 */
export const STORAGE_STATE_USER1 = path.join(__dirname, '..', 'playwright', '.auth', 'user1.json');
