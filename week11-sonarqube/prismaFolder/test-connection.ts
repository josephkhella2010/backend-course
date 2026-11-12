import prisma, { connectDB } from "./db.js";

try {
  await connectDB();

  const count = await prisma.item.count();

  console.log("Database connection works!");
  console.log("Number of items:", count);
} catch (error) {
  console.error("Connection test failed:", error);
} finally {
  await prisma.$disconnect();
}
