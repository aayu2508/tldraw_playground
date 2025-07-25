import { MyCircleShapeUtil } from './MyCircleShape'
import 'tldraw/tldraw.css'
import { EditorEvents as TextEditorEvents } from '@tiptap/core'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import { EditorState as TextEditorState } from '@tiptap/pm/state'
import { useEffect, useState } from 'react'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import {
  DefaultRichTextToolbar,
  DefaultRichTextToolbarContent,
  TLTextOptions,
  defaultAddFontsFromNode,
  stopEventPropagation,
  tipTapDefaultExtensions,
  useEditor,
  useValue,
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TLUiOverrides,
  Tldraw,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
} from 'tldraw'
import { FontSize } from './FontSizeExtension'
import './RichTextFontExtension.css'
import { extensionFontFamilies } from './fonts'
import { MyCircleTool } from './MyCircleTool'

const fontOptions = [
  { label: 'Default', value: 'DEFAULT' },
  { label: 'Inter', value: 'Inter' },
  // { label: 'Comic Sans MS', value: 'Comic Sans MS' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Cursive', value: 'cursive' },
  { label: 'Exo 2', value: "'Exo 2'" },
]

const fontSizeOptions = [
  { label: '12', value: '12px' },
  { label: '16', value: '16px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '32', value: '28px' },
  { label: '40', value: '32px' },
]

const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools()
    const isCircleSelected = useIsToolSelected(tools['my-circle-tool'])
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem {...tools['my-circle-tool']} isSelected={isCircleSelected} />
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools()
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        <TldrawUiMenuItem {...tools['my-circle-tool']} />
      </DefaultKeyboardShortcutsDialog>
    )
  },
  RichTextToolbar: () => {
    const editor = useEditor()
    const textEditor = useValue('textEditor', () => editor.getRichTextEditor(), [editor])
    const [_, setTextEditorState] = useState<TextEditorState | null>(textEditor?.state ?? null)

    useEffect(() => {
      if (!textEditor) {
        setTextEditorState(null)
        return
      }

      const handleTransaction = ({ editor: textEditor }: TextEditorEvents['transaction']) => {
        setTextEditorState(textEditor.state)
      }

      textEditor.on('transaction', handleTransaction)
      return () => {
        textEditor.off('transaction', handleTransaction)
        setTextEditorState(null)
      }
    }, [textEditor])

    if (!textEditor) return null

    const currentFontFamily = textEditor?.getAttributes('textStyle').fontFamily ?? 'DEFAULT'
    const currentFontSize = textEditor?.getAttributes('textStyle').fontSize

    return (
      <DefaultRichTextToolbar>
        <select
          value={currentFontFamily}
          onPointerDown={stopEventPropagation}
          onChange={(e) => {
            textEditor?.chain().focus().setFontFamily(e.target.value).run()
          }}
        >
          {fontOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={currentFontSize}
          onPointerDown={stopEventPropagation}
          onChange={(e) => {
            textEditor?.chain().focus().setFontSize(e.target.value).run()
          }}
        >
          {fontSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className={`tlui-button ${textEditor.isActive('underline') ? 'tlui-button__active' : ''}`}
          onPointerDown={stopEventPropagation}
          onClick={() => textEditor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
        <button
          className={`tlui-button ${textEditor.isActive('strike') ? 'tlui-button__active' : ''}`}
          onPointerDown={stopEventPropagation}
          onClick={() => textEditor.chain().focus().toggleStrike().run()}
        >
          S
        </button>
        <DefaultRichTextToolbarContent textEditor={textEditor} />
      </DefaultRichTextToolbar>
    )
  },
}

const textOptions: Partial<TLTextOptions> = {
  tipTapConfig: {
    extensions: [...tipTapDefaultExtensions, FontFamily, FontSize, TextStyle, Underline, Strike],
  },
  addFontsFromNode(node, state, addFont) {
    state = defaultAddFontsFromNode(node, state, addFont)

    for (const mark of node.marks) {
      if (
        mark.type.name === 'textStyle' &&
        mark.attrs.fontFamily &&
        mark.attrs.fontFamily !== 'DEFAULT' &&
        mark.attrs.fontFamily !== state.family
      ) {
        state = { ...state, family: mark.attrs.fontFamily }
      }
    }

    const font = extensionFontFamilies[state.family]?.[state.style]?.[state.weight]
    if (font) addFont(font)

    return state
  },
}

const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    tools['my-circle-tool'] = {
      id: 'my-circle-tool',
      icon: 'circle-icon',
      label: 'Circle',
      kbd: 'c',
      onSelect: () => editor.setCurrentTool('my-circle-tool'),
    }
    return tools
  },
}

export default function App() {
  const fontFaces = Object.values(extensionFontFamilies)
    .map((fontFamily) => Object.values(fontFamily))
    .flat()
    .map((fontStyle) => Object.values(fontStyle))
    .flat()

  const exoFont = extensionFontFamilies["'Exo 2'"].normal.normal.src.url

  // const onMount = (editor: Editor) => {
  //   editor.fonts.requestFonts(fontFaces)
  // }

  return (
    <div className="tldraw__editor" style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        components={components}
        textOptions={textOptions}
        shapeUtils={[MyCircleShapeUtil]}
        tools={[MyCircleTool]}
        overrides={uiOverrides}
        assetUrls={{
          icons: {
            'circle-icon': 'circle.svg',
          },
          fonts: {
            tldraw_mono: exoFont,
          },
        }}
        // onMount={onMount}
      />
    </div>
  )
}
