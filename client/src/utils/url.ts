function getDynamicApiUrl(): string {
  const isProdEnv = import.meta.env.VITE_IS_PRODUCTION_ENV;
  const localEnv = import.meta.env.SERVER_LOCAL_URL;
  const prodEnv = import.meta.env.SERVER_PROD_URL;

  return isProdEnv ? prodEnv : localEnv;
}

export { getDynamicApiUrl };
