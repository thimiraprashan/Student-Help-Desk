import express from "express";
import controller from "../Controllers/CCompanyControllers.js";

const router = express.Router();

router.get("/", controller.getAllCompanies);
router.post("/", controller.addCompany);
router.get("/:id", controller.getById);
router.put("/:id", controller.updateCompany);
router.delete("/:id", controller.deleteCompany);

export default router;