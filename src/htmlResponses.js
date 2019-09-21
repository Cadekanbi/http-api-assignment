const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const js = fs.readFileSync(`${__dirname}/../client/client.js`);

const responseHead = (request, response, code, type, file) => {
  response.writeHead(code, { 'Content-Type': type });
  response.write(file);
  response.end();
};

const getIndex = (request, response) => {
  responseHead(request, response, 200, 'text/html', index);
};

const getCSS = (request, response) => {
  responseHead(request, response, 200, 'text/css', css);
};

const getJS = (request, response) => {
  responseHead(request, response, 200, 'text/javascript', js);
};

module.exports = {
  getIndex,
  getCSS,
  getJS,
};
