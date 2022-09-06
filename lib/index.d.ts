declare namespace FastQuerystring {
  export function stringify(value: string): Record<string, any>;
  export function parse(value: Record<string, any>): string;
}
