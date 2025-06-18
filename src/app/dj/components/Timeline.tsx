import { TimelineNode, TimelineEdge } from '../types';

interface TimelineProps {
  nodes: TimelineNode[];
  edges: TimelineEdge[];
  currentNodeId: string;
  onNodeSelect: (nodeId: string) => void;
}

export function Timeline({
  nodes,
  edges,
  currentNodeId,
  onNodeSelect,
}: TimelineProps) {
  // Helper function to get node children
  const getNodeChildren = (nodeId: string) => {
    return edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => nodes.find((node) => node.id === edge.target))
      .filter((node): node is TimelineNode => node !== undefined);
  };

  // Recursive component to render node and its children
  const renderNode = (node: TimelineNode, depth: number = 0) => {
    const children = getNodeChildren(node.id);
    const isActive = node.id === currentNodeId;

    return (
      <div key={node.id} className="node-container">
        <button
          className={`timeline-node ${isActive ? 'active' : ''}`}
          onClick={() => onNodeSelect(node.id)}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          <span className="node-icon">
            {node.view === 'welcome' && '👋'}
            {node.view === 'explore' && '🔍'}
            {node.view === 'song' && '🎵'}
          </span>
          <span className="node-text">
            {node.view === 'welcome' && 'Welcome'}
            {node.view === 'explore' && (node.prompt || 'Exploring')}
            {node.view === 'song' && (node.songId || 'Playing')}
          </span>
        </button>
        <div className="children">
          {children.map((child) => renderNode(child, depth + 1))}
        </div>
      </div>
    );
  };

  // Find root node (node with no incoming edges)
  const rootNode = nodes.find(
    (node) => !edges.some((edge) => edge.target === node.id)
  );

  return (
    <div className="timeline">
      <h3>Timeline</h3>
      {rootNode && renderNode(rootNode)}

      <style jsx>{`
        .timeline {
          padding: 1rem;
          border: 1px solid #333;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.2);
          overflow-y: auto;
          max-height: calc(100vh - 8rem);
        }
        h3 {
          margin: 0 0 1rem;
          font-size: 1.2rem;
          opacity: 0.8;
        }
        .node-container {
          margin-bottom: 0.5rem;
        }
        .timeline-node {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: calc(100% - var(--indent, 0px));
          padding: 0.75rem;
          text-align: left;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #333;
          border-radius: 6px;
          color: inherit;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        .timeline-node:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }
        .timeline-node.active {
          border-color: #666;
          background: rgba(255, 255, 255, 0.15);
        }
        .node-icon {
          font-size: 1.2rem;
          min-width: 1.5rem;
        }
        .node-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .children {
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
