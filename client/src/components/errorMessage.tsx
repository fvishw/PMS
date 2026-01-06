function ApiError({ message }: { message?: string }) {
  return (
    <p className="text-center text-red-500">
      {message || "Failed to load data. Please try again later."}
    </p>
  );
}

export default ApiError;
