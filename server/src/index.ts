import app from "./app.js";
import { connectDB } from "./config/db.js";
import { PORT } from "./constants/env.js";
import initAppraisalSettings from "./utils/setting.seeder.js";
import EmailService from "./services/emailService/email.service.js";

const startApp = async () => {
  await connectDB();
  await initAppraisalSettings();
  await EmailService.verifyConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startApp();
