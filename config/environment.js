/* jshint node: true */

module.exports = function (env) {
  var ENV = {
    modulePrefix: 'lolma-us',
    podModulePrefix: 'lolma-us/pods',
    environment: env,
    rootURL: '/',
    locationType: 'auto',

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
        // 'ds-pushpayload-return': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    i18n: {
      defaultLocale: 'en',
    },

    fastboot: {
      hostWhitelist: [
        '/',
        'http://127.0.0.1:8081'
      ],
    },

    torii: {
      providers: {
        'github-oauth2': {
          apiKey:      process.env.LMS_GITHUB_CLIENT_ID,
          redirectUri: 'http://localhost:4200/oauth-accept',
          scope:       'public_repo',
        }
      }
    },
  }

  if (env === 'development') {
    // ENV.APP.LOG_RESOLVER = true
    // ENV.APP.LOG_ACTIVE_GENERATION = true
    // ENV.APP.LOG_TRANSITIONS = true
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true
    // ENV.APP.LOG_VIEW_LOOKUPS = true
  }

  if (env === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none'

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    ENV.APP.rootElement = '#ember-testing'
  }

  if (env === 'production') {

  }

  return ENV
}
