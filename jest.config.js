module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/?!@autoinvent/conveyor-schema'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
}
