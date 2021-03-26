import * as d3 from 'd3'

export function createDraggableLink(
  canvas: d3.Selection<SVGGElement, undefined, HTMLElement, undefined>
): d3.Selection<SVGPathElement, undefined, HTMLElement, undefined> {
  return canvas
    .append('path')
    .classed('link draggable hidden', true)
    .attr('d', 'M0,0L0,0')
}
