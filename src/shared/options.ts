import {
  CheckboxDefinition,
  CommonOptionType,
  DisabledCheck,
  Tag,
} from './types'

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

const soloSelected: DisabledCheck = (group) => !!group['solo']

const withName = (x: string) => ({ name: x })

export const checkboxes: Array<CheckboxDefinition> = [
  { name: 'Oyster', disabled: soloSelected },
  { name: 'Tayne', disabled: soloSelected },
  // "solo" is enabled only when nothing else is selected
  { name: 'solo', disabled: (group) => !!group['Oyster'] || !!group['Tayne'] },
]

// extras for checkboxes
export const radioButtons = [
  ['default', '4d3d3d3', 'smiling'].map(withName),
  ['default', 'nsfw'].map(withName),
].map((x, i) => ({ context: checkboxes[i].name, options: x }))
