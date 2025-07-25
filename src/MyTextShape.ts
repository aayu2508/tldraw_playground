import { TLTextShape, TLTextShapeProps } from '@tldraw/tldraw'

export interface MyTextShapeProps extends TLTextShapeProps {
  label?: string
}

export type MyTextShape = Omit<TLTextShape, 'props'> & { props: MyTextShapeProps }
