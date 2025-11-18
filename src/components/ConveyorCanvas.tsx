import { useEffect, useRef } from 'react';
import { ConveyorItem, RobotStatus } from '@/types/conveyor';

interface ConveyorCanvasProps {
  items: ConveyorItem[];
  robotStatus: RobotStatus;
  robotTarget: { x: number; y: number } | null;
}

export const ConveyorCanvas = ({ items, robotStatus, robotTarget }: ConveyorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid background
      ctx.strokeStyle = 'hsl(215 16% 25% / 0.3)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw conveyor belt
      const beltY = canvas.height / 2;
      const beltHeight = 120;
      
      // Belt base
      ctx.fillStyle = 'hsl(217.2 33% 14%)';
      ctx.fillRect(0, beltY - beltHeight / 2, canvas.width, beltHeight);
      
      // Belt edges
      ctx.strokeStyle = 'hsl(142 76% 36% / 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, beltY - beltHeight / 2, canvas.width, beltHeight);

      // Belt lines (animated)
      const lineOffset = (Date.now() / 20) % 40;
      ctx.strokeStyle = 'hsl(142 76% 36% / 0.2)';
      ctx.lineWidth = 1;
      for (let x = -40 + lineOffset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, beltY - beltHeight / 2);
        ctx.lineTo(x, beltY + beltHeight / 2);
        ctx.stroke();
      }

      // Draw items
      items.forEach(item => {
        if (item.isLifting) return; // Don't draw items being lifted

        const boxSize = 50;
        const x = item.x;
        const y = beltY;

        // Get color based on class
        let boxColor: string;
        let glowColor: string;
        switch (item.class) {
          case 'A':
            boxColor = 'hsl(142 76% 36%)';
            glowColor = 'hsl(142 76% 36% / 0.5)';
            break;
          case 'B':
            boxColor = 'hsl(217 91% 60%)';
            glowColor = 'hsl(217 91% 60% / 0.5)';
            break;
          case 'C':
            boxColor = 'hsl(0 84% 60%)';
            glowColor = 'hsl(0 84% 60% / 0.5)';
            break;
        }

        // Draw glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = glowColor;

        // Draw box
        ctx.fillStyle = boxColor;
        ctx.fillRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw box border
        ctx.strokeStyle = 'hsl(210 40% 98% / 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);

        // Draw class label
        ctx.fillStyle = 'hsl(210 40% 98%)';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.class, x, y);

        // Draw damage score indicator
        if (item.damage_score > 0.5) {
          ctx.fillStyle = 'hsl(38 92% 50%)';
          ctx.font = '12px monospace';
          ctx.fillText('!', x, y - 30);
        }
      });

      // Draw pickup zone marker
      const pickupX = canvas.width * 0.65;
      ctx.strokeStyle = 'hsl(38 92% 50% / 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pickupX, beltY - 80);
      ctx.lineTo(pickupX, beltY + 80);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw robotic arm
      const armX = pickupX;
      const baseY = beltY - 150;
      const armLength = 80;

      // Arm base
      ctx.fillStyle = 'hsl(215 28% 17%)';
      ctx.fillRect(armX - 15, baseY - 20, 30, 20);

      // Arm position based on status
      let targetY = baseY;
      if (robotStatus === 'picking' && robotTarget) {
        targetY = robotTarget.y;
      } else if (robotStatus === 'moving') {
        targetY = baseY - 50;
      }

      // Arm body
      ctx.strokeStyle = 'hsl(217 91% 60%)';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(armX, baseY);
      ctx.lineTo(armX, targetY);
      ctx.stroke();

      // Arm gripper
      ctx.fillStyle = robotStatus === 'picking' ? 'hsl(142 76% 36%)' : 'hsl(217 91% 60%)';
      ctx.beginPath();
      ctx.arc(armX, targetY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Status indicator
      ctx.fillStyle = 'hsl(210 40% 98%)';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(robotStatus.toUpperCase(), armX, baseY - 30);

      // Draw bins
      const binWidth = 80;
      const binHeight = 100;
      const binY = canvas.height - binHeight - 20;
      const bins = [
        { x: 100, label: 'A', color: 'hsl(142 76% 36%)' },
        { x: canvas.width / 2, label: 'B', color: 'hsl(217 91% 60%)' },
        { x: canvas.width - 100, label: 'C', color: 'hsl(0 84% 60%)' }
      ];

      bins.forEach(bin => {
        ctx.strokeStyle = bin.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(bin.x - binWidth / 2, binY, binWidth, binHeight);
        
        ctx.fillStyle = `${bin.color.slice(0, -1)} / 0.2)`;
        ctx.fillRect(bin.x - binWidth / 2, binY, binWidth, binHeight);

        ctx.fillStyle = 'hsl(210 40% 98%)';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bin.label, bin.x, binY + binHeight / 2);
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [items, robotStatus, robotTarget]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={600}
      className="w-full h-full rounded-lg border-2 border-primary/30"
    />
  );
};
