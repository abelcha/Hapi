var todoist = require('node-todoist')
todoist.login({
        email: 'abel@chalier.me',
        password: "kvx26tEb"
    })
    .then(function(user) {
            console.log(user)
        },
        function(e) {
            console.error(e);
        });
