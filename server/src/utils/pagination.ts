const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }
  return parsedValue;
};

const getPaginationParams = (query: Record<string, unknown>) => {
  const page = parsePositiveInt(query.page, DEFAULT_PAGE);
  const limit = Math.min(parsePositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMeta = ({
  totalItems,
  page,
  limit,
}: {
  totalItems: number;
  page: number;
  limit: number;
}) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.max(Math.ceil(totalItems / limit), 1),
});

export { getPaginationParams, getPaginationMeta, DEFAULT_LIMIT };
