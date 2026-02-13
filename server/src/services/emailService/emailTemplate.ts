import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailTemplate {
  private static readTemplate(templateName: string) {
    try {
      console.log("path", __dirname);
      const filePath = path.join(__dirname, "templates", `${templateName}.hbs`);
      console.log(filePath);
      return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
      throw new Error(`Failed to read email template: ${templateName}`);
    }
  }

  private static compileTemplate(
    templateName: string,
    data: Record<string, any>,
  ): string {
    const templateString = this.readTemplate(templateName);
    const compiledTemplate = handlebars.compile(templateString);
    return compiledTemplate(data);
  }

  static getPasswordResetEmail(data: { resetUrl: string }): string {
    return this.compileTemplate("resetPasswordTemplate", data);
  }

  static getInvitationEmail(): string {
    return this.compileTemplate("employeeOnboardingTemplate", {});
  }
}
