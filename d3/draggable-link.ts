import * as d3 from 'd3'
import { Canvas } from '~/d3/canvas'

export type DraggableLink = d3.Selection<
  SVGPathElement,
  undefined,
  HTMLElement,
  undefined
>

export function createDraggableLink(canvas: Canvas): DraggableLink {
  return canvas
    .append('path')
    .classed('link draggable hidden', true)
    .attr('d', 'M0,0L0,0')
}
