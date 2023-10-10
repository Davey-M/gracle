import { gracleState } from "./gracle";

export interface iDateOption {
  date: string;
  value: Date;
}

export enum Month {
  Jan = 0,
  Feb = 1,
  Mar = 2,
  Apr = 3,
  May = 4,
  Jun = 5,
  Jul = 6,
  Aug = 7,
  Sep = 8,
  Oct = 9,
  Nov = 10,
  Dec = 11,
}

export enum Week {
  Sun = 0,
  Mon = 1,
  Tue = 2,
  Wed = 3,
  Thu = 4,
  Fri = 5,
  Sat = 6,
}

export interface iMonthState {
  name: string;
  month: Month;
  numOfDays: number;
  state: gracleState[];

  // the day of the week that the first falls on
  startIndex: Week;
}
