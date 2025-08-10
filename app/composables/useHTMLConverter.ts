// composables/useHtmlConverter.ts

interface TextChild {
    type?: "text";
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  }
  
  interface LinkChild {
    type: "link";
    url: string;
    children: TextChild[];
  }
  
  type ParagraphChild = TextChild | LinkChild;
  
  interface ParagraphBlock {
    type: "paragraph";
    children: ParagraphChild[];
  }
  
  interface HeadingBlock {
    type: "heading";
    level: number;
    children: TextChild[];
  }
  
  interface ListBlock {
    type: "list";
    format: "unordered" | "ordered";
    children: {
      children: TextChild[];
    }[];
  }
  
  type RichTextBlock = ParagraphBlock | HeadingBlock | ListBlock;
  
  export function useHtmlConverter() {
    const convertToHTML = (data: RichTextBlock[], prepend?: string): string => {
      let html = "";
      let firstParagraph = true;
  
      if (Array.isArray(data)) {
        data.forEach((item) => {
          switch (item.type) {
            case "heading":
              if (item.children?.[0]?.text) {
                html += `<h${item.level} role="heading" aria-level="${item.level}">`;
                item.children.forEach((c) => {
                  if (c.bold) html += `<b>${c.text}</b>`;
                  else if (c.underline) html += `<u>${c.text}</u>`;
                  else if (c.italic) html += `<i>${c.text}</i>`;
                  else html += `${c.text}`;
                });
                html += `</h${item.level}>`;
              }
              break;
              
  
            case "paragraph":
              if (item.children?.[0]?.text) {
                html += `<p>`;
                if (firstParagraph && prepend !== undefined) {
                  html += `<b>${prepend}</b>`;
                  firstParagraph = false;
                }
                item.children.forEach((c) => {
                  if (c.type === "text") {
                    if (c.bold) html += `<b>${c.text}</b>`;
                    else if (c.underline) html += `<u>${c.text}</u>`;
                    else if (c.italic) html += `<i>${c.text}</i>`;
                    else html += `${c.text}`;
                  } else if (c.type === "link") {
                    html += `<a href="${c.url}">${c.children[0].text}</a>`;
                  }
                });
                html += `</p>`;
              }
              break;
  
            case "list":
              if (Array.isArray(item.children)) {
                const tag = item.format === "ordered" ? "ol" : "ul";
                html += `<${tag}>`;
                item.children.forEach((listItem) => {
                  if (listItem.children?.[0]?.text) {
                    html += `<li><span>`;
                    listItem.children.forEach((c) => {
                      if (c.bold) html += `<b>${c.text}</b>`;
                      else if (c.underline) html += `<u>${c.text}</u>`;
                      else if (c.italic) html += `<i>${c.text}</i>`;
                      else html += `${c.text}`;
                    });
                    html += `</span></li>`;
                  }
                });
                html += `</${tag}>`;
              }
              break;
          }
        });
      }
  
      return html;
    };
  
    const convertToText = (data: RichTextBlock[]): string => {
      let text = "";
      if (Array.isArray(data)) {
        data.forEach((item) => {
          item.children?.forEach((child: any) => {
            if (child.text) text += child.text + " ";
          });
        });
      }
      return text.trim();
    };
  
    return { convertToHTML, convertToText };
  }
  