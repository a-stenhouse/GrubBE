exports.customErrors = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.mongooseErrors = (err, request, response, next) => {
  if (err.errors && err._message) {
    if (err._message === "item validation failed") {
      response.status(400).send({
        msg: `bad request - ${Object.keys(err.errors)} is required`,
      });
    } else {
      response.status(400).send({ msg: "bad request" });
    }
  } else {
    next(err);
  }
};

exports.handle500Errors = (error, request, response, next) => {
  console.log(error, "<--- unknown server error");
  response.status(500).send({ msg: "Server Error" });
};

exports.handlePathNotFound = (request, response) => {
  response.status(404).send({ msg: "Path not found" });
};
