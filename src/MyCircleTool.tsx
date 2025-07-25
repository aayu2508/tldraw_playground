import { StateNode, TLShapeId, createShapeId } from 'tldraw'

export class MyCircleTool extends StateNode {
  static override id = 'my-circle-tool'
  static icon = 'circle'
  static label = 'Circle'

  shapeId: TLShapeId | null = null

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  override onPointerDown() {
    const { currentPagePoint } = this.editor.inputs
    const shapeId = createShapeId()
    const defaultProps = this.editor.getShapeUtil('Circle').getDefaultProps()

    this.shapeId = shapeId

    this.editor.createShape({
      id: shapeId,
      type: 'Circle',
      x: currentPagePoint.x,
      y: currentPagePoint.y,
      props: {
        ...defaultProps,
        w: 1, // start tiny and grow with drag
        h: 1,
      },
    })
  }

  override onPointerMove() {
    if (!this.shapeId) return

    const shape = this.editor.getShape(this.shapeId)
    if (!shape) return

    const { originPagePoint, currentPagePoint } = this.editor.inputs
    const w = Math.max(1, currentPagePoint.x - originPagePoint.x)
    const h = Math.max(1, currentPagePoint.y - originPagePoint.y)

    this.editor.updateShape({
      id: shape.id,
      type: 'Circle',
      props: {
        ...shape.props,
        w,
        h,
      },
    })
  }

  override onPointerUp() {
    this.editor.setCurrentTool('select')
    this.shapeId = null
  }

  override onCancel() {
    // Cleanup in case user hits Escape mid-draw
    if (this.shapeId) {
      this.editor.deleteShape(this.shapeId)
      this.shapeId = null
    }
    this.editor.setCurrentTool('select')
  }
}
