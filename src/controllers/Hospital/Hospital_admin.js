const Hospital = require('../../models/Hospital')
const Decentralizes = require('../../models/decentralize')

const get_list_hospital = async (name) => {

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
		}
	])

	return list;
}

exports.getListHospital = async (req, res) => {
	try {
		let { name } = req.query;
		const data = req.user.data;
		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid" })
		}
		const list_hospital = await get_list_hospital(name)
		return res.status(200).json({ message: "success", data: list_hospital })

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message })
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
			status
		} = req.body;

		const data = req.user.data;
		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid" })
		}

		const check_exists = await Hospital.exists({ _id: (id) })
		if (!check_exists) {
			return res.status(400).json({ message: "id hospital is not valid" })
		}

		await Hospital.findOneAndUpdate({
			_id: id
		}, {
			hospitalName: name,
			hospitalIdentification: identification,
			hospitalPhone: phone,
			hospitalAddress: address,
			hos_PracticingCertificateID: practicingCertificateID,
			hos_UPracticingCertificateImg: UPracticingCertificateImg,
			hopitalStatus: status
		}).then(async () => {
			const list_hospital = await get_list_hospital("")
			return res.status(200).json({ message: "update success", data: list_hospital });
		})
			.catch((err) => {
				return res.status(500).json({ message: err.message })
			})

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message })

	}
}

exports.grantRoleHospital = async (req, res) => {
	try {
		let { id, decentralize } = req.body;
		const data = req.user.data;

		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid" })
		}

		decentralize = JSON.parse(decentralize)
		const check_role = await Decentralizes.find({ _id: { $in: decentralize } })
		if (decentralize.length !== check_role.length) {
			return res.status(400).json({ message: "decentralize is not valid" })
		}
		const check_exists_hospital = await Hospital.exists({ _id: id })
		if (!check_exists_hospital) {
			return res.status(400).json({ message: "id hospital is not valid" })
		}

		await Hospital.findOneAndUpdate({
			_id: id
		}, {
			hospitalDsecentralize: decentralize
		})
			.then(async () => {
				const list_hospital = await get_list_hospital("")
				return res.status(200).json({ message: "update success", data: list_hospital });
			})
			.catch(err => { return res.status(500).json({ message: err.message }) })

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message })
	}
}

exports.changeStatus = async (req, res) => {
	try {
		let { id } = req.body;
		const data = req.user.data;
		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid" })
		}

		const hospital = await Hospital.findOne({ _id: id })
		if (!hospital) {
			return res.status(400).json({ message: 'id hospital is not valid' })
		}
		console.log(hospital.hopitalStatus)
		await Hospital.findOneAndUpdate({
			_id: id
		}, {
			hopitalStatus: Number(hospital.hopitalStatus) == 1 ? 0 : 1
		})
			.then(async () => {
				const list_hospital = await get_list_hospital("")
				return res.status(200).json({ message: "Cập nhật trạng thái thành công", data: list_hospital });
			})
			.catch(err => { return res.status(500).json({ message: err.message }) })

	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message })
	}

}

exports.deleteHospital = async (req, res) => {
	try {
		let { list_id } = req.body;
		const data = req.user.data;

		if (data.accountType != 0) {
			return res.status(400).json({ message: "Function is not valid" })
		}
		list_id = JSON.parse(list_id)
		await Hospital.findOneAndDelete({ _id: { $in: list_id } })
			.then(async () => {
				const list_hospital = await get_list_hospital("")
				return res.status(200).json({ message: "Xóa thành công", data: list_hospital });
			})
			.catch(err => { return res.status(500).json({ message: err.message }) })
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: err.message })
	}
}

