/* eslint-disable react-refresh/only-export-components */
import { EditorProvider } from "@tiptap/react";
import MenuBar from "./menu-bar";
import { extensions } from "./extentions";

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

export default () => {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      editorProps={{
        attributes: {
          class:
            "prose prose-sm border max-h-[480px] p-4 rounded-lg overflow-y-auto sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        },
      }}
    ></EditorProvider>
  );
};
