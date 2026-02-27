import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode } from "@lexical/rich-text";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type EditorState,
  type LexicalEditor as LexicalEditorType,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const theme = {
  paragraph: "mb-1",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-4",
    ul: "list-disc ml-4",
    listitem: "ml-2",
  },
  heading: {
    h1: "text-2xl font-bold",
    h2: "text-xl font-bold",
    h3: "text-lg font-bold",
  },
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  return (
    <div className="flex gap-1 border-b p-1">
      <Button
        type="button"
        variant={isBold ? "default" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0 font-bold"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        B
      </Button>
      <Button
        type="button"
        variant={isItalic ? "default" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0 italic"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        I
      </Button>
      <Button
        type="button"
        variant={isUnderline ? "default" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0 underline"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        U
      </Button>
      <div className="mx-1 w-px bg-border" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        • List
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      >
        1. List
      </Button>
    </div>
  );
}

function LoadInitialStatePlugin({
  initialState,
}: {
  initialState?: string;
}) {
  const [editor] = useLexicalComposerContext();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (initialState && !loaded) {
      try {
        const parsed = JSON.parse(initialState);
        const editorState = editor.parseEditorState(parsed);
        editor.setEditorState(editorState);
        setLoaded(true);
      } catch {
        // Invalid state, ignore
      }
    }
  }, [editor, initialState, loaded]);

  return null;
}

interface LexicalEditorProps {
  onChange: (serializedState: string) => void;
  initialState?: string;
}

export default function LexicalEditor({
  onChange,
  initialState,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: "MeetingNotesEditor",
    theme,
    nodes: [ListNode, ListItemNode, HeadingNode],
    onError: (error: Error) => {
      console.error(error);
    },
  };

  const handleChange = (
    editorState: EditorState,
    _editor: LexicalEditorType,
  ) => {
    const json = editorState.toJSON();
    onChange(JSON.stringify(json));
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rounded-md border">
        <ToolbarPlugin />
        <div className="relative min-h-[200px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[200px] p-3 outline-none" />
            }
            ErrorBoundary={({ children }) => <>{children}</>}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={handleChange} />
        <LoadInitialStatePlugin initialState={initialState} />
      </div>
    </LexicalComposer>
  );
}
