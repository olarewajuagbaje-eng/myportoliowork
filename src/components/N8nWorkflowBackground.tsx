import { useEffect, useRef, useCallback } from 'react';

interface WorkflowNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'webhook' | 'gmail' | 'code' | 'ai' | 'sheets';
  size: number;
  rotation: number;
  pulsePhase: number;
}

interface Connection {
  from: number;
  to: number;
  progress: number;
  speed: number;
}

const N8nWorkflowBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<WorkflowNode[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const nodeTypes = ['webhook', 'gmail', 'code', 'ai', 'sheets'] as const;
  
  const nodeColors: Record<typeof nodeTypes[number], string> = {
    webhook: 'hsl(263, 70%, 66%)',
    gmail: 'hsl(0, 72%, 51%)',
    code: 'hsl(210, 100%, 56%)',
    ai: 'hsl(160, 84%, 39%)',
    sheets: 'hsl(142, 71%, 45%)',
  };

  const drawNodeIcon = useCallback((
    ctx: CanvasRenderingContext2D, 
    node: WorkflowNode, 
    pulse: number
  ) => {
    const { x, y, type, size } = node;
    const s = size * (1 + pulse * 0.1);
    
    ctx.save();
    ctx.translate(x, y);
    
    // Glow effect
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2);
    gradient.addColorStop(0, nodeColors[type].replace(')', `, ${0.3 + pulse * 0.2})`).replace('hsl', 'hsla'));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, s * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Node background
    ctx.fillStyle = 'hsl(0, 0%, 10%)';
    ctx.strokeStyle = nodeColors[type];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-s/2, -s/2, s, s, 8);
    ctx.fill();
    ctx.stroke();
    
    // Icon
    ctx.fillStyle = nodeColors[type];
    ctx.strokeStyle = nodeColors[type];
    ctx.lineWidth = 1.5;
    
    const iconSize = s * 0.4;
    
    switch (type) {
      case 'webhook':
        // Webhook icon - lightning bolt
        ctx.beginPath();
        ctx.moveTo(-iconSize * 0.3, -iconSize * 0.5);
        ctx.lineTo(iconSize * 0.2, -iconSize * 0.1);
        ctx.lineTo(-iconSize * 0.1, 0);
        ctx.lineTo(iconSize * 0.3, iconSize * 0.5);
        ctx.lineTo(-iconSize * 0.2, iconSize * 0.1);
        ctx.lineTo(iconSize * 0.1, 0);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'gmail':
        // Envelope icon
        ctx.beginPath();
        ctx.roundRect(-iconSize * 0.5, -iconSize * 0.35, iconSize, iconSize * 0.7, 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-iconSize * 0.4, -iconSize * 0.25);
        ctx.lineTo(0, iconSize * 0.1);
        ctx.lineTo(iconSize * 0.4, -iconSize * 0.25);
        ctx.stroke();
        break;
        
      case 'code':
        // Code brackets
        ctx.font = `bold ${iconSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('< />', 0, 0);
        break;
        
      case 'ai':
        // Brain/AI icon - neural network dots
        const dots = [
          [0, -iconSize * 0.4],
          [-iconSize * 0.35, -iconSize * 0.15],
          [iconSize * 0.35, -iconSize * 0.15],
          [-iconSize * 0.25, iconSize * 0.25],
          [iconSize * 0.25, iconSize * 0.25],
          [0, iconSize * 0.4],
        ];
        
        // Draw connections
        ctx.beginPath();
        dots.forEach((dot, i) => {
          dots.slice(i + 1).forEach(dot2 => {
            ctx.moveTo(dot[0], dot[1]);
            ctx.lineTo(dot2[0], dot2[1]);
          });
        });
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Draw nodes
        dots.forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(dx, dy, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
        
      case 'sheets':
        // Grid icon
        ctx.beginPath();
        ctx.roundRect(-iconSize * 0.45, -iconSize * 0.45, iconSize * 0.9, iconSize * 0.9, 2);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(-iconSize * 0.45, -iconSize * 0.15);
        ctx.lineTo(iconSize * 0.45, -iconSize * 0.15);
        ctx.moveTo(-iconSize * 0.45, iconSize * 0.15);
        ctx.lineTo(iconSize * 0.45, iconSize * 0.15);
        // Vertical line
        ctx.moveTo(0, -iconSize * 0.45);
        ctx.lineTo(0, iconSize * 0.45);
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  }, []);

  const drawConnection = useCallback((
    ctx: CanvasRenderingContext2D,
    from: WorkflowNode,
    to: WorkflowNode,
    progress: number,
    time: number
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 300) return;
    
    // Base connection line
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = `hsla(263, 70%, 66%, ${0.15 * (1 - dist / 300)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Animated pulse along the connection
    const pulsePos = (progress + time * 0.001) % 1;
    const pulseX = from.x + dx * pulsePos;
    const pulseY = from.y + dy * pulsePos;
    
    const pulseGradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 8);
    pulseGradient.addColorStop(0, 'hsla(160, 84%, 39%, 0.8)');
    pulseGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = pulseGradient;
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initNodes = () => {
      const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 25000);
      nodesRef.current = Array.from({ length: Math.min(nodeCount, 40) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
        size: 32 + Math.random() * 16,
        rotation: Math.random() * Math.PI * 2,
        pulsePhase: Math.random() * Math.PI * 2,
      }));
      
      // Create connections between nearby nodes
      connectionsRef.current = [];
      nodesRef.current.forEach((_, i) => {
        const numConnections = 1 + Math.floor(Math.random() * 2);
        for (let c = 0; c < numConnections; c++) {
          const target = Math.floor(Math.random() * nodesRef.current.length);
          if (target !== i) {
            connectionsRef.current.push({
              from: i,
              to: target,
              progress: Math.random(),
              speed: 0.0005 + Math.random() * 0.001,
            });
          }
        }
      });
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      timeRef.current += 16;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const mouse = mouseRef.current;

      // Update and draw connections
      connections.forEach((conn) => {
        conn.progress = (conn.progress + conn.speed * 16) % 1;
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        if (from && to) {
          drawConnection(ctx, from, to, conn.progress, timeRef.current);
        }
      });

      // Update and draw nodes
      nodes.forEach((node) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with padding
        const padding = 50;
        if (node.x < padding || node.x > canvas.width - padding) node.vx *= -1;
        if (node.y < padding || node.y > canvas.height - padding) node.vy *= -1;

        // Pulse animation
        const pulse = Math.sin(timeRef.current * 0.002 + node.pulsePhase) * 0.5 + 0.5;
        
        // Draw node
        drawNodeIcon(ctx, node, pulse);

        // Mouse interaction - attract nearby nodes slightly
        const mouseDx = mouse.x - node.x;
        const mouseDy = mouse.y - node.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDist < 200 && mouseDist > 0) {
          // Draw connection to mouse
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = (1 - mouseDist / 200) * 0.4;
          ctx.strokeStyle = `hsla(160, 84%, 39%, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Gentle attraction
          node.vx += (mouseDx / mouseDist) * 0.02;
          node.vy += (mouseDy / mouseDist) * 0.02;
          
          // Speed limit
          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          if (speed > 1) {
            node.vx = (node.vx / speed) * 1;
            node.vy = (node.vy / speed) * 1;
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    initNodes();
    animate();

    window.addEventListener('resize', () => {
      resize();
      initNodes();
    });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [drawNodeIcon, drawConnection]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default N8nWorkflowBackground;
