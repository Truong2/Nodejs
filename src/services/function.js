exports.maxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } });
    if (maxUser) {
        return maxUser._id;
    }
    return 0;

}