type FastQueryString = {
  // biome-ignore lint/suspicious/noExplicitAny: This is deliberate.
  stringify(value: Record<string, any>): string;
  // biome-ignore lint/suspicious/noExplicitAny: This is deliberate.
  parse(value: string): Record<string, any>;
};

declare namespace fastQueryString {
  // biome-ignore lint/suspicious/noExplicitAny: This is deliberate.
  export function stringify(value: Record<string, any>): string;
  // biome-ignore lint/suspicious/noExplicitAny: This is deliberate.
  export function parse(value: string): Record<string, any>;

  const fqs: FastQueryString;
  export { fqs as default };
}

export = fastQueryString;
