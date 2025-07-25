import { TextShapeUtil, defaultShapeUtils } from '@tldraw/tldraw'

const CustomTextShapeUtil = TextShapeUtil.configure({
  component(shape, utils) {
    const { x = 0, y = 0, text = '', label = '' } = shape.props as any // 'label' is custom

    return (
      <g>
        {/* Custom label rendering */}
        {label && (
          <text x={x} y={y - 16} fontSize={12} fill="#888">
            {label}
          </text>
        )}
        {/* Default text rendering */}
        {utils.defaultComponent()}
      </g>
    )
  },
  
  getDefaultProps() {
    return {
      ...TextShapeUtil.defaultProps,
      label: '', // add your custom field
    }
  }
})