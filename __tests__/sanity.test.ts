import { schema } from './__mocks__/mock_data/schema'

describe('basic sanity test', () => {
    it('schema.DefaultsTest.modelName', () => {
      expect(
        schema.getModelLabel({
          modelName: 'DefaultsTest',
        })
      ).toBe('Defaults Test')
    })
})
