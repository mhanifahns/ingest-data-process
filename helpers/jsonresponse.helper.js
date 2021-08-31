const jsonresponse = function (status, data, msg, params) {
    let message = {}
    message[200] = 'OK';
    message[400] = 'Bad Request';
    message[404] = 'Not Found';
    message[401] = 'Unauthorized';
    message[204] = 'No Content';
    message[201] = 'Data Created';
    message[500] = 'Internal Server Error';
  
    return {
      status: status,
      message: (msg ? msg : message[status]),
      data: data,
      params: params
    }
  }
  
  module.exports = jsonresponse;