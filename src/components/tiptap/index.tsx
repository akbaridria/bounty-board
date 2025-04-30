/* eslint-disable react-refresh/only-export-components */
import { EditorProvider } from "@tiptap/react";
import MenuBar from "./menu-bar";
import { extensions } from "./extentions";
import { cn } from "@/lib/utils";

const content = `
<h2>
  Welcome to BountyBoard!
</h2>
<p>
  You can use simple <strong>Markdown</strong> to format your text. For example:
</p>
<ul>
  <li>
    Use <code>#</code> for headings.
  </li>
  <li>
    Use <code>-</code> or <code>*</code> for bullet lists.
  </li>
</ul>
<p>
  Try editing this content and see how it works!
</p>
<blockquote>
  "Markdown made simple and fun!"
</blockquote>
`;

const TipTapEditor: React.FC<{
  maxHeight?: number;
  customContent?: string;
  editable?: boolean;
}> = ({ maxHeight, customContent, editable = true }) => {
  return (
    <EditorProvider
      slotBefore={editable ? <MenuBar /> : undefined}
      extensions={extensions}
      content={customContent || content}
      editable={editable}
      editorProps={{
        attributes: {
          class: cn(
            "prose prose-sm rounded-lg overflow-y-auto sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
            editable ? "border p-4" : ""
          ),
          style: `max-height: ${maxHeight ? `${maxHeight}px` : "480px"}`,
        },
      }}
    ></EditorProvider>
  );
};

export default TipTapEditor;
