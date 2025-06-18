import { TimelineNode, TimelineEdge } from '@/app/types';
import classNames from 'classnames';

import styles from './Timeline.module.css';
import { useMemo } from 'react';
import { calculateForceLayout } from './forceLayout';
import { appStore } from '@/app/store';
import { useSelector } from '@xstate/store/react';

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
  const graph = useSelector(appStore, (state) => state.context.graph);

  const nodePositions = useMemo(() => {
    return calculateForceLayout(graph, {
      width: 600,
      height: 400,
      linkDistance: 80,
      chargeStrength: -200,
    });
  }, [graph]);

  // Helper function to get node icon
  const getNodeIcon = (view: string) => {
    switch (view) {
      case 'welcome':
        return '👋';
      case 'explore':
        return '🔍';
      case 'song':
        return '🎵';
      default:
        return '•';
    }
  };

  // Helper function to get node text
  const getNodeText = (node: TimelineNode) => {
    switch (node.view) {
      case 'welcome':
        return 'Welcome';
      case 'explore':
        return node.prompt || 'Exploring';
      case 'song':
        return node.song?.title || 'Playing';
      default:
        return 'Node';
    }
  };

  return (
    <div className={classNames(styles.timeline, className)}>
      <svg width="600" height="400" viewBox="0 0 600 400">
        {/* Render edges first (so they appear behind nodes) */}
        {edges.map((edge) => {
          const sourcePos = nodePositions.find((pos) => pos.id === edge.source);
          const targetPos = nodePositions.find((pos) => pos.id === edge.target);

          if (!sourcePos || !targetPos) return null;

          return (
            <line
              key={edge.id}
              x1={sourcePos.x}
              y1={sourcePos.y}
              x2={targetPos.x}
              y2={targetPos.y}
              stroke="#333"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        })}

        {/* Render nodes */}
        {nodePositions.map((nodePos) => {
          const isActive = nodePos.node.id === currentNodeId;
          const nodeRadius = 25;

          return (
            <g key={nodePos.id}>
              {/* Node circle */}
              <circle
                cx={nodePos.x}
                cy={nodePos.y}
                r={nodeRadius}
                fill={
                  isActive
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)'
                }
                stroke={isActive ? '#666' : '#333'}
                strokeWidth="2"
                className={styles.svgNode}
                onClick={() => onNodeSelect(nodePos.node.id)}
                style={{ cursor: 'pointer' }}
              />

              {/* Node icon */}
              <text
                x={nodePos.x}
                y={nodePos.y + 5}
                textAnchor="middle"
                fontSize="16"
                fill="white"
                pointerEvents="none"
              >
                {getNodeIcon(nodePos.node.view)}
              </text>

              {/* Node label */}
              <text
                x={nodePos.x}
                y={nodePos.y + nodeRadius + 15}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                opacity="0.8"
                pointerEvents="none"
                style={{ maxWidth: '100px' }}
              >
                {getNodeText(nodePos.node)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
