import esm from 'esm';
const { createRequire } = esm('module');
const require = createRequire(import.meta.url);
export default require;
