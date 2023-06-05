import Breakdown from "../Models/BreakdownSchema.js";
import User from "../Models/User.js";
import Worker from "../Models/Worker.js";

// Создать новую поломку
// export const createBreakdown = async (req, res) => {
// 	try {
// 		const { workerId, description } = req.body;
// 		// Получить информацию о рабочем по идентификатору
// 		const worker = await Worker.findById(workerId);
// 		if (!worker) {
// 			return res.status(404).json({ error: "Рабочий не найден" });
// 		}

// 		// Создать новую поломку с указанными данными
// 		const breakdown = await Breakdown.create({
// 			addedBy: workerId,
// 			name: worker.name,
// 			description,
// 		});
// 		console.log(breakdown);
// 		res.status(201).json({ breakdown });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ error: "Ошибка при создании поломки" });
// 	}
// };

export const createBreakdown = async (req, res) => {
	try {
		const { workerId, description } = req.body;

		// Получить информацию о рабочем по идентификатору
		const worker = await Worker.findById(workerId);
		if (!worker) {
			return res.status(404).json({ error: "Рабочий не найден" });
		}

		// Создать новую поломку с указанными данными
		const breakdown = await Breakdown.create({
			addedBy: workerId,
			name: worker.name,
			description,
		});

		// Найти пользователя, которому принадлежит рабочий
		const user = await User.findOne({ workers: workerId });
		if (!user) {
			return res.status(404).json({ error: "Пользователь не найден" });
		}

		// Добавить ссылку на поломку в массив breakdowns пользователя
		user.breakdowns.push(breakdown._id);
		await user.save();

		console.log(breakdown);
		res.status(201).json({ breakdown });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Ошибка при создании поломки" });
	}
};

export const getAllBreakdowns = async (req, res) => {
	try {
		const { id } = req.params;

		// Найти пользователя или рабочего по идентификатору
		const [user, worker] = await Promise.all([
			User.findById(id).populate("breakdowns"),
			Worker.findById(id),
		]);

		if (user) {
			// Если найден пользователь, вернуть его поломки
			const breakdowns = user.breakdowns;
			return res.json({ breakdowns });
		}

		if (worker) {
			// Если найден рабочий, найти пользователя, содержащего его, и вернуть его поломки
			const userWithWorker = await User.findOne({ workers: id }).populate(
				"breakdowns"
			);
			if (userWithWorker) {
				const breakdowns = userWithWorker.breakdowns;
				return res.json({ breakdowns });
			}
		}

		// Если не найдено совпадение ни для пользователя, ни для рабочего
		return res
			.status(404)
			.json({ error: "Пользователь или рабочий не найден" });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Ошибка при получении поломок пользователя" });
	}
};

// Обновить статус поломки
export const updateBreakdownStatus = async (req, res) => {
	try {
		const { breakdownId } = req.params;
		const { status } = req.body;
		const breakdown = await Breakdown.findByIdAndUpdate(
			breakdownId,
			{ status },
			{ new: true }
		);
		if (!breakdown) {
			return res.status(404).json({ error: "Поломка не найдена" });
		}
		res.json({ breakdown });
	} catch (error) {
		res.status(500).json({ error: "Ошибка при обновлении статуса поломки" });
	}
};

// Удалить поломку
export const deleteBreakdown = async (req, res) => {
	try {
		const breakdownId = req.params.breakdownId;
		const breakdown = await Breakdown.findByIdAndDelete(breakdownId);
		console.log(breakdown);
		if (!breakdown) {
			return res.status(404).json({ error: "Поломка не найдена" });
		}
		res.json({ message: "Поломка удалена" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка при удалении поломки" });
	}
};

export const updateStatus = async (req, res) => {
	try {
		const breakdownId = req.params.breakdownId;
		const breakdown = await Breakdown.findByIdAndDelete(breakdownId);
		console.log(breakdown);
		if (!breakdown) {
			return res.status(404).json({ error: "Поломка не найдена" });
		}
		res.json({ message: "Поломка удалена" });
	} catch (error) {
		res.status(500).json({ error: "Ошибка при удалении поломки" });
	}
};
