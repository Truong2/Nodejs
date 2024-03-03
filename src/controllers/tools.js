const Province = require("../models/provice");
const District = require("../models/district");
const Ward = require("../models/ward");
const axios = require('axios')
const func = require('../services/function')

exports.province_service = async (req, res) => {

  const { data, status } = await axios.get('http://192.168.1.4:5006/query')

  if (data && data?.data) {
    const list_data = data?.data;
    for (let i = 0; i < list_data.length; i++) {
      console.log(list_data[i])


      // const new_province = new Province({
      //   _id: list_data[i].code,
      //   name: list_data[i].name,
      //   full_name: list_data[i].full_name,
      //   code: list_data[i].code_name
      // })
      // await new_province.save()

      // const new_province = new District({
      //   _id: list_data[i].code,
      //   name: list_data[i].name,
      //   full_name: list_data[i].full_name,
      //   code: list_data[i].code_name
      // })
      // await new_province.save()

      const new_province = new Ward({
        _id: list_data[i].code,
        name: list_data[i].name,
        full_name: list_data[i].full_name,
        code: list_data[i].code_name
      })
      await new_province.save()
    }

    return res.status(200).json({ message: "OK" })
  }
}
