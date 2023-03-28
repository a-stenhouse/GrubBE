exports.customErrors = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.hanlde500Errors = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Server Error" });
};

exports.handlePathNotFound = (request, response) => {
  response.status(404).send({ msg: "Path not found" });
};
