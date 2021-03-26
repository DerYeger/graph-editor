import * as d3 from 'd3'
import { D3DragEvent } from 'd3'
import { terminate } from '~/d3/event'
import { Simulation } from '~/d3/simulation'
import { Node } from '~/model/node'

export type Drag = d3.DragBehavior<SVGGElement, Node, Node>

export function createDrag(simulation: Simulation): Drag {
  return d3
    .drag<SVGGElement, Node, Node>()
    .filter((event) => event.button === 1)
    .on(
      'start',
      (event: D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
        terminate(event.sourceEvent)
        if (event.active === 0) {
          simulation!.alphaTarget(0.5).restart()
        }
        d.fx = d.x
        d.fy = d.y
      }
    )
    .on('drag', (event: D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
      d.fx = event.x
      d.fy = event.y
    })
    .on('end', (event: D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
      if (event.active === 0) {
        simulation!.alphaTarget(0)
      }
      d.fx = undefined
      d.fy = undefined
    })
}
