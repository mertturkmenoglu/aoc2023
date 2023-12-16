import { createDirAndContents, doesDayExist, readLines } from './file';

interface Day {
  S: any;
  lines: string[];
  num: number;
}

interface TDay {
  num: number;
  str: string;
}

export function getDay(): TDay {
  const dayStr = process.argv[2];
  const dayrgx = /^day\d+$/;
  const inprgx = /\d+/;

  if (dayStr === undefined || !dayrgx.test(dayStr)) {
    console.error(`Invalid param: ${dayStr}`);
    process.exit(1);
  }

  const dayNumStr = dayStr.match(inprgx)?.[0];

  if (dayNumStr === undefined || isNaN(parseInt(dayNumStr))) {
    console.error(`Invalid param, cannot extract day number: ${dayStr}`);
    process.exit(1);
  }

  return {
    num: parseInt(dayNumStr),
    str: dayStr,
  };
}

export async function getDayFromArgs(): Promise<Day> {
  const { str, num } = getDay();
  const module = await import(`../src/solutions/${str}/index`);
  const lines = readLines(`src/solutions/${str}/input.txt`);
  return {
    S: module.Solution,
    lines,
    num,
  };
}

export function createNewDay(): void {
  const { num } = getDay();

  if (doesDayExist(num)) {
    console.error('Day already exists');
    process.exit(1);
  }

  createDirAndContents(num);
}
