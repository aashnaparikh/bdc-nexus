// babel.config.cjs — CommonJS format required so Jest (CJS) can load this config
// Vite uses native ESM; Jest needs Babel to transpile JSX and ESM imports
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
}
