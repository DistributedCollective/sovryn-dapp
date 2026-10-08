/**
 * Stand-in for a dependency whose shipped types this project's TypeScript
 * cannot parse. `skipLibCheck` does not help: those errors are SYNTACTIC, and
 * tsc stops before reporting a single semantic diagnostic — which is why the
 * typecheck passed while nothing in `src/` was being checked at all.
 * Redirecting the offending modules here keeps them out of the parse, at the
 * cost of typing them as `any`.
 */
declare const opaque: any;
export = opaque;
