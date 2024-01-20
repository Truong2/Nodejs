const Hospital = require('../../models/Hospital')
const Decentralizes = require('../../models/decentralize')

const get_list_hospital = async (name, page, pageSize, sort) => {
	const list = await Hospital.aggregate([
		{
			$match: {
				hospitalName: { $regex: `${name}` }
			}
		},
		{
			$lookup: {
				from: "listspecialists",
				localField: 'role_parent',
				foreignField: '_id',
				as: "listspecialists"
			}
		},
		{ $unwind: { path: "$listspecialists", preserveNullAndEmptyArrays: true } },
		{
			$lookup: {
				from: "decentralizes",
				localField: 'hospitalDsecentralize',
				foreignField: '_id',
				as: "decentralizes"
			}
		},
		{ $unwind: { path: "$decentralizes", preserveNullAndEmptyArrays: true } },
		{
			$group: {
				_id: '$_id',
				name: { $first: '$hospitalName' },
				specialist: { $push: "$listspecialists" },
				roles: { $push: "$decentralizes" },
				email: { $first: '$hospitalEmail' },
				identification: { $first: '$hospitalIdentification' },
				phone: { $first: '$hospitalPhone' },
				address: { $first: '$hospitalAddress' },
				status: { $first: '$hopitalStatus' },
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

	return {
		list_hospital: list,
		page: page,
		size: pageSize,
		total_record: list.length,
		total_page: parseInt(list.length / pageSize + 1),
	}
}

exports.getListHospital = async (req, res) => {
	try {
		const name = req.query.name;
		const page = req.query.page || 1;
		const pageSize = req.query.pageSize || 10;
		const sort = req.query.sort || -1;

		const data = req.user.data;
		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid", statusCode: 400 })
		}
		const list_hospital = await get_list_hospital(name, page, pageSize, sort)
		return res.status(200).json({ message: "success", data: list_hospital, statusCode: 200 })

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message, statusCode: 500 })
	}
}

exports.editHospital = async (req, res) => {
	try {
		let { id,
			name,
			phone,
			identification,
			address,
			practicingCertificateID,
			UPracticingCertificateImg,
			decentralize,
			status
		} = req.body;

		const data = req.user.data;
		if (data.accountType != 0 && data.accountType != 3) {
			return res.status(400).json({ message: "Function is not valid", statusCode: 400 })
		}

		const check_exists = await Hospital.exists({ _id: (id) })
		if (!check_exists) {
			return res.status(400).json({ message: "id hospital is not valid", statusCode: 400 })
		}

		const check_decentralize = await Decentralizes.find({ _id: { $in: decentralize } })
		if (decentralize.length !== check_decentralize.length) {
			return res.status(400).json({ message: "decentralize is not valid", statusCode: 400 })
		}
		await Hospital.findOneAndUpdate({
			_id: id
		}, {
			hospitalName: name,
			hospitalIdentification: identification,
			hospitalPhone: phone,
			hospitalAddress: address,
			hospitalDsecentralize: decentralize,
			hos_PracticingCertificateID: practicingCertificateID,
			hos_UPracticingCertificateImg: UPracticingCertificateImg,
			hopitalStatus: status
		}).then(async () => {
			// const list_hospital = await get_list_hospital("", null, null, null)
			return res.status(200).json({ message: "update success" , statusCode: 200 });
		})
			.catch((err) => {
				return res.status(500).json({ message: err.message, statusCode: 500 })
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
		const check_exists_hospital = await Hospital.exists({ _id: id })
		if (!check_exists_hospital) {
			return res.status(400).json({ message: "id hospital is not valid", statusCode: 400 })
		}

		await Hospital.findOneAndUpdate({
			_id: id
		}, {
			hospitalDsecentralize: decentralize
		})
			.then(async () => {
				// const list_hospital = await get_list_hospital("")
				return res.status(200).json({ message: "update success", statusCode: 200 });
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
			return res.status(400).json({ message: "Function is not valid", statusCode: 400 })
		}

		const hospital = await Hospital.findOne({ _id: id })
		if (!hospital) {
			return res.status(400).json({ message: 'id hospital is not valid', statusCode: 400 })
		}
		console.log(hospital.hopitalStatus)
		await Hospital.findOneAndUpdate({
			_id: id
		}, {
			hopitalStatus: Number(hospital.hopitalStatus) == 1 ? 0 : 1
		})
			.then(async () => {
				// const list_hospital = await get_list_hospital("")
				return res.status(200).json({ message: "Cập nhật trạng thái thành công", statusCode: 200 });
			})
			.catch(err => { return res.status(500).json({ message: err.message, statusCode: 500 }) })

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message, statusCode: 500 })
	}

}

exports.deleteHospital = async (req, res) => {
	try {
		let { list_id } = req.params;
		const data = req.user.data;
		console.log(list_id)

		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid" , statusCode: 400})
		}
		list_id = JSON.parse(list_id)
		await Hospital.findOneAndDelete({ _id: { $in: list_id } })
			.then(async () => {

				return res.status(200).json({ message: "Xóa thành công", statusCode: 200 });
			})
			.catch(err => { return res.status(500).json({ message: err.message, statusCode: 500 }) })
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message, statusCode: 500 })
	}
}
