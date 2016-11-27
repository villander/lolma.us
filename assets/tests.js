'use strict';

define('lolma-us/tests/adapters/_markdown.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - adapters/_markdown.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/_markdown.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/adapters/application.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - adapters/application.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/adapters/markdown-block.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - adapters/markdown-block.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/markdown-block.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/adapters/project-info.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - adapters/project-info.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/project-info.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/adapters/stackoverflow-user.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - adapters/stackoverflow-user.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/stackoverflow-user.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/adapters/website.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - adapters/website.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/website.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/authenticators/torii.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - authenticators/torii.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authenticators/torii.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/helpers/array.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/array.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/array.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('lolma-us/tests/helpers/destroy-app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/destroy-app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/helpers/ember-i18n/test-helpers', ['exports', 'ember'], function (exports, _ember) {

  // example usage: find(`.header:contains(${t('welcome_message')})`)
  _ember['default'].Test.registerHelper('t', function (app, key, interpolations) {
    var i18n = app.__container__.lookup('service:i18n');
    return i18n.t(key, interpolations);
  });

  // example usage: expectTranslation('.header', 'welcome_message');
  _ember['default'].Test.registerHelper('expectTranslation', function (app, element, key, interpolations) {
    var text = app.testHelpers.t(key, interpolations);

    assertTranslation(element, key, text);
  });

  var assertTranslation = (function () {
    if (typeof QUnit !== 'undefined' && typeof ok === 'function') {
      return function (element, key, text) {
        ok(find(element + ':contains(' + text + ')').length, 'Found translation key ' + key + ' in ' + element);
      };
    } else if (typeof expect === 'function') {
      return function (element, key, text) {
        var found = !!find(element + ':contains(' + text + ')').length;
        expect(found).to.equal(true);
      };
    } else {
      return function () {
        throw new Error("ember-i18n could not find a compatible test framework");
      };
    }
  })();
});
define('lolma-us/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, _emberSimpleAuthAuthenticatorsTest) {
  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;

  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _emberSimpleAuthAuthenticatorsTest['default']);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  ;

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  ;

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }

  ;
});
define('lolma-us/tests/helpers/is-nully.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/is-nully.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/is-nully.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'lolma-us/tests/helpers/start-app', 'lolma-us/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _lolmaUsTestsHelpersStartApp, _lolmaUsTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _lolmaUsTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _lolmaUsTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('lolma-us/tests/helpers/module-for-acceptance.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/module-for-acceptance.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/helpers/resolver', ['exports', 'lolma-us/resolver', 'lolma-us/config/environment'], function (exports, _lolmaUsResolver, _lolmaUsConfigEnvironment) {

  var resolver = _lolmaUsResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _lolmaUsConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _lolmaUsConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('lolma-us/tests/helpers/resolver.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/resolver.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/helpers/start-app', ['exports', 'ember', 'lolma-us/app', 'lolma-us/config/environment'], function (exports, _ember, _lolmaUsApp, _lolmaUsConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _lolmaUsConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override

    _ember['default'].run(function () {
      application = _lolmaUsApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('lolma-us/tests/helpers/start-app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/start-app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/helpers/torii', ['exports'], function (exports) {
  exports.stubValidSession = stubValidSession;

  function stubValidSession(application, sessionData) {
    var session = application.__container__.lookup('service:session');
    var sm = session.get('stateMachine');
    Ember.run(function () {
      sm.send('startOpen');
      sm.send('finishOpen', sessionData);
    });
  }
});
define('lolma-us/tests/initializers/store-push-payload.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - initializers/store-push-payload.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/store-push-payload.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/instance-initializers/browser/ember-data-fastboot.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - instance-initializers/browser/ember-data-fastboot.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'instance-initializers/browser/ember-data-fastboot.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/instance-initializers/fastboot/ember-data-fastboot.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - instance-initializers/fastboot/ember-data-fastboot.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'instance-initializers/fastboot/ember-data-fastboot.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/locales/en/translations.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - locales/en/translations.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'locales/en/translations.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/locales/ru/translations.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - locales/ru/translations.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'locales/ru/translations.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/models/markdown-block.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - models/markdown-block.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/markdown-block.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/models/project-info.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - models/project-info.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/project-info.js should pass ESLint.\n3:9  - \'belongsTo\' is defined but never used. (no-unused-vars)\n4:26  - \'or\' is defined but never used. (no-unused-vars)');
  });
});
define('lolma-us/tests/models/project.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - models/project.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/project.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/models/stackoverflow-user.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - models/stackoverflow-user.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/stackoverflow-user.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/models/website.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - models/website.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/website.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/application/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/application/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/application/route.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/hero-header/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/hero-header/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/hero-header/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/locale-switcher/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/locale-switcher/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/locale-switcher/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/markdown-block/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/markdown-block/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/markdown-block/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/online-presence/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/online-presence/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/online-presence/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/pro-ject/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/pro-ject/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/pro-ject/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/pro-jects/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/pro-jects/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/pro-jects/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/project-group/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/project-group/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/project-group/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/sec-tion/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/sec-tion/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/sec-tion/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/star-button/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/star-button/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/star-button/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/components/time-line/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/components/time-line/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/time-line/component.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/index/route.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/locale/index/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/locale/index/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/locale/index/controller.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/locale/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/locale/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/locale/index/route.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/pods/locale/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - pods/locale/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/locale/route.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/resolver.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - resolver.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/router.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - router.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/serializers/_markdown.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - serializers/_markdown.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/_markdown.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/serializers/application.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - serializers/application.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/application.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/serializers/markdown-block.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - serializers/markdown-block.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/markdown-block.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/serializers/project-info.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - serializers/project-info.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/project-info.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/serializers/project.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - serializers/project.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/project.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/serializers/stackoverflow-user.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - serializers/stackoverflow-user.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/stackoverflow-user.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/services/config.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - services/config.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/config.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/services/cookies.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - services/cookies.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/cookies.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/services/i18n.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - services/i18n.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/i18n.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/session-stores/application.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - session-stores/application.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'session-stores/application.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/test-helper', ['exports', 'lolma-us/tests/helpers/resolver', 'ember-qunit'], function (exports, _lolmaUsTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_lolmaUsTestsHelpersResolver['default']);
});
define('lolma-us/tests/test-helper.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - test-helper.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/torii-providers/github-oauth2.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - torii-providers/github-oauth2.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'torii-providers/github-oauth2.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/utils/fetch-github.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - utils/fetch-github.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/fetch-github.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/utils/fetch-rsvp.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - utils/fetch-rsvp.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/fetch-rsvp.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/utils/random-string.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - utils/random-string.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/random-string.js should pass ESLint.\n');
  });
});
define('lolma-us/tests/utils/wait.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - utils/wait.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/wait.js should pass ESLint.\n');
  });
});
/* jshint ignore:start */

require('lolma-us/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map
