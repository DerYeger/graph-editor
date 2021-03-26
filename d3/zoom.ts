import * as d3 from 'd3'
import { D3ZoomEvent } from 'd3'

export type Zoom = d3.ZoomBehavior<SVGSVGElement, undefined>

export function createZoom(
  onZoom: (event: D3ZoomEvent<any, any>) => void
): Zoom {
  return d3
    .zoom<SVGSVGElement, undefined>()
    .scaleExtent([0.1, 10])
    .filter((event) => event.button === 0 || event.touches?.length >= 2)
    .on('zoom', (event) => onZoom(event))
}
