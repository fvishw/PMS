import app from "./app.js";
import { connectDB } from "./config/db.js";
import { PORT } from "./constants/env.js";
import initAppraisalSettings from "./utils/setting.seeder.js";

const startApp = async () => {
  await connectDB();
  await initAppraisalSettings();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startApp();
