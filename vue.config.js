// Whether the build target is a library
const isBuildLib = (process.env.npm_lifecycle_script || '').indexOf('--target lib') > 0

module.exports = {
  publicPath: '', // Relative path

  outputDir: isBuildLib ? 'dist/lib' : 'dist/docs/demo',

  // webpack chain configuration
  chainWebpack: config => {
    // Remove prefetch plugin
    config.plugins.delete('prefetch')
  },

  css: {
    loaderOptions: {
      sass: {
        // scss public variables
        prependData: isBuildLib ? undefined : `@use "src/assets/scss/variables.scss" as *;`
      }
    }
  }
}
