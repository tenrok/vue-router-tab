// Whether the build target is a library
const isBuildLib = process.env.VUE_CLI_BUILD_TARGET === 'lib'

module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: isBuildLib ? false : 'usage'
      }
    ]
  ]
}
