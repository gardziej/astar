export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomColor(): string {
  return '0x' + Math.floor(Math.random()*16777215).toString(16);
}