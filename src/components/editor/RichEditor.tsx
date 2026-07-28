import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks, Quote, Code2, Minus, Undo2, Redo2, Link as LinkIcon,
  Image as ImageIcon, Table as TableIcon, Highlighter, AlignLeft, AlignCenter, AlignRight,
  Maximize2, Minimize2, Palette,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string | null>;
  placeholder?: string;
}

const Btn = ({ active, onClick, title, children, disabled }: any) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-2 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
      active ? "bg-primary/20 text-primary" : "text-muted-foreground"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-white/10 mx-1" />;

function Toolbar({ editor, onUploadImage, onToggleFullscreen, fullscreen }: {
  editor: Editor; onUploadImage: (f: File) => Promise<string | null>;
  onToggleFullscreen: () => void; fullscreen: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  const addLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") return editor.chain().focus().extendMarkRange("link").unsetLink().run();
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  const addImage = async (file: File) => {
    const url = await onUploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-white/5 bg-black/20 sticky top-0 z-10">
      <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()}><Undo2 className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()}><Redo2 className="w-4 h-4" /></Btn>
      <Divider />
      <Btn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1"><Heading1 className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2"><Heading2 className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3"><Heading3 className="w-4 h-4" /></Btn>
      <Divider />
      <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight"><Highlighter className="w-4 h-4" /></Btn>
      <Btn onClick={() => colorRef.current?.click()} title="Text color"><Palette className="w-4 h-4" /></Btn>
      <input ref={colorRef} type="color" className="hidden" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
      <Divider />
      <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><List className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><ListOrdered className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()} title="Checklist"><ListChecks className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote"><Quote className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block"><Code2 className="w-4 h-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="w-4 h-4" /></Btn>
      <Divider />
      <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left"><AlignLeft className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center"><AlignCenter className="w-4 h-4" /></Btn>
      <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right"><AlignRight className="w-4 h-4" /></Btn>
      <Divider />
      <Btn active={editor.isActive("link")} onClick={addLink} title="Link"><LinkIcon className="w-4 h-4" /></Btn>
      <Btn onClick={() => fileRef.current?.click()} title="Insert image"><ImageIcon className="w-4 h-4" /></Btn>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) addImage(f); e.target.value = ""; }}
      />
      <Btn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert table"><TableIcon className="w-4 h-4" /></Btn>
      <Divider />
      <Btn onClick={onToggleFullscreen} title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
        {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Btn>
    </div>
  );
}

export default function RichEditor({ value, onChange, onUploadImage, placeholder }: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextStyle,
      Color,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-4 max-w-full h-auto" } }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-6 prose-headings:font-display prose-a:text-primary prose-code:text-secondary prose-code:before:hidden prose-code:after:hidden",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        const image = files.find((f) => f.type.startsWith("image/"));
        if (image) {
          event.preventDefault();
          onUploadImage(image).then((url) => {
            if (url && editor) editor.chain().focus().setImage({ src: url, alt: image.name }).run();
          });
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) editor.commands.setContent(value, false);
  }, [value, editor]);

  if (!editor) return <div className="p-6 text-sm text-muted-foreground">Loading editor…</div>;

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 bg-background overflow-auto" : ""}>
      <div className={`glass-card rounded-2xl overflow-hidden ${fullscreen ? "rounded-none min-h-screen" : ""}`}>
        <Toolbar editor={editor} onUploadImage={onUploadImage} onToggleFullscreen={() => setFullscreen((f) => !f)} fullscreen={fullscreen} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
