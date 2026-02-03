import z from "zod";

const geminiResponseSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  kpiHighlights: z.array(
    z.object({
      objective: z.string(),
      note: z.string(),
    }),
  ),
  competencyHighlights: z.array(
    z.object({
      title: z.string(),
      note: z.string(),
    }),
  ),
  alignment: z.object({
    selfVsManagerGap: z.number(),
    note: z.string(),
  }),
  riskFlags: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  overAllScore: z.number(),
});

const geminiResponseSchemaFormat = {
  type: "object",
  properties: {
    summary: { type: "string" },

    strengths: {
      type: "array",
      items: { type: "string" },
    },

    improvements: {
      type: "array",
      items: { type: "string" },
    },

    kpiHighlights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          objective: { type: "string" },
          note: { type: "string" },
        },
        required: ["objective", "note"],
      },
    },

    competencyHighlights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          note: { type: "string" },
        },
        required: ["title", "note"],
      },
    },

    alignment: {
      type: "object",
      properties: {
        selfVsManagerGap: { type: "number" },
        note: { type: "string" },
      },
      required: ["selfVsManagerGap", "note"],
    },

    riskFlags: {
      type: "array",
      items: { type: "string" },
    },

    recommendedActions: {
      type: "array",
      items: { type: "string" },
    },
    overAllScore: { type: "number" },
  },
  required: [
    "summary",
    "strengths",
    "improvements",
    "kpiHighlights",
    "competencyHighlights",
    "alignment",
    "riskFlags",
    "recommendedActions",
    "overAllScore",
  ],
};

export { geminiResponseSchema, geminiResponseSchemaFormat };
