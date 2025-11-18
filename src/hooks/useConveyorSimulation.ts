import { useState, useEffect, useCallback } from 'react';
import { ConveyorItem, SystemLog, RobotStatus, ItemClass } from '@/types/conveyor';

export const useConveyorSimulation = () => {
  const [items, setItems] = useState<ConveyorItem[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [robotStatus, setRobotStatus] = useState<RobotStatus>('idle');
  const [robotTarget, setRobotTarget] = useState<{ x: number; y: number } | null>(null);
  const [stats, setStats] = useState({
    totalProcessed: 0,
    classA: 0,
    classB: 0,
    classC: 0,
  });

  const addLog = useCallback((message: string, type: SystemLog['type'] = 'info') => {
    const log: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message,
      type,
    };
    setLogs(prev => [...prev, log].slice(-50)); // Keep last 50 logs
  }, []);

  const generateItem = useCallback(() => {
    const classes: ItemClass[] = ['A', 'B', 'C'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const damageScore = Math.random();
    const qrStatus = damageScore > 0.8 ? 'unreadable' : 'readable';

    const item: ConveyorItem = {
      id: Math.random().toString(36).substr(2, 9),
      class: qrStatus === 'unreadable' ? 'C' : randomClass,
      damage_score: damageScore,
      qr_status: qrStatus,
      x: 50,
      y: 300,
      isPicked: false,
      isLifting: false,
    };

    setItems(prev => [...prev, item]);
    addLog(`New item detected: Class ${item.class}, Damage: ${(damageScore * 100).toFixed(1)}%`, 'info');
  }, [addLog]);

  // Move items along the conveyor
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        return prev
          .map(item => {
            if (item.isPicked || item.isLifting) return item;
            return { ...item, x: item.x + 2 };
          })
          .filter(item => item.x < 1250); // Remove items that went off screen
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  // Generate new items periodically
  useEffect(() => {
    const interval = setInterval(() => {
      generateItem();
    }, 2000); // Generate item every 2 seconds

    return () => clearInterval(interval);
  }, [generateItem]);

  // Robot picking logic
  useEffect(() => {
    if (robotStatus !== 'idle') return;

    const pickupX = 780; // 65% of 1200
    const pickupRange = 50;

    // Find item closest to pickup zone
    const itemToPick = items.find(
      item => !item.isPicked && !item.isLifting &&
      item.x >= pickupX - pickupRange &&
      item.x <= pickupX + pickupRange
    );

    if (itemToPick) {
      // Start picking
      setRobotStatus('picking');
      setRobotTarget({ x: itemToPick.x, y: itemToPick.y });
      addLog(`Robot arm picking item ${itemToPick.id.slice(0, 8)}`, 'info');

      // Simulate pick duration
      setTimeout(() => {
        setItems(prev => prev.map(item =>
          item.id === itemToPick.id ? { ...item, isPicked: true, isLifting: true } : item
        ));

        setRobotStatus('moving');
        addLog(`Item ${itemToPick.id.slice(0, 8)} picked successfully`, 'success');

        // Move to bin
        setTimeout(() => {
          setItems(prev => prev.filter(item => item.id !== itemToPick.id));
          setRobotStatus('idle');
          setRobotTarget(null);

          // Update stats
          setStats(prev => ({
            totalProcessed: prev.totalProcessed + 1,
            classA: prev.classA + (itemToPick.class === 'A' ? 1 : 0),
            classB: prev.classB + (itemToPick.class === 'B' ? 1 : 0),
            classC: prev.classC + (itemToPick.class === 'C' ? 1 : 0),
          }));

          addLog(`Item sorted into bin ${itemToPick.class}`, 'success');
        }, 1000);
      }, 800);
    }
  }, [items, robotStatus, addLog]);

  return {
    items,
    logs,
    robotStatus,
    robotTarget,
    stats,
    currentItem: items.find(item => item.isPicked || item.isLifting) || null,
  };
};
