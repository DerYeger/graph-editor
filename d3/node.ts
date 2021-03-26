import * as d3 from 'd3'
import { Canvas } from '~/d3/canvas'
import { Node } from '~/model/node'

export type NodeSelection = d3.Selection<
  SVGGElement,
  Node,
  SVGGElement,
  undefined
>

export function createNode(canvas: Canvas): NodeSelection {
  return canvas.append('g').classed('nodes', true).selectAll('circle')
}
