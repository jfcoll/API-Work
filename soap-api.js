const soap = require('soap');
const http = require('http');
const fs = require('fs')

// define soap service and its methods
const service = {
  CourseService: {
    CourseServicePort: {
      GetCourse(args) {
        // return a response using the provided arguments
        return { name: `SOAP Course: ${args.id}` };
      }
    }
  }
};

// read the wsdl file that describes the SOAP service
const xml = fs.readFileSync('course.wsdl', 'utf8');

// create a basic HTTP servers that responds with '404: Not Found' for all requests
const server = http.createServer(function (req, res) {
  res.end('404: Not Found');
});

// Attach the SOAP service to the server at path '/wsdl'
soap.listen(server, '/wsdl', service, xml);
server.listen(3002, () => console.log('SOAP API running on port 3002'));
