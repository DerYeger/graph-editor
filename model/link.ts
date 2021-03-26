import { SimulationLinkDatum } from 'd3'
import { D3Node } from '~/model/node'

export interface D3Link extends SimulationLinkDatum<D3Node> {
  source: D3Node
  target: D3Node
  relations: Set<string>
  functions: Set<string>
}

export class Link implements D3Link {
  public readonly relations = new Set<string>()
  public readonly functions = new Set<string>()

  public constructor(
    public readonly source: D3Node,
    public readonly target: D3Node,
    initialRelations?: string[],
    initialFunctions?: string[]
  ) {
    initialRelations?.forEach((relation) => this.relations.add(relation))
    initialFunctions?.forEach((functions) => this.functions.add(functions))
  }
}
