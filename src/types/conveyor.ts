export type ItemClass = 'A' | 'B' | 'C';
export type QRStatus = 'readable' | 'unreadable';
export type RobotStatus = 'idle' | 'picking' | 'moving';

export interface ConveyorItem {
  id: string;
  class: ItemClass;
  damage_score: number;
  qr_status: QRStatus;
  x: number;
  y: number;
  isPicked: boolean;
  isLifting: boolean;
  targetBin?: ItemClass;
}

export interface RobotEvent {
  type: 'started' | 'done' | 'missed';
  timestamp: number;
  itemId?: string;
}

export interface PredictionEvent {
  id: string;
  class: ItemClass;
  damage_score: number;
  qr_status: QRStatus;
  timestamp: number;
}

export interface SystemLog {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
