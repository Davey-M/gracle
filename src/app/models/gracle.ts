export interface iGracle {
  // Date in year-month-day format.
  date: string;
  results: iGracleTile[];
}

export interface iGracleTile {
  ruleIndex: number;
  state: gracleState;
  version: string;
}

export enum gracleState {
  inProgress = 0,
  attempted = 1,
  succeeded = 2,
  empty = 3,
}

export interface iRule {
  id: string;
  text: string;
  summary: string;
}
