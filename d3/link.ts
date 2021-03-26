import * as d3 from 'd3'
import { Link } from '~/model/link'

export function createLink(
  canvas: d3.Selection<SVGGElement, undefined, HTMLElement, undefined>
): d3.Selection<SVGGElement, Link, SVGGElement, undefined> {
  return canvas.append('g').classed('links', true).selectAll('path')
}
