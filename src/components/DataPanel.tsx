import { Card } from '@/components/ui/card';
import { ConveyorItem, SystemLog } from '@/types/conveyor';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataPanelProps {
  currentItem: ConveyorItem | null;
  logs: SystemLog[];
  stats: {
    totalProcessed: number;
    classA: number;
    classB: number;
    classC: number;
  };
}

export const DataPanel = ({ currentItem, logs, stats }: DataPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Current Item Data */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-sm font-mono uppercase text-accent mb-3">Current Item</h3>
        {currentItem ? (
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="text-foreground">{currentItem.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class:</span>
              <span className={`font-bold ${
                currentItem.class === 'A' ? 'text-classA' :
                currentItem.class === 'B' ? 'text-classB' : 'text-classC'
              }`}>
                {currentItem.class}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Damage Score:</span>
              <span className={`${
                currentItem.damage_score > 0.7 ? 'text-destructive' :
                currentItem.damage_score > 0.4 ? 'text-warning' : 'text-primary'
              }`}>
                {(currentItem.damage_score * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">QR Status:</span>
              <span className={currentItem.qr_status === 'readable' ? 'text-primary' : 'text-destructive'}>
                {currentItem.qr_status}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm font-mono">No active item</p>
        )}
      </Card>

      {/* Statistics */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-sm font-mono uppercase text-accent mb-3">Statistics</h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Processed:</span>
            <span className="text-foreground font-bold">{stats.totalProcessed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Class A:</span>
            <span className="text-classA font-bold">{stats.classA}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Class B:</span>
            <span className="text-classB font-bold">{stats.classB}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Class C:</span>
            <span className="text-classC font-bold">{stats.classC}</span>
          </div>
        </div>
      </Card>

      {/* System Logs */}
      <Card className="p-4 bg-card border-border md:col-span-2">
        <h3 className="text-sm font-mono uppercase text-accent mb-3">System Logs</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-1 font-mono text-xs">
            {logs.slice().reverse().map(log => (
              <div key={log.id} className="flex gap-2">
                <span className="text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`${
                  log.type === 'error' ? 'text-destructive' :
                  log.type === 'warning' ? 'text-warning' :
                  log.type === 'success' ? 'text-primary' : 'text-foreground'
                }`}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className="text-foreground">{log.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
