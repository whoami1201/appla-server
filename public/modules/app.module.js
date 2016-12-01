angular.module('app', [
    'ui.router',
    'auth.module',
    'home.module',
    'ngMessages'
    ]).constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        signupSuccess: 'auth-signup-success',
        signupFailed: 'auth-signup-failed'
    });
