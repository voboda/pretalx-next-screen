import { json } from '@sveltejs/kit';
import { version } from '$app/environment';

export async function GET() {
    return json({ version: `${version}` });
}
