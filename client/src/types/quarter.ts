const QUARTERS = ["Q1", "Q2", "Q3", "Final"] as const;

type Quarter = (typeof QUARTERS)[number];

export { QUARTERS };
export type { Quarter };
