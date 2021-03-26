<template>
  <div width="100%" height="100%">
    <div class="graph-host" width="100%" height="100%"></div>
    <div class="button-container">
      <repo-link />
      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon
          v-text="$vuetify.theme.dark ? 'mdi-brightness-5' : 'mdi-brightness-2'"
        />
      </v-btn>
      <v-btn icon @click="deleteGraph()">
        <v-icon v-text="'mdi-delete'" />
      </v-btn>
      <v-btn icon @click="resetGraph()">
        <v-icon v-text="'mdi-image-filter-center-focus'" />
      </v-btn>
      <v-btn icon @click="createNode()">
        <v-icon v-text="'mdi-plus'" />
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import * as d3 from 'd3'
import { D3ZoomEvent } from 'd3'
import Vue from 'vue'
import { createCanvas } from '~/d3/canvas'
import { createDrag } from '~/d3/drag'
import { createDraggableLink } from '~/d3/draggable-link'
import { terminate } from '~/d3/event'
import { createLink } from '~/d3/link'
import { initMarkers } from '~/d3/markers'
import { createNode } from '~/d3/node'
import {
  linePath,
  paddedArcPath,
  paddedLinePath,
  paddedReflexivePath,
} from '~/d3/paths'
import { createSimulation } from '~/d3/simulation'
import { createZoom } from '~/d3/zoom'
import { defaultGraphConfig, GraphConfiguration } from '~/model/config'
import Graph from '~/model/graph'
import { Link } from '~/model/link'
import { Node } from '~/model/node'

interface Data {
  graph: Graph
  width: number
  height: number
  simulation: any
  zoom?: d3.ZoomBehavior<SVGSVGElement, undefined>
  drag?: d3.DragBehavior<SVGGElement, Node, Node>
  canvas?: d3.Selection<SVGGElement, undefined, HTMLElement, undefined>
  link?: d3.Selection<SVGGElement, Link, SVGGElement, undefined>
  node?: d3.Selection<SVGGElement, Node, SVGGElement, undefined>
  draggableLink?: d3.Selection<
    SVGPathElement,
    undefined,
    HTMLElement,
    undefined
  >
  draggableLinkSourceNode?: Node
  draggableLinkTargetNode?: Node
  draggableLinkEnd?: [number, number]
  xOffset: number
  yOffset: number
  scale: number
  config: GraphConfiguration
}

export default Vue.extend({
  data(): Data {
    return {
      graph: new Graph(),
      width: 400,
      height: 400,
      simulation: undefined,
      zoom: undefined,
      drag: undefined,
      canvas: undefined,
      draggableLink: undefined,
      draggableLinkSourceNode: undefined,
      draggableLinkTargetNode: undefined,
      draggableLinkEnd: undefined,
      xOffset: 0,
      yOffset: 0,
      scale: 1,
      config: defaultGraphConfig,
    }
  },
  computed: {
    graphHost() {
      return d3.select<HTMLDivElement, undefined>('.graph-host')
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.width = this.graphHost.node()!.clientWidth
      this.height = this.graphHost.node()!.clientHeight
      this.zoom = createZoom((event: D3ZoomEvent<any, any>) =>
        this.onZoom(event)
      )
      this.canvas = createCanvas(
        this.graphHost,
        this.zoom,
        (event) => this.onPointerMoved(event),
        (event) => this.onPointerUp(event),
        (event) => {
          this.createNode(
            d3.pointer(event, this.canvas!.node())[0],
            d3.pointer(event, this.canvas!.node())[1]
          )
        }
      )
      initMarkers(this.canvas, this.config)
      this.draggableLink = createDraggableLink(this.canvas)
      this.link = createLink(this.canvas)
      this.node = createNode(this.canvas)
      this.simulation = createSimulation(
        this.graph,
        this.config,
        this.width,
        this.height,
        () => this.onTick()
      )
      this.drag = createDrag(this.simulation)
      this.restart()
    },
    onZoom(event: D3ZoomEvent<any, any>): void {
      this.xOffset = event.transform.x
      this.yOffset = event.transform.y
      this.scale = event.transform.k
      this.canvas!.attr(
        'transform',
        `translate(${this.xOffset},${this.yOffset})scale(${this.scale})`
      )
    },
    async createLink(source: Node, target: Node): Promise<void> {
      await this.graph!.createLink(source.id, target.id)
      this.restart()
    },
    createNode(x?: number, y?: number): void {
      this.graph.createNode(x ?? this.width / 2, y ?? this.height / 2)
      this.restart()
    },
    onTick(): void {
      this.node!.attr('transform', (d) => `translate(${d.x},${d.y})`)

      this.link!.selectAll<SVGPathElement, Link>('path').attr(
        'd',
        (d: Link) => {
          if (d.source.id === d.target.id) {
            return paddedReflexivePath(
              d.source,
              [this.width / 2, this.height / 2],
              this.config
            )
          } else if (this.isBidirectional(d.source, d.target)) {
            return paddedArcPath(d.source, d.target, this.config)
          } else {
            return paddedLinePath(d.source, d.target, this.config)
          }
        }
      )
      this.updateDraggableLinkPath()
    },
    isBidirectional(source: Node, target: Node): boolean {
      return (
        source.id !== target.id &&
        this.graph!.links.some(
          (l) => l.target.id === source.id && l.source.id === target.id
        ) &&
        this.graph!.links.some(
          (l) => l.target.id === target.id && l.source.id === source.id
        )
      )
    },
    updateDraggableLinkPath(): void {
      const source = this.draggableLinkSourceNode
      if (source !== undefined) {
        const target = this.draggableLinkTargetNode
        if (target !== undefined) {
          this.draggableLink!.attr('d', () => {
            if (source.id === target.id) {
              return paddedReflexivePath(
                source,
                [this.width / 2, this.height / 2],
                this.config
              )
            } else if (this.isBidirectional(source, target)) {
              return paddedLinePath(source, target, this.config)
            } else {
              return paddedArcPath(source, target, this.config)
            }
          })
        } else if (this.draggableLinkEnd !== undefined) {
          const from: [number, number] = [source.x!, source.y!]
          this.draggableLink!.attr('d', linePath(from, this.draggableLinkEnd))
        }
      }
    },
    restart(alpha: number = 0.5): void {
      this.link = this.link!.data(
        this.graph!.links,
        (d: Link) => `${d.source.id}-${d.target.id}`
      ).join((enter) => {
        const linkGroup = enter.append('g')
        linkGroup
          .append('path')
          .classed('link', true)
          .style('marker-end', 'url(#link-arrow')
        linkGroup
          .append('path')
          .classed('clickbox', true)
          .on('contextmenu', (event: MouseEvent, d: Link) => {
            terminate(event)
            this.graph.removeLink(d)
            this.restart()
          })
        return linkGroup
      })

      this.node = this.node!.data(this.graph!.nodes, (d) => d.id).join(
        (enter) => {
          const nodeGroup = enter
            .append('g')
            .call(this.drag!)
            .on('contextmenu', (event: MouseEvent, d: Node) => {
              terminate(event)
              this.graph.removeNode(d)
              this.resetDraggableLink()
              this.restart()
            })
          nodeGroup
            .append('circle')
            .classed('node', true)
            .attr('r', this.config.nodeRadius)
            .on(
              'mouseenter',
              (_, d: Node) => (this.draggableLinkTargetNode = d)
            )
            .on('mouseout', () => (this.draggableLinkTargetNode = undefined))
            .on('pointerdown', (event: PointerEvent, d: Node) => {
              this.onPointerDown(event, d)
            })
            .on('pointerup', (event: PointerEvent) => {
              this.onPointerUp(event)
            })
          return nodeGroup
        }
      )

      this.simulation!.nodes(this.graph!.nodes)
      this.simulation!.alpha(alpha).restart()
    },
    onPointerDown(event: PointerEvent, node: Node) {
      if (event.button !== 0) {
        return
      }
      terminate(event)
      const coordinates: [number, number] = [node.x!, node.y!]
      this.draggableLinkEnd = coordinates
      this.draggableLinkSourceNode = node
      this.draggableLink!.style('marker-end', 'url(#link-arrow')
        .classed('hidden', false)
        .attr('d', linePath(coordinates, coordinates))
      this.restart()
    },
    onPointerUp(event: PointerEvent): void {
      const source = this.draggableLinkSourceNode
      const target = this.draggableLinkTargetNode
      this.resetDraggableLink()
      if (source === undefined || target === undefined) {
        return
      }
      terminate(event)
      this.createLink(source, target)
    },
    onPointerMoved(event: PointerEvent): void {
      terminate(event)
      if (this.draggableLinkSourceNode !== undefined) {
        const pointer = d3.pointers(event, this.graphHost.node())[0]
        const point: [number, number] = [
          (pointer[0] - this.xOffset) / this.scale,
          (pointer[1] - this.yOffset) / this.scale,
        ]
        if (event.pointerType === 'touch') {
          point[1] = point[1] - 4 * this.config.nodeRadius
          // PointerEvents are not firing correctly for touch input.
          // So for TouchEvents, we have to manually detect Nodes within range and set them as the current target node.
          this.draggableLinkTargetNode = this.graph!.nodes.find(
            (node) =>
              Math.sqrt(
                Math.pow(node.x! - point[0], 2) +
                  Math.pow(node.y! - point[1], 2)
              ) < this.config.nodeRadius
          )
        }
        this.draggableLinkEnd = point
        this.updateDraggableLinkPath()
      }
    },
    resetDraggableLink(): void {
      this.draggableLink?.classed('hidden', true).style('marker-end', '')
      this.draggableLinkSourceNode = undefined
      this.draggableLinkTargetNode = undefined
      this.draggableLinkEnd = undefined
    },
    resetGraph(): void {
      this.simulation!.stop()
      this.graphHost.selectChildren().remove()
      this.zoom = undefined
      this.xOffset = 0
      this.yOffset = 0
      this.scale = 1
      this.canvas = undefined
      this.draggableLink = undefined
      this.link = undefined
      this.node = undefined
      this.simulation = undefined
      this.resetDraggableLink()
      this.init()
    },
    deleteGraph(): void {
      this.graph = new Graph()
      this.resetGraph()
    },
  },
})
</script>

<style lang="scss">
.graph-host {
  width: 100%;
  height: 100%;
  touch-action: none;
}

.create-node-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}

.link {
  stroke: orange;
  stroke-width: 4px;
  fill: none;

  &.hidden {
    stroke-width: 0;
  }

  &.draggable {
    stroke: orangered;
    stroke-dasharray: 8px 2px;
    pointer-events: none;
  }
}

.clickbox {
  stroke: rgba($color: #000, $alpha: 0);
  stroke-width: 16px;
  fill: none;
  cursor: pointer;
}

.arrow {
  fill: orange;
}

.node {
  fill: #007aff;
  stroke: none;
  cursor: pointer;
}

.button-container {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

*:not(input):not(.selectable) {
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  -khtml-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
</style>
