declare namespace FastQuerystring {
  export function stringify(value: Record<string, any>): string;
  export function parse(value: string): Record<string, any>;
}

export function stringify(value: Record<string, any>): string;
export function parse(value: string): Record<string, any>;
export default FastQuerystring;
