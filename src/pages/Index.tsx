import { ConveyorCanvas } from '@/components/ConveyorCanvas';
import { DataPanel } from '@/components/DataPanel';
import { useConveyorSimulation } from '@/hooks/useConveyorSimulation';

const Index = () => {
  const { items, logs, robotStatus, robotTarget, stats, currentItem } = useConveyorSimulation();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-glow-primary" />
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-foreground tracking-tight">
            CONVEYOR SORTING SYSTEM
          </h1>
        </div>
        <p className="text-muted-foreground font-mono text-sm ml-6">
          Real-time automated classification and sorting
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Conveyor Canvas */}
        <div className="bg-surface rounded-lg p-4 shadow-lg border border-border">
          <ConveyorCanvas 
            items={items} 
            robotStatus={robotStatus}
            robotTarget={robotTarget}
          />
        </div>

        {/* Data Panel */}
        <DataPanel 
          currentItem={currentItem}
          logs={logs}
          stats={stats}
        />
      </div>

      {/* Status Indicators */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              robotStatus === 'idle' ? 'bg-primary' :
              robotStatus === 'picking' ? 'bg-warning' : 'bg-secondary'
            } animate-pulse`} />
            <span className="text-xs font-mono text-foreground uppercase">
              {robotStatus}
            </span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-foreground">
              {items.length} items on belt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
