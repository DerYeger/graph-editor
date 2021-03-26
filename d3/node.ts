import * as d3 from 'd3'
import { Node } from '~/model/node'

export function createNode(
  canvas: d3.Selection<SVGGElement, undefined, HTMLElement, undefined>
): d3.Selection<SVGGElement, Node, SVGGElement, undefined> {
  return canvas.append('g').classed('nodes', true).selectAll('circle')
}
