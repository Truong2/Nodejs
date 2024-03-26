const Decentralize = require("../../models/decentralize");
const functions = require("../../services/function");
const RoleUser = require("../../models/roleUser");

const query_decentralize = async (req) => {

  const name = req.query.name;
  const page = req.query.page || 1;
  const sort = req.query.sort || -1;
  const pageSize = req.query.pageSize || 10;

  const regexName = name ? String(name) : "";

  const list_decentralize = await Decentralize.aggregate([
    {
      $match: {
        decentralize_name: { $regex: regexName },
      },
    },
    {
      $lookup: {
        from: "roleusers",
        localField: "decentralize_role",
        foreignField: "_id",
        as: "roleusers",
      },
    },
    { $unwind: { path: "$roleusers", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$decentralize_name" },
        role_child: { $push: "$roleusers" },
        code: { $first: "$decentralize_code" },
        status: { $first: "$status" },
      },
    },
    {
      $sort: {
        name: -1,
      },
    },
    {
      $skip: Number(pageSize * (page - 1)),
    },
    {
      $limit: Number(pageSize)
    },
    {
      $sort: {
        name: Number(sort),
      },
    }
  ]);

  const total = await Decentralize.find({
    decentralize_name: { $regex: regexName },
  }).count()

  return { list_decentralize, page, pageSize, total }
}

exports.createRole = async (req, res) => {
  try {
    let {
      name_role,
      status,
      decentralize_role,
      typeAccount,
      decentralize_code,
    } = req.body;

    const accountType = req.user.data.accountType;
    if (accountType !== 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    if (!name_role && decentralize_role.length === 0) {
      return res.status(400).json({ message: "bad request", statusCode: 400 });
    }

    const check_list_role = await RoleUser.find({
      _id: { $in: decentralize_role },
    });
    if (check_list_role.length !== decentralize_role.length) {
      return res.status(400).json({ message: "list role is not valid", statusCode: 400 });
    }

    const maxId_role = await functions.maxID(Decentralize);
    const new_role = new Decentralize({
      _id: maxId_role + 1,
      decentralize_name: name_role,
      decentralize_role: decentralize_role,
      status: status,
      typeAccount: typeAccount,
      decentralize_code: decentralize_code,
    });
    await new_role
      .save()

      .then(async () => {
        const { list_decentralize, page, pageSize, total } = await query_decentralize(req);

        return res.status(200).json({
          data: {
            content: list_decentralize,
            page: page,
            size: pageSize,
            pagesize: list_decentralize.length,
            totalElement: total,
            total_page: parseInt(total / pageSize + 1),
          },
          message: "get list  decentralize success"
          , statusCode: 200
        });
      })

      .catch((err) => {
        return res.status(500).json({ message: err, statusCode: 500 });
      });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.updateDecentralize = async (req, res) => {
  try {
    const { name_role, status, decentralize_role, code } = req.body;
    const decentralize_id = Number(req.params.decentralize_id);

    const accountType = req.user.data.accountType;
    if (accountType !== 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    if (!name_role) {
      return res.status(400).json({ message: "bad request", statusCode: 400 });
    }

    if (!decentralize_id || isNaN(decentralize_id)) {
      return res.status(400).json({ message: "bad request", statusCode: 400 });
    }

    const check_list_role = await RoleUser.find({
      _id: { $in: decentralize_role },
    });
    if (check_list_role.length !== decentralize_role.length) {
      return res.status(400).json({ message: "list role is not valid", statusCode: 400 });
    }

    const check_exists = await Decentralize.exists({ _id: decentralize_id });
    if (!check_exists) {
      return res.status(400).json({ message: "dencetrale is not exists", statusCode: 400 });
    }

    await Decentralize.findOneAndUpdate(
      { _id: decentralize_id },
      {
        decentralize_name: name_role,
        status: status,
        decentralize_role: decentralize_role,
        decentralize_code: code,
      }
    )
      .then(async () => {
        const { list_decentralize, page, pageSize, total } = await query_decentralize(req);

        return res.status(200).json({
          data: {
            content: list_decentralize,
            page: page,
            size: pageSize,
            pagesize: list_decentralize.length,
            totalElement: total,
            total_page: parseInt(total / pageSize + 1),
          },
          message: "get list  decentralize success"
          , statusCode: 200
        });
      })

      .catch((err) => {
        return res.status(500).json({ message: err, statusCode: 500 });
      });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.deletedentralize = async (req, res) => {
  try {
    let decentralize_id = Number(req.params.decentralize_id);
    const accountType = req.user.data.accountType;

    if (accountType !== 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    if (!decentralize_id || isNaN(decentralize_id)) {
      return res.status(400).json({ message: "bad request", statusCode: 400 });
    }

    const check_exists = await Decentralize.exists({ _id: decentralize_id });
    if (!check_exists) {
      return res.status(400).json({ message: "Decentralize is not exists", statusCode: 400 });
    }

    await Decentralize.findOneAndDelete({ _id: decentralize_id })
      .then(async () => {
        const { list_decentralize, page, pageSize, total } = await query_decentralize(req);

        return res.status(200).json({
          data: {
            content: list_decentralize,
            page: page,
            size: pageSize,
            pagesize: list_decentralize.length,
            totalElement: total,
            total_page: parseInt(total / pageSize + 1),
          },
          message: "get list  decentralize success"
          , statusCode: 200
        });
      })

      .catch((err) => {
        return res.status(500).json({ message: err.message, statusCode: 500 });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.listDecentralize = async (req, res) => {
  try {
    const accountType = req.user.data.accountType;
    if (accountType !== 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    const { list_decentralize, page, pageSize, total } = await query_decentralize(req);

    return res.status(200).json({
      data: {
        content: list_decentralize,
        page: page,
        size: pageSize,
        pagesize: list_decentralize.length,
        totalElement: total,
        total_page: parseInt(total / pageSize + 1),
      },
      message: "get list  decentralize success"
      , statusCode: 200
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.detailDecentralizes = async (req, res) => {
  try {
    let decentralize_id = req.params.decentralize_id;

    const accountType = req.user.data.accountType;
    if (accountType !== 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    const list_decentralize = await Decentralize.aggregate([
      {
        $match: {
          _id: Number(decentralize_id),
        },
      },
      {
        $lookup: {
          from: "roleusers",
          localField: "decentralize_role",
          foreignField: "_id",
          as: "Role",
        },
      },
      { $unwind: { path: "$Role", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: " $_id",
          decentralize_name: { $first: "$decentralize_name" },
          decentralize_role: { $addToSet: "$Role" },
          decentralize_code: { $first: "$decentralize_code" },
          typeAccount: { $first: "$typeAccount" },
          status: { $first: "$status" },
        },
      },
    ]);

    return res.status(200).json({
      data: list_decentralize,
      message: "get list decentralize success"
      , statusCode: 200
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};
