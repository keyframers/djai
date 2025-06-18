import {
  forceSimulation,
  forceLink,
  forceCenter,
  forceManyBody,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';
import { TimelineGraph, TimelineNode } from '@/app/types';

export interface NodePosition extends SimulationNodeDatum {
  id: string;
  node: TimelineNode;
  x: number;
  y: number;
}

export interface LinkPosition extends SimulationLinkDatum<NodePosition> {
  id: string;
  source: NodePosition;
  target: NodePosition;
}

export interface ForceLayoutResult {
  nodes: NodePosition[];
  links: LinkPosition[];
  simulation: any; // d3 simulation instance
}

export interface LayoutOptions {
  width?: number;
  height?: number;
  linkDistance?: number;
  chargeStrength?: number;
  iterations?: number;
}

/**
 * Pure function that calculates force-directed layout positions for a graph
 * @param graph - The timeline graph to layout
 * @param options - Layout configuration options
 * @returns Array of nodes with calculated x,y positions
 */
export function calculateForceLayout(
  graph: TimelineGraph,
  options: LayoutOptions = {}
): NodePosition[] {
  const {
    width = 800,
    height = 600,
    linkDistance = 100,
    chargeStrength = -300,
    iterations = 300,
  } = options;

  if (graph.nodes.length === 0) {
    return [];
  }

  // Convert graph nodes to simulation nodes
  const nodes: NodePosition[] = graph.nodes.map((node) => ({
    id: node.id,
    node,
    x: Math.random() * width,
    y: Math.random() * height,
  }));

  // Convert graph edges to simulation links
  const links: LinkPosition[] = graph.edges.map((edge) => {
    const source = nodes.find((n) => n.id === edge.source)!;
    const target = nodes.find((n) => n.id === edge.target)!;
    return {
      id: edge.id,
      source,
      target,
    };
  });

  // Create the force simulation
  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links)
        .id((d: any) => d.id)
        .distance(linkDistance)
        .strength(0.5)
    )
    .force('charge', forceManyBody().strength(chargeStrength))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collision', forceCollide().radius(30))
    .stop(); // Don't start automatically

  // Run the simulation for the specified number of iterations
  for (let i = 0; i < iterations; i++) {
    simulation.tick();
  }

  return nodes;
}

// Keep the original functions for React component usage
export function createForceLayout(
  graph: TimelineGraph,
  width: number = 800,
  height: number = 600,
  onTick?: (nodes: NodePosition[], links: LinkPosition[]) => void
): ForceLayoutResult {
  // Convert graph nodes to simulation nodes
  const nodes: NodePosition[] = graph.nodes.map((node) => ({
    id: node.id,
    node,
    x: Math.random() * width,
    y: Math.random() * height,
  }));

  // Convert graph edges to simulation links
  const links: LinkPosition[] = graph.edges.map((edge) => {
    const source = nodes.find((n) => n.id === edge.source)!;
    const target = nodes.find((n) => n.id === edge.target)!;
    return {
      id: edge.id,
      source,
      target,
    };
  });

  // Create the force simulation
  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5)
    )
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collision', forceCollide().radius(30));

  // Set up tick callback
  if (onTick) {
    simulation.on('tick', () => {
      onTick(nodes, links);
    });
  }

  return {
    nodes,
    links,
    simulation,
  };
}

export function updateForceLayout(
  simulation: any,
  graph: TimelineGraph,
  existingNodes: NodePosition[],
  width: number = 800,
  height: number = 600
): { nodes: NodePosition[]; links: LinkPosition[] } {
  // Update nodes - keep existing positions for existing nodes, add new ones
  const nodes: NodePosition[] = graph.nodes.map((node) => {
    const existing = existingNodes.find((n) => n.id === node.id);
    if (existing) {
      return { ...existing, node };
    }
    return {
      id: node.id,
      node,
      x: Math.random() * width,
      y: Math.random() * height,
    };
  });

  // Update links
  const links: LinkPosition[] = graph.edges.map((edge) => {
    const source = nodes.find((n) => n.id === edge.source)!;
    const target = nodes.find((n) => n.id === edge.target)!;
    return {
      id: edge.id,
      source,
      target,
    };
  });

  // Update simulation
  simulation.nodes(nodes);
  simulation.force('link').links(links);
  simulation.alpha(0.3).restart();

  return { nodes, links };
}
