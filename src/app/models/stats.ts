import { iGracleTile } from "./gracle";

export interface iRuleStat {
  ruleVersion: string;
  ruleIndex: number;

  // in decimal form i.e. 0.05
  percentages: iStatCounter;

  // the amount of attempted or succeeded days
  totals: iStatCounter;

  tiles: iGracleTile[];

  // the style to go on the outer stat wrapper
  style?: object;
}

export interface iStatCounter {
  missed: number;
  attempted: number;
  succeeded: number;
}