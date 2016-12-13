angular.module('app.services', [])
    .factory('mSocket', function (socketFactory) {
        return socketFactory({
            prefix: ''
        });
    })
    .factory('roomSocket', function(socketFactory) {
        return socketFactory({
            ioSocket: io.connect('/rooms'),
            prefix: ''
        });
    });
