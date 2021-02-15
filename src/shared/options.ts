import { CommonOptionType, Tag } from './types'

const optionize = (x: string): CommonOptionType => ({
  label: x,
  value: x.replace(/\s/g, ''),
})

export const tagOptions: Array<Tag> = [
  'Flarhgunnstow',
  'Hat wobble',
  'Beta',
  'Coffee mug',
].map(optionize)

export const tayneOptions: Array<CommonOptionType> = Array.from({
  length: 200,
})
  .map((_, i) => `Tayne ${i}`)
  .map(optionize)
