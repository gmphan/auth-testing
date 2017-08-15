'use strict';

const Hapi = require('hapi');
const Bcrypt = require('bcrypt')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// hardcoded users object … just for illustration purposes
const users = {
    john: {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
};

/**+++++++++++ start validating ++++++++++++++**/
const validate = function (request, username, password, callback) {
    const user = users[username];
    if (!user) {
        return callback(null, false);
    }

    //compare bcrypt vs user password
    Bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, { id: user.id, name: user.name });
    });
};
/**------------- end validating --------------**/

/**+++++register auth and route for auth+++++++++++++++++++**/
//register server with hapi-auth-basic scheme auth plugins, and this has a default scheme
//named 'basic'
server.register(require('hapi-auth-basic'), (err)=>{
  if(err){
    throw err;
  }

  //'simple' is what we name our strategy (we name it however we want), 'basic'
  //has to be named exact which was created through server.auth.scheme().
  server.auth.strategy('simple', 'basic', {validateFunc:validate});

  server.route({
        method: 'GET',
        path: '/auth',
        config: {
            auth: 'simple', //tell the route to use 'simple' strategy
            handler: function (request, reply) {
                reply('hello, ' + request.auth.credentials.name);
            }
        }
    });
})
/**-------- End auth and route for auth ----------------**/



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


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
