'use strict';

const Hapi = require('hapi');
const Bcrypt = require('bcrypt')
const Basic = require('hapi-auth-basic');

// hardcoded users object … just for illustration purposes




// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});


/********* start validating ***********/
const users = {
    john: {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
};


const validate = function (request, username, password, callback) {
    const user = users[username];
    if (!user) {
        return callback(null, false);
    }
    Bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, { id: user.id, name: user.name });
    });
};


server.register(Basic, (err)=>{
  if(err){
    throw err;
  }
  server.auth.strategy('simple', 'basic', {validateFunc:validate});

  server.route({
        method: 'GET',
        path: '/auth',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                reply('hello, ' + request.auth.credentials.name);
            }
        }
    });


})

/********** end validating *******************/


server.register(require('inert'), (err)=>{
  if(err){
    throw err
  }else{
    server.route({
        method: 'GET',
        path:'/',
        handler: function (request, reply) {
            reply.file('index.html');
        }
    });
  }
})

server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, reply) {

        return reply('hello world');
    }
});


// register plugins to server instance
// server.register(BasicAuth, function (err) {
//
//   server.auth.strategy('simple', 'basic', { validateFunc: // TODO })
//
// })


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
