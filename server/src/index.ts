import app from "./app.ts";
import { connectDB } from "./config/db.ts";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
