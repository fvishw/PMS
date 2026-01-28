import app from "./app.js";
import { connectDB } from "./config/db.js";
import { PORT } from "./constants/env.js";

app.listen(PORT, async () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
