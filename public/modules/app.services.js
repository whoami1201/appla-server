angular.module('app.services', []).
    factory('mSocket', function (socketFactory) {
        var mSocket = socketFactory();
        return mSocket;
    });
