// composables/useHtmlConverter.ts

interface TextChild {
  type: "text"
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

interface LinkChild {
  type: "link"
  url: string
  children: TextChild[]
}

type ParagraphChild = TextChild | LinkChild

interface ParagraphBlock {
  type: "paragraph"
  children: ParagraphChild[]
}

interface HeadingBlock {
  type: "heading"
  level: number
  children: TextChild[]
}

interface ListItem {
  type: "list-item"
  children: ParagraphChild[]
}

interface ListBlock {
  type: "list"
  format: "unordered" | "ordered"
  children: ListItem[]
}

type RichTextBlock = ParagraphBlock | HeadingBlock | ListBlock

export function useHtmlConverter() {
  const convertToHTML = (data: RichTextBlock[], prepend?: string, insertAdPlaceholder: boolean = false): string => {
    let html = ""
    let firstParagraph = true
    
    if (Array.isArray(data)) {
      // Bestimme die Position für den Werbeplatz (vor dem viertletzten Element)
      const adPosition = insertAdPlaceholder && data.length >= 6 ? data.length - 6 : -1
      
      data.forEach((item, index) => {
        // Füge Werbeplatz vor dem viertletzten Element ein
        if (index === adPosition) {
          html += `<div class="adPlaceholder" data-ad-position="middle"></div>`
        }
        
        switch (item.type) {
          case "heading":
            if (item.children?.[0]?.text) {
              html += `<h${item.level} role="heading" aria-level="${item.level}">`
              item.children.forEach((c) => {
                if (c.bold) html += `<b>${c.text}</b>`
                else if (c.underline) html += `<u>${c.text}</u>`
                else if (c.italic) html += `<i>${c.text}</i>`
                else html += `${c.text}`
              })
              html += `</h${item.level}>`
            }
            break
           
          case "paragraph":
            if (item.children?.[0]?.text) {
              html += `<p>`
              if (firstParagraph && prepend !== undefined) {
                html += `<b>${prepend}</b>`
                firstParagraph = false
              }
              item.children.forEach((c) => {
                if (c.type === "text") {
                  if (c.bold) html += `<b>${c.text}</b>`
                  else if (c.underline) html += `<u>${c.text}</u>`
                  else if (c.italic) html += `<i>${c.text}</i>`
                  else html += `${c.text}`
                } else if (c.type === "link") {
                  if (c.children?.[0]?.text) {
                    html += `<a href="${c.url}">${c.children[0].text}</a>`
                  }
                }
              })
              html += `</p>`
            }
            break
           
          case "list":
            if (Array.isArray(item.children)) {
              const tag = item.format === "ordered" ? "ol" : "ul"
              html += `<${tag}>`
              item.children.forEach((listItem) => {
                if (listItem.children?.[0]?.text) {
                  html += `<li><span>`
                  listItem.children.forEach((c) => {
                    if (c.type === "text") {
                      if (c.bold) html += `<b>${c.text}</b>`
                      else if (c.underline) html += `<u>${c.text}</u>`
                      else if (c.italic) html += `<i>${c.text}</i>`
                      else html += `${c.text}`
                    } else if (c.type === "link") {
                      if (c.children?.[0]?.text) {
                        html += `<a href="${c.url}">${c.children[0].text}</a>`
                      }
                    }
                  })
                  html += `</span></li>`
                }
              })
              html += `</${tag}>`
            }
            break
        }
      })
    }
    
    return html
  }
  
  const convertToText = (data: RichTextBlock[]): string => {
    let text = ""
    if (Array.isArray(data)) {
      data.forEach((item) => {
        item.children?.forEach((child) => {
          if ("text" in child && child.text) text += child.text + " "
        })
      })
    }
    return text.trim()
  }
  
  return { convertToHTML, convertToText }
}