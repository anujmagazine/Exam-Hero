
export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppState {
  HOME = 'home',
  SIMULATOR = 'simulator',
  BREATHING = 'breathing',
  COACH = 'coach',
  PHYSIOLOGICAL_SIGH = 'sigh',
  CLEAR_THE_NOISE = 'noise'
}
