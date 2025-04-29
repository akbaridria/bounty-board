"use client";

import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";
import { CornerDownLeft, ExternalLink, LinkIcon, Trash } from "lucide-react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Lib ---
import { isMarkInSchema } from "@/lib/tiptap-utils";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface LinkHandlerProps {
  editor: Editor | null;
  onSetLink?: () => void;
  onLinkActive?: () => void;
}

export interface LinkMainProps {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  setLink: () => void;
  removeLink: () => void;
  isActive: boolean;
}

export const useLinkHandler = (props: LinkHandlerProps) => {
  const { editor, onSetLink, onLinkActive } = props;
  const [url, setUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (!editor) return;

    // Get URL immediately on mount
    const { href } = editor.getAttributes("link");

    if (editor.isActive("link") && !url) {
      setUrl(href || "");
      onLinkActive?.();
    }
  }, [editor, onLinkActive, url]);

  React.useEffect(() => {
    if (!editor) return;

    const updateLinkState = () => {
      const { href } = editor.getAttributes("link");
      setUrl(href || "");

      if (editor.isActive("link") && !url) {
        onLinkActive?.();
      }
    };

    editor.on("selectionUpdate", updateLinkState);
    return () => {
      editor.off("selectionUpdate", updateLinkState);
    };
  }, [editor, onLinkActive, url]);

  const setLink = React.useCallback(() => {
    if (!url || !editor) return;

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .insertContent({
        type: "text",
        text: text || url,
        marks: [{ type: "link", attrs: { href: url } }],
      })
      .run();

    onSetLink?.();
  }, [editor, onSetLink, url]);

  const removeLink = React.useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .unsetMark("link", { extendEmptyMarkRange: true })
      .setMeta("preventAutolink", true)
      .run();
    setUrl("");
  }, [editor]);

  return {
    url,
    setUrl,
    setLink,
    removeLink,
    isActive: editor?.isActive("link") || false,
  };
};

export const LinkButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    tooltip?: string;
  }
>(({ className, children, tooltip, ...props }, ref) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      ref={ref}
      title={tooltip || "Link"}
      aria-label="Link"
      tabIndex={-1}
      {...props}
    >
      {children || <LinkIcon className="h-4 w-4" />}
    </Button>
  );
});

LinkButton.displayName = "LinkButton";

export const LinkContent: React.FC<{
  editor?: Editor | null;
}> = ({ editor: providedEditor }) => {
  const editor = useTiptapEditor(providedEditor);

  const linkHandler = useLinkHandler({
    editor: editor,
  });

  return <LinkMain {...linkHandler} />;
};

const LinkMain: React.FC<LinkMainProps> = ({
  url,
  setUrl,
  setLink,
  removeLink,
  isActive,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setLink();
    }
  };

  return (
    <div className="flex gap-2 -p-2">
      <Input
        type="url"
        placeholder="Paste a link..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="flex h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          onClick={setLink}
          title="Apply link"
          disabled={!url && !isActive}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <CornerDownLeft className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-2 h-4" />

        <div className="flex items-center gap-1">
          <Button
            type="button"
            onClick={() => window.open(url, "_blank")}
            title="Open in new window"
            disabled={!url && !isActive}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            onClick={removeLink}
            title="Remove link"
            disabled={!url && !isActive}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export interface LinkPopoverProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The TipTap editor instance.
   */
  editor?: Editor | null;
  /**
   * Whether to hide the link popover.
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback for when the popover opens or closes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether to automatically open the popover when a link is active.
   * @default true
   */
  autoOpenOnLinkActive?: boolean;
}

export function LinkPopover({
  editor: providedEditor,
  hideWhenUnavailable = false,
  onOpenChange,
  autoOpenOnLinkActive = true,
  className,
  ...props
}: LinkPopoverProps) {
  const editor = useTiptapEditor(providedEditor);

  const linkInSchema = isMarkInSchema("link", editor);

  const [isOpen, setIsOpen] = React.useState(false);

  const onSetLink = () => {
    setIsOpen(false);
  };

  const onLinkActive = () => setIsOpen(autoOpenOnLinkActive);

  const linkHandler = useLinkHandler({
    editor: editor,
    onSetLink,
    onLinkActive,
  });

  const isDisabled = React.useMemo(() => {
    if (!editor) return true;
    if (editor.isActive("codeBlock")) return true;
    return !editor.can().setLink?.({ href: "" });
  }, [editor]);

  const canSetLink = React.useMemo(() => {
    if (!editor) return false;
    try {
      return editor.can().setMark("link");
    } catch {
      return false;
    }
  }, [editor]);

  const isActive = editor?.isActive("link") ?? false;

  const handleOnOpenChange = React.useCallback(
    (nextIsOpen: boolean) => {
      setIsOpen(nextIsOpen);
      onOpenChange?.(nextIsOpen);
    },
    [onOpenChange]
  );

  const show = React.useMemo(() => {
    if (!linkInSchema) {
      return false;
    }

    if (hideWhenUnavailable) {
      if (isNodeSelection(editor?.state.selection) || !canSetLink) {
        return false;
      }
    }

    return true;
  }, [linkInSchema, hideWhenUnavailable, editor, canSetLink]);

  if (!show || !editor || !editor.isEditable) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <LinkButton
              disabled={isDisabled}
              className={cn(
                isActive ? "bg-accent text-accent-foreground" : "",
                className
              )}
              data-state={isActive ? "active" : "inactive"}
              {...props}
            />
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>Link</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-84 p-2" align="center">
        <LinkMain {...linkHandler} />
      </PopoverContent>
    </Popover>
  );
}
