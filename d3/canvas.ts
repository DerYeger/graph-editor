import * as d3 from 'd3'
import { terminate } from '~/d3/event'

export function createCanvas(
  host: d3.Selection<HTMLDivElement, undefined, HTMLElement, undefined>,
  zoom: d3.ZoomBehavior<SVGSVGElement, undefined>,
  onPointerMoved: (event: PointerEvent) => void,
  onPointerUp: (event: PointerEvent) => void,
  onDoubleClick: (event: PointerEvent) => void
): d3.Selection<SVGGElement, undefined, HTMLElement, undefined> {
  return host
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .on('pointermove', (event: PointerEvent) => onPointerMoved(event))
    .on('pointerup', (event: PointerEvent) => onPointerUp(event))
    .on('contextmenu', (event: MouseEvent) => terminate(event))
    .on('dblclick', (event) => onDoubleClick(event))
    .call(zoom)
    .append('g')
}
