import { transformSync } from '@babel/core';

export function makeMultilineJSIntoSingleLine(src: string): string {
  // We use babel without any actual transofmration steps, and only for ASI
  // effects here, e.g. turning `return\n42` into `return;\n42;`
  // since without the added semicolons semantics would be different.
  // This unfortunately modifies the code in some other ways as well, e.g.
  // removing unnecessary parentheses, but correctness seems to be more
  // important here than keeping aesthetics intact.
  // It would be nice to have a dedicated package at some point that does
  // ASI and *only* ASI and leaves the source intact otherwise.
  const postASI = transformSync(src, {
    retainLines: true,
    compact: false,
    code: true,
    comments: false
  })?.code ?? src;
  const asSingleLine = postASI.split(/[\r\n]+/g)
    .map(line => line.trim())
    .join(' ')
    .trim();
  // Remove a trailing semicolon if the input also did not have one.
  return src.trim().endsWith(';') ? asSingleLine : asSingleLine.replace(/;$/, '');
}
