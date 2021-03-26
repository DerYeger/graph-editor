import * as d3 from 'd3'
import { Canvas } from '~/d3/canvas'
import { Link } from '~/model/link'

export type LinkSelection = d3.Selection<
  SVGGElement,
  Link,
  SVGGElement,
  undefined
>

export function createLink(canvas: Canvas): LinkSelection {
  return canvas.append('g').classed('links', true).selectAll('path')
}
