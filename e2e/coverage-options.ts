import type { CoverageReportOptions } from 'monocart-coverage-reports';

// V8 coverage of the production build, mapped back to src/ with the build sourcemaps
export const coverageOptions: CoverageReportOptions = {
  name: 'Playwright E2E coverage',
  outputDir: './coverage',
  reports: ['v8', 'lcovonly', 'console-summary'],
  // bundles with a sourcemap only (bundler helper chunks have none)
  entryFilter: (entry) => entry.url.includes('/_app/immutable/') && !!entry.source?.includes('sourceMappingURL='),
  // the app code only, like the former nyc config (posts are mostly static markup)
  sourceFilter: {
    '**/node_modules/**': false,
    '**/src/posts/**': false,
    '**/src/**': true,
    '**/**': false,
  },
  sourcePath: (filePath) => filePath.replace(/^(\.\.\/)+/, ''),
};
