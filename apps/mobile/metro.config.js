const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the entire monorepo
config.watchFolders = [monorepoRoot];

// Resolve modules from both the app and monorepo root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Tell Metro where to find the entrypoint's node_modules
config.resolver.disableHierarchicalLookup = false;

// Supabase dynamically imports @opentelemetry/api which doesn't exist in RN
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@opentelemetry/api') {
    return { type: 'empty' };
  }
  // On web, Metro picks zustand's ESM build, which contains Vite-only
  // `import.meta.env`. Metro serves the bundle as a classic script, so that
  // throws "Cannot use 'import.meta' outside a module" and the page stays
  // blank. Its CommonJS build is the same code without that guard — which is
  // already what native gets via zustand's "react-native" export condition.
  if (platform === 'web' && /^zustand(\/|$)/.test(moduleName)) {
    const sub = moduleName.replace(/^zustand\/?/, '');
    return {
      type: 'sourceFile',
      filePath: path.resolve(projectRoot, 'node_modules/zustand', sub ? `${sub}.js` : 'index.js'),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
