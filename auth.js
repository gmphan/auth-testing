'use strict';

const Hapi = require('hapi');
const Bcrypt = require('bcrypt')

// hardcoded users object … just for illustration purposes
var users = {
  future: {
    id: '1',
    username: 'future',
    password: '$2a$04$YPy8WdAtWswed8b9MfKixebJkVUhEZxQCrExQaxzhcdR2xMmpSJiG'  // 'studio'
  }
}




// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});



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
    server.route({
        method: 'GET',
        path:'/hello',
        handler: function (request, reply) {

            return reply('hello world');
        }
    });

  }
})


// register plugins to server instance
server.register(BasicAuth, function (err) {

  server.auth.strategy('simple', 'basic', { validateFunc: // TODO })

})


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
