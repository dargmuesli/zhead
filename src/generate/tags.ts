import type { HeadInput } from '../schema'
import { HeadSchema } from '../schema'
import { resolveProps } from '../resolve'

export function generateTagsStrict<T extends HeadInput>(input: T) {
  // strips unused keys
  const parsed = HeadSchema.parse(input)
  return generateTags(parsed)
}

export function primitiveToTag(tag: string, v: string | object): HeadTag | undefined {
  if (typeof v === 'object') {
    if (Object.keys(v).length > 0)
      return ({ tag, props: resolveProps(v) })
  }
  else { return ({ tag, props: { children: v } }) }
}

export interface HeadTag {
  tag: string
  props: {
    body?: boolean
    [k: string]: any
  }
}

export function generateTags<T extends HeadInput>(input: T) {
  // strips unused keys
  const output: HeadTag[] = []
  for (const tag of Object.keys(input)) {
    // @ts-expect-error untyped
    const v = Array.isArray(input[tag]) ? input[tag] : [input[tag]]
    output.push(
      // @ts-expect-error untyped
      v.map(entry => primitiveToTag(tag, entry)).filter(v => !!v),
    )
  }
  return output.flat()
}
