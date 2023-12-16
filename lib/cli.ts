import { readLines } from './file';

interface Day {
  S: any;
  lines: string[];
  num: number;
}

export async function getDayFromArgs(): Promise<Day> {
  const dayStr = process.argv[2];
  const dayrgx = /^day\d+$/;
  const inprgx = /\d+/;

  if (dayStr === undefined || !dayrgx.test(dayStr)) {
    console.error(`Invalid param: ${dayStr}`);
    process.exit(1);
  }

  const module = await import(`../src/solutions/${dayStr}/index`);
  const dayNumStr = dayStr.match(inprgx)?.[0];

  if (dayNumStr === undefined || isNaN(parseInt(dayNumStr))) {
    console.error(`Invalid param, cannot extract day number: ${dayStr}`);
    process.exit(1);
  }

  const num = parseInt(dayNumStr);

  const lines = readLines(`src/solutions/${dayStr}/input.txt`);
  return {
    S: module.Solution,
    lines,
    num,
  };
}
