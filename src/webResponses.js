
const webResponse = (request, response, status, object) => {
  response.writeHead(status, { 'content-type': object.type });

  if (object.type === 'application/xml' || object.type === 'application/html') {
    response.write(object.message);
  } else {
    response.write(JSON.stringify(object));
  }
  response.end();
};

const formatContent = (request, responseContent) => {
  const objToReturn = responseContent;
  if (request.headers.accept.includes('application/xml')) {
    objToReturn.type = 'application/xml';
    objToReturn.message = `
      <response>
        <message>${objToReturn.message}</message>
        ${objToReturn.id ? `<id>${objToReturn.id}</id>` : ''}
      </response>`;

    return objToReturn;
  }
  objToReturn.type = 'application/json';

  return objToReturn;
};

// Handle each status
const success = (request, response) => {
  const obj = formatContent(request, {
    message: 'This is a successful response.',
  });

  webResponse(request, response, 200, obj);
};

const badRequest = (request, response, params) => {
  if (!params.valid || params.valid !== 'true') {
    const obj = formatContent(request, {
      id: 'badRequest',
      message: 'Missing valid query parameter set to true.',
    });

    return webResponse(request, response, 400, obj);
  }

  const obj = (request, {
    id: 'notFound',
    message: 'This request has the required parameters.',
  });

  return webResponse(request, response, 200, obj);
};

const unauthorized = (request, response, params) => {
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    const obj = formatContent(request, {
      id: 'notFound',
      message: 'Missing loggedIn query parameter set to yes.',
    });

    return webResponse(request, response, 401, obj);
  }

  const obj = formatContent(request, {
    id: 'unauthorized',
    message: 'This request has the required parameters.',
  });

  return webResponse(request, response, 200, obj);
};

const forbidden = (request, response) => {
  const obj = formatContent(request, {
    id: 'forbidden',
    message: 'You do not have access to this content.',
  });

  webResponse(request, response, 403, obj);
};

const internal = (request, response) => {
  const obj = formatContent(request, {
    id: 'internal',
    message: 'Internal Server Error. Something went wrong.',
  });

  webResponse(request, response, 500, obj);
};

const notImplemented = (request, response) => {
  const obj = formatContent(request, {
    id: 'notImplemented',
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
  });

  webResponse(request, response, 501, obj);
};

const notFound = (request, response) => {
  const obj = formatContent(request, {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  });

  webResponse(request, response, 404, obj);
};

module.exports = {
  success,
  badRequest,
  forbidden,
  internal,
  unauthorized,
  notImplemented,
  notFound,
};
