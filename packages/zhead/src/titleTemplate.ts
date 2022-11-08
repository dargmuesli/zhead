import type { HeadTag } from '@zhead/schema'

export const renderTitleTemplate = (
  template: string | ((title?: string) => string | null) | null,
  title?: string,
): string | null => {
  if (template == null)
    return title || null
  if (typeof template === 'function')
    return template(title)

  return template.replace('%s', title ?? '')
}

export function resolveTitleTemplateFromTags(tags: HeadTag[]) {
  const titleTemplateIdx = tags.findIndex(i => i.tag === 'titleTemplate')
  const titleIdx = tags.findIndex(i => i.tag === 'title')
  const title = tags[titleIdx].children
  if (titleIdx !== -1 && titleTemplateIdx !== -1) {
    const newTitle = renderTitleTemplate(
      tags[titleTemplateIdx].children!,
      title,
    )
    if (newTitle !== null) {
      tags[titleIdx].children = newTitle || title
    }
    else {
      // remove the title tag
      delete tags[titleIdx]
    }
  }
  // titleTemplate is set but title is not set, convert to a title
  else if (titleTemplateIdx !== -1) {
    const newTitle = renderTitleTemplate(
      tags[titleTemplateIdx].children!,
    )
    if (newTitle !== null) {
      tags[titleTemplateIdx].children = newTitle
      tags[titleTemplateIdx].tag = 'title'
    }
  }
  if (titleTemplateIdx !== -1) {
    // remove the titleTemplate tag
    delete tags[titleTemplateIdx]
  }

  return tags.filter(Boolean)
}
