import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import amazonRoutes from "./src/routes/route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // fallback port

app.use(express.json());
app.use(helmet());

// Uncomment and configure CORS if needed
app.use(
  cors({
    methods: ["GET", "POST"],
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use('/api', amazonRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
