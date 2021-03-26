import { SimulationLinkDatum } from 'd3'
import { D3Node } from '~/model/node'

export interface D3Link extends SimulationLinkDatum<D3Node> {
  source: D3Node
  target: D3Node
}

export class Link implements D3Link {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public readonly source: D3Node,
    public readonly target: D3Node
  ) {}
}
