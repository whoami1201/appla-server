angular.module('app.services', [])
    .factory('mSocket', function (socketFactory, $window) {
        return socketFactory({
            ioSocket: io.connect('', {query: "token=" + $window.localStorage.accessToken}),
            prefix: ''
        });
    })
    .factory('roomSocket', function(socketFactory) {
        return socketFactory({
            ioSocket: io.connect('/rooms'),
            prefix: ''
        });
    });
