import { iGracleTile } from "./gracle";

export interface iRuleStat {
  ruleVersion: string;
  ruleIndex: number;

  // in decimal form i.e. 0.05
  percentages: iStatCounter;

  // the amount of attempted or succeeded days
  totals: iStatCounter;

  tiles: iGracleTile[];
}

export interface iStatCounter {
  missed: number;
  attempted: number;
  succeeded: number;
}