'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();
var Inert = require('inert');
var Path = require('path');
var Vision = require('vision');
var H2o2 = require('h2o2');
var fs = require('fs');
var rot13 = require('rot13-transform');
var Joi = require('joi');

server.connection({
  host: 'localhost',
  port: Number(process.argv[2] || 8080)
});

server.register(Inert, function(err) {
  if (err) throw err;
});

server.register(Vision, function(err) {
  if (err) {
    throw err;
  }
});

server.register(H2o2, function(err) {
  if (err) throw err;
});

// server.views({
//   engines:{
//     html: require('handlebars')
//   },
//   path: Path.join(__dirname, 'templates'),
//   helpersPath: 'helpers'
// });

// server.route({
//   path: '/',
//   method: 'GET',
//   // view: 'index.html',
//   handler: home
// })

// server.route({
//   path: '/{name}',
//   method: 'GET',
//   handler: name
// })
//
// server.route({
//   path: '/foo/bar/baz/{filename}',
//   method: 'GET',
//   handler: {
//     directory: {
//       path: Path.join(__dirname, 'public')
//     }
//   }
// })
//
// server.route({
//   path: '/proxy',
//   method: 'GET',
//   handler: {
//     proxy: {
//       host: '127.0.0.1',
//       port: 65535
//     }
//   }
// })

// server.route({
//   path: '/chickens/{breed}',
//   method: 'GET',
//   handler: function (request, reply) {
//                   reply('You asked for the chicken ' + request.params.breed);
//               },
//   config:{
//     validate:{
//       params:{
//         breed: Joi.string().required()
//       }
//     }
//   }
// });

// server.route({
//   path: '/login',
//   method: 'POST',
//   handler: function(request, reply) {
//     reply('login successful');
//   },
//   config: {
//     validate: {
//       payload: Joi.object({
//         isGuest: Joi.boolean().required(),
//         username: Joi.string().when('isGuest', {is: false, then: Joi.required()}),
//         password: Joi.string().alphanum(),
//         accessToken: Joi.string().alphanum(),
//       })
//       .options({allowUnknown: true})
//       .without('password', 'accessToken')
//     }
//   }
// })

server.route({
  path: '/upload',
  method: 'POST',
  config: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    handler: chunk
  }
});

// function home (request, reply) {
//   var file = fs.createReadStream(__dirname + '/stream.html')
//                .pipe(rot13());
//   reply(file);
// }
//
// function name(request, reply) {
//   reply('Hello ' + encodeURIComponent(request.params.name));
// }

function chunk(request, reply) {
  var body = '';
  request.payload.file.on('data', function(data) {
    body += data;
  });
  request.payload.file.on('end', function() {
    console.log(body);
    var result = {
      description: request.payload.description,
      file: {
        data: body,
        filename: request.payload.hapi.filename,
        headers: request.payload.hapi.headers
      }
    }
    console.log(result);
    reply(JSON.stringify(result));
});
}
server.start(function() {
  console.log('server running at:', server.info.uri);
});
