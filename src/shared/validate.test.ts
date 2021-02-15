import { validate } from './validate'

const languages = ['fi', 'en']

describe('validate', () => {
  it('works for required', () => {
    const values = {}
    expect(validate({ languages })(values)).toEqual({
      number: 'required',
    })
  })

  it('complains about missing multi language field', () => {
    const values = { number: 1, name: { fi: 'asdf' } }
    expect(validate({ languages })(values)).toEqual({
      name: { fi: 'multilang' },
    })
  })

  it('passes if all multi language fields are filled', () => {
    const values = { number: 1, name: { fi: 'asdf', en: 'foo' } }
    expect(validate({ languages })(values)).toEqual({})
  })

  it('works for array field', () => {
    const values = {
      number: 1,
      table: [
        { number: '1', name: { fi: 'asdf', en: 'foo' } },
        { number: 'asdf', name: { fi: 'partial' } },
      ],
    }
    expect(validate({ languages })(values)).toEqual({
      table: [undefined, { number: 'nan', name: { fi: 'multilang' } }],
    })
  })
})
