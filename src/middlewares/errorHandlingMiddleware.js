import { StatusCodes } from "http-status-codes";

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, next) => {
  console.log("ERROR LOG ", new Date().toLocaleString());
  console.log("Request:", req.method, req.originalUrl);
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("Query:", req.query);
  console.log("Error: ", err);
  console.log("Error stack: ", err.stack);
  console.log(
    "--------------------------------------------------------------------------------------"
  );

  // Nếu không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack,
  };
  console.log("responseError", responseError);
  // Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, còn không thì xóa đi.
  // if (process.env.NODE_ENV !== 'dev') delete responseError.stack

  // ...
  // console.error(responseError)

  // Trả responseError về phía Front-end
  delete responseError.stack;
  res
    .status(responseError.statusCode)
    .json({ responseError, StatusCodes: responseError.statusCode });
};
