import "dotenv/config";
import { connectDB } from "./prismaFolder/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3006;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();
