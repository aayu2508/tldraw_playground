import {
	HTMLContainer,
	RecordProps,
	ShapeUtil,
	T,
	TLBaseShape,
	TLResizeInfo,
	Geometry2d,
	Ellipse2d,
	resizeBox,
} from '@tldraw/tldraw'

export type MyCircleShapeType = TLBaseShape<
	'Circle',
	{
		w: number
		h: number
		fill: string
		stroke: string
		strokeWidth: number
	}
>

export class MyCircleShapeUtil extends ShapeUtil<MyCircleShapeType> {
	static override type = 'Circle' as const

	static override props: RecordProps<MyCircleShapeType> = {
		w: T.number,
		h: T.number,
		fill: T.string,
		stroke: T.string,
		strokeWidth: T.number,
	}

	getDefaultProps(): MyCircleShapeType['props'] {
		return {
			w: 150,
			h: 150,
			fill: '#9C5656',
			stroke: '#F5CCCC',
			strokeWidth: 10,
		}
	}

	override canEdit() {
		return true
	}

	override canResize() {
		return true
	}

	override isAspectRatioLocked() {
		return true
	}

	getGeometry(shape: MyCircleShapeType): Geometry2d {
		return new Ellipse2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	override onResize(shape: MyCircleShapeType, info: TLResizeInfo<MyCircleShapeType>) {
		return resizeBox(shape, info)
	}

	component(shape: MyCircleShapeType) {
		const { id, props } = shape
		const { w, h, fill, stroke, strokeWidth } = props

		return (
			<HTMLContainer>
				<div
					style={{
						position: 'absolute',
						top: -20,
						left: 0, 
						fontSize: '12px',
						color: 'black',
						fontFamily: 'Atkinson Hyperlegible',
						pointerEvents: 'none', 
					}}
				>
					{shape.type}
				</div>
				<svg width={w} height={h}>
					<ellipse
						cx={w / 2}
						cy={h / 2}
						rx={Math.max(0, w / 2 - strokeWidth / 2)}
						ry={Math.max(0, h / 2 - strokeWidth / 2)}
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</svg>
			</HTMLContainer>
		)
	}

	indicator(shape: MyCircleShapeType) {
		const { w, h } = shape.props
		return (
			<ellipse
				cx={w / 2}
				cy={h / 2}
				rx={w / 2}
				ry={h / 2}
			/>
		)
	}
}

export const myCircleShapeUtils = [MyCircleShapeUtil]
