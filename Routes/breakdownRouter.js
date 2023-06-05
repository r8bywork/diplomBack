import { Router } from "express";
import {
	createBreakdown,
	deleteBreakdown,
	getAllBreakdowns,
	updateBreak,
	updateBreakdownStatus,
} from "../Controller/breakdownController.js";

const router = new Router();
router.put("/update/:breakdownId", updateBreak);
// Создать новую поломку
router.post("/createBreak", createBreakdown);
// Получить все поломки
router.get("/breakdowns/:id", getAllBreakdowns);
// Обновить статус поломки
router.put("/breakdowns/:breakdownId", updateBreakdownStatus);
// Удалить поломку
router.delete("/breakdowns/:breakdownId", deleteBreakdown);

export default router;
