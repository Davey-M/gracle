export interface iGracle {
  // Date in year-month-day format.
  date: string;
  results: iGracleTile[];
}

export interface iGracleTile {
  ruleIndex: number;
  state: gracleState;
}

export enum gracleState {
  inProgress = 0,
  attempted = 1,
  succeeded = 2,
}

export interface iRule {
  text: string;
  index: number;
  deprecated: boolean;
}