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

  public createLink(sourceId: number, targetId: number): Promise<D3Link> {
    const existingLink = this.links.find(
      (l) => l.source.id === sourceId && l.target.id === targetId
    )
    if (existingLink !== undefined) {
      return Promise.reject(existingLink)
    }

    const source = this.nodes.find((node) => node.id === sourceId)
    if (source === undefined) {
      return Promise.reject(sourceId)
    }

    const target = this.nodes.find((node) => node.id === targetId)
    if (target === undefined) {
      return Promise.reject(targetId)
    }

    const link = new Link(source, target)
    this.links.push(link)
    return Promise.resolve(link)
  }

  public removeNode(node: D3Node): Promise<[D3Node, D3Link[]]> {
    const nodeIndex = this.nodes.findIndex((n) => n.id === node.id)
    if (nodeIndex === -1) {
      return Promise.reject(node)
    }

    this.nodes.splice(nodeIndex, 1)
    const attachedLinks = this.links.filter(
      (link) => link.source.id === node.id || link.target.id === node.id
    )
    attachedLinks.forEach((link) => {
      const linkIndex = this.links.indexOf(link, 0)
      this.links.splice(linkIndex, 1)
    })

    return Promise.resolve([node, attachedLinks])
  }

  public removeLink(link: D3Link): Promise<D3Link> {
    const linkIndex = this.links.findIndex(
      (l) => l.source.id === link.source.id && l.target.id === link.target.id
    )
    if (linkIndex === -1) {
      return Promise.reject(link)
    }

    this.links.splice(linkIndex, 1)
    return Promise.resolve(link)
  }
}
