import { TimelineNode, TimelineEdge } from '@/app/types';
import classNames from 'classnames';

import styles from './Timeline.module.css';
import ChatView from './ChatView';

interface TimelineProps {
  className?: string;
  nodes: TimelineNode[];
  edges: TimelineEdge[];
  currentNodeId: string;
  onNodeSelect: (nodeId: string) => void;
}

export function Timeline({
  className,
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
      <div key={node.id} className={styles.nodeContainer}>
        <button
          className={classNames(styles.timelineNode, {
            [styles.active]: isActive,
          })}
          onClick={() => onNodeSelect(node.id)}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          <span className={styles.nodeIcon}>
            {node.view === 'welcome' && '👋'}
            {node.view === 'explore' && '🔍'}
            {node.view === 'song' && '🎵'}
          </span>
          <span className={styles.nodeText}>
            {node.view === 'welcome' && 'Welcome'}
            {node.view === 'explore' && (node.prompt || 'Exploring')}
            {node.view === 'song' && (node.song.title || 'Playing')}
          </span>
        </button>
        <div className={styles.children}>
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
    <div className={classNames(styles.timeline, className)}>
      <ChatView />
      {rootNode && renderNode(rootNode)}
    </div>
  );
}
