exports.addSpecialist = async (req, res) => {
    try {
        return res.status(200).json({ message: "check" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message })
    }
}