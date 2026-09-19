import { Router } from "express";
import authRoutes from "./authRoutes";
import paymentRoutes from "./paymentRoutes";
import receiptRoutes from "./receiptRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/payment", paymentRoutes);
router.use("/receipts", receiptRoutes);

// Linn kopplar in sina innehålls- och adminroutes här, t.ex.:
// import contentRoutes from "./contentRoutes";
// router.use("/content", contentRoutes);

// Ilma kopplar in sin nivåbaserade extrafunktion här, t.ex.:
// import featureRoutes from "./featureRoutes";
// router.use("/feature", featureRoutes);

export default router;
