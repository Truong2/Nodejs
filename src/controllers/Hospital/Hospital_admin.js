const User = require('../../models/Users')
const Decentralizes = require('../../models/decentralize')

const get_list_hospital = async (req) => {
	const name = req.query.name || "";
	const page = req.query.page || 1;
	const pageSize = req.query.pageSize || 10;
	const sort = req.query.sort || -1;

	const list = await User.aggregate([
		{
			$match: {
				$and: [
					{
						name: { $regex: `${name}` }
					},
					{
						type: 3
					}
				]
			}
		},
		{
			$lookup: {
				from: "specialists",
				localField: 'specialistId',
				foreignField: '_id',
				as: "listspecialists"
			}
		},
		{ $unwind: { path: "$listspecialists", preserveNullAndEmptyArrays: true } },
		{
			$lookup: {
				from: "decentralizes",
				localField: 'decentrialize',
				foreignField: '_id',
				as: "decentralizes"
			}
		},
		{ $unwind: { path: "$decentralizes", preserveNullAndEmptyArrays: true } },
		{
			$group: {
				_id: '$_id',
				name: { $first: '$name' },
				specialist: { $addToSet: "$listspecialists" },
				decentrialize: { $addToSet: "$decentralizes" },
				email: { $first: '$hospitalEmail' },
				identification: { $first: '$hospitalIdentification' },
				phone: { $first: '$phoneNumber' },
				address: { $first: '$address' },
				status: { $first: '$status' },
				district: { $first: '$district' },
				ward: { $first: '$ward' },
				province: { $first: '$province' },
				DOB: { $first: '$DOB' },
			}
		},
		{
			$skip: Number(pageSize * (page - 1))
		},
		{
			$limit: Number(pageSize)
		},
		{
			$sort: {
				name: Number(sort)
			}
		}
	])

	const total = await User.find({
		$and: [
			{ name: { $regex: `${name}` } },
			{ type: 3 }
		]
	}).count()

	return {
		list, page, pageSize, total
	}
}

exports.getListHospital = async (req, res) => {
	try {
		const { list, page, pageSize, total } = await get_list_hospital(req)
		return res.status(200).json({

			data: {
				content: list,
				page: page,
				size: pageSize,
				pageSize: list.length,
				totalElement: total,
				total_page: parseInt(total / pageSize + 1),
			},
			message: "success",
			statusCode: 200
		})

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message, statusCode: 500 })
	}
}


exports.grantRoleHospital = async (req, res) => {
	try {
		let { id, decentralize } = req.body;
		const data = req.user.data;

		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid", statusCode: 400 })
		}

		const check_role = await Decentralizes.find({ _id: { $in: decentralize } })
		if (decentralize.length !== check_role.length) {
			return res.status(400).json({ message: "decentralize is not valid", statusCode: 400 })
		}

		const check_exists_hospital = await User.exists({ _id: id })
		if (!check_exists_hospital) {
			return res.status(400).json({ message: "id hospital is not valid", statusCode: 400 })
		}

		await User.findOneAndUpdate({
			_id: id
		}, {
			decentrialize: decentralize
		})
			.then(async () => {
				const { list, page, pageSize, total } = await get_list_hospital(req)
				return res.status(200).json({
					data: {
						content: list,
						page: page,
						size: pageSize,
						pageSize: list.length,
						totalElement: total,
						total_page: parseInt(total / pageSize + 1),
					},
					message: "Cập nhật quyền thành công.", statusCode: 200
				});
			})
			.catch(err => { return res.status(500).json({ message: err.message, statusCode: 500 }) })

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message, statusCode: 500 })
	}
}

exports.changeStatus = async (req, res) => {
	try {
		let { id } = req.body;
		const data = req.user.data;
		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid !", statusCode: 400 })
		}

		const hospital = await User.findOne({ _id: id })
		if (!hospital) {
			return res.status(400).json({ message: 'Không tìm thấy tài khoản cơ sở y tế !', statusCode: 400 })
		}

		await User.findOneAndUpdate({
			_id: id
		}, {
			status: Number(hospital.status) == 1 ? 0 : 1
		})
			.then(async () => {
				const { list, page, pageSize, total } = await get_list_hospital(req)
				return res.status(200).json({
					data: {
						content: list,
						page: page,
						size: pageSize,
						pageSize: list.length,
						totalElement: total,
						total_page: parseInt(total / pageSize + 1),
					},
					message: "Cập nhật trạng thái thành công.",
					statusCode: 200
				});
			})
			.catch(err => { return res.status(500).json({ message: err.message, statusCode: 500 }) })

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message, statusCode: 500 })
	}

}

exports.deleteHospital = async (req, res) => {
	try {
		let { list_id } = req.body;
		const data = req.user.data;

		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid", statusCode: 400 })
		}
		// list_id = JSON.parse(list_id)
		await Hospital.findOneAndDelete({ _id: { $in: list_id } })
			.then(async () => {
				const { list, page, pageSize, total } = await get_list_hospital(req)
				return res.status(200).json({

					data: {
						content: list,
						page: page,
						size: pageSize,
						pageSize: list.length,
						totalElement: total,
						total_page: parseInt(total / pageSize + 1),
					},
					message: "Xóa thành công", statusCode: 200
				});
			})
			.catch(err => { return res.status(500).json({ message: err.message, statusCode: 500 }) })
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message, statusCode: 500 })
	}
}

exports.list_hospital = async (req, res) => {

	const name = req.query.name || "";
	const page = req.query.page || 1;
	const pageSize = req.query.pageSize || 10;
	const sort = req.query.sort || -1;

	const list_hos = await User.find({
		name: { $regex: `${name}` }
	}).select(
		"hospitalName"
	)
		.sort({ name: Number(sort) })
		.skip((Number(page) - 1) * Number(pageSize))
		.limit(Number(pageSize))

	const total = await Hospital.find({
		hospitalName: { $regex: `${name}` }
	}).count()

	return res.status(200).json({
		data: {
			page: page,
			size: pageSize,
			content: list_hos,
			totalElement: total,
			pageSize: list_hos.length,
			total_page: parseInt(total / pageSize + 1),
		}
		, message: "Success",
		statusCode: 200
	});
}
