import app from "./app.js";

import { connectDB } from "./config/db.js";
const PORT = process.env.PORT || 5000;
console.log(PORT);
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
