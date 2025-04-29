import { useCurrentEditor } from "@tiptap/react";
import { Button } from "../ui/button";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  RedoIcon,
  SquareCodeIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { LinkPopover } from "./link-popover";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="border rounded-lg p-1 flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled={!editor.can().chain().focus().undo().run()}
              onClick={() => editor.chain().focus().undo().run()}
              className="w-8 h-8"
              size="icon"
              type="button"
            >
              <UndoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled={!editor.can().chain().focus().redo().run()}
              onClick={() => editor.chain().focus().redo().run()}
              className="w-8 h-8"
              size="icon"
              type="button"
            >
              <RedoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("bold") ? "default" : "ghost"}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="w-8 h-8"
              size="icon"
              type="button"
            >
              <BoldIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("italic") ? "default" : "ghost"}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="w-8 h-8"
              size="icon"
              type="button"
            >
              <ItalicIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("underline") ? "default" : "ghost"}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="w-8 h-8"
              size="icon"
              type="button"
            >
              <UnderlineIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-6" />
        <LinkPopover className="w-8 h-8" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("codeBlock") ? "default" : "ghost"}
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="w-8 h-8"
              size="icon"
              type="button"
            >
              <SquareCodeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Code Block</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("code") ? "default" : "ghost"}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              onClick={() => editor.chain().focus().toggleCode().run()}
              className="w-8 h-8"
              size="icon"
              type="button"
            >
              <CodeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Code</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default MenuBar;
