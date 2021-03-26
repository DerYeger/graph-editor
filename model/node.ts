import { SimulationNodeDatum } from 'd3'

export interface D3Node extends SimulationNodeDatum {
  id: number
  x?: number
  y?: number
  fx?: number
  fy?: number
}

export class Node implements D3Node {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public readonly id: number,
    public x?: number,
    public y?: number,
    public fx?: number,
    public fy?: number
  ) {}
}
