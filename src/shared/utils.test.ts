import { getPathFromKey } from './utils'

describe('getPathFromKey', () => {
  it('works', () => {
    expect(getPathFromKey('foo')).toEqual(['foo'])
    expect(getPathFromKey('foo.bar')).toEqual(['foo', 'bar'])
    expect(getPathFromKey('foo[0].bar')).toEqual(['foo', 0, 'bar'])
    expect(getPathFromKey('foo[0].bar.baz')).toEqual(['foo', 0, 'bar', 'baz'])
  })
})
