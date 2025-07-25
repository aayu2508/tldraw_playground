import { StateNode, TLTextShape, toRichText } from 'tldraw'

const OFFSET = 12

class CustomTextTool extends StateNode {
  static override id = 'custom-text'  // Unique ID for the tool
  static icon = 'Z' // Make sure to set an icon for the toolbar

  // When the tool is activated, set the cursor to crosshair
  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  // Handle pointer down event to create a text shape
  override onPointerDown() {
    const { currentPagePoint } = this.editor.inputs
    const richText = toRichText('Hello, World!')

    // Add multiple sections with different fonts and sizes
    // richText.addText('This is ', { font: 'Arial', size: 20 })
    // richText.addText('multi-font', { font: 'Courier', size: 24 })
    // richText.addText(' and multi-size text.', { font: 'Verdana', size: 18 })

    // Create the new text shape on the canvas at the clicked position
    this.editor.createShape<TLTextShape>({
      type: 'text',
      x: currentPagePoint.x - OFFSET,
      y: currentPagePoint.y - OFFSET,
      props: { richText },
    })
  }
}

export default CustomTextTool

// import { StateNode, TLTextShape, toRichText } from 'tldraw'
// import 'tldraw/tldraw.css'

// // There's a guide at the bottom of this file!

// const OFFSET = 12

// // [1]
// class StickerTool extends StateNode {
// 	static override id = 'sticker'

// 	// [a]
// 	override onEnter() {
// 		this.editor.setCursor({ type: 'cross', rotation: 0 })
// 	}

// 	// [b]
// 	override onPointerDown() {
// 		const { currentPagePoint } = this.editor.inputs
// 		this.editor.createShape<TLTextShape>({
// 			type: 'text',
// 			x: currentPagePoint.x - OFFSET,
// 			y: currentPagePoint.y - OFFSET,
// 			props: { richText: toRichText('❤️') },
// 		})
// 	}
// }

// export default StickerTool