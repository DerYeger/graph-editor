import { D3Link, Link } from '~/model/link'
import { D3Node, Node } from '~/model/node'

export default class Graph {
  private idCounter = 0
  public readonly nodes: D3Node[] = []
  public readonly links: D3Link[] = []

  public unlockNodes(): void {
    this.nodes.forEach((node) => {
      node.fx = undefined
      node.fy = undefined
    })
  }

  public createNode(x?: number, y?: number): D3Node {
    const node = new Node(this.idCounter++, x, y)
    this.nodes.push(node)
    return node
  }

  public createLink(sourceId: number, targetId: number): D3Link | undefined {
    const existingLink = this.links.find(
      (l) => l.source.id === sourceId && l.target.id === targetId
    )
    if (existingLink !== undefined) {
      return undefined
    }

    const source = this.nodes.find((node) => node.id === sourceId)
    if (source === undefined) {
      return undefined
    }

    const target = this.nodes.find((node) => node.id === targetId)
    if (target === undefined) {
      return undefined
    }

    const link = new Link(source, target)
    this.links.push(link)
    return link
  }

  public removeNode(node: D3Node): [D3Node, D3Link[]] | undefined {
    const nodeIndex = this.nodes.findIndex((n) => n.id === node.id)
    if (nodeIndex === -1) {
      return undefined
    }

    this.nodes.splice(nodeIndex, 1)
    const attachedLinks = this.links.filter(
      (link) => link.source.id === node.id || link.target.id === node.id
    )
    attachedLinks.forEach((link) => {
      const linkIndex = this.links.indexOf(link, 0)
      this.links.splice(linkIndex, 1)
    })

    return [node, attachedLinks]
  }

  public removeLink(link: D3Link): D3Link | undefined {
    const linkIndex = this.links.findIndex(
      (l) => l.source.id === link.source.id && l.target.id === link.target.id
    )
    if (linkIndex === -1) {
      return undefined
    }

    this.links.splice(linkIndex, 1)
    return link
  }
}
