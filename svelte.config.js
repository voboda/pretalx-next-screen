import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x',
    }),
    version: {
      name: process.env.npm_package_version
    },
  }
};

export default config;
