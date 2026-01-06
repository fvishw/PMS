function getDynamicApiUrl(): string {
  const isProdEnv = import.meta.env.VITE_IS_PROD === "true";
  const localApiURL = import.meta.env.VITE_LOCAL_API_URL!;
  const prodEnvUrl = import.meta.env.VITE_SERVER_PROD_URL!;

  const url = isProdEnv ? prodEnvUrl : localApiURL;
  return url;
}

export { getDynamicApiUrl };
