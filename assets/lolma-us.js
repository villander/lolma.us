"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('lolma-us/adapters/_markdown', ['exports', 'ember-data/adapter', 'ember-service/inject', 'ember-computed', 'lolma-us/utils/fetch-rsvp', 'ember'], function (exports, _emberDataAdapter, _emberServiceInject, _emberComputed, _lolmaUsUtilsFetchRsvp, _ember) {
  var inflector = _ember['default'].Inflector.inflector;
  exports['default'] = _emberDataAdapter['default'].extend({

    // ----- Services -----
    config: (0, _emberServiceInject['default'])(),

    // ----- Overridden properties -----
    defaultSerializer: '_markdown',

    // ----- Custom properties -----
    host: (0, _emberComputed.reads)('config.contentApiHost'),
    namespace: (0, _emberComputed.reads)('config.namespace'),

    // ----- Overridden methods -----
    findRecord: function findRecord(store, type, id, snapshot) {
      var host = this.get('host');
      var modelName = inflector.pluralize(type.modelName);
      var url = host + '/content/' + modelName + '/' + id + '.md';

      return (0, _lolmaUsUtilsFetchRsvp.fetchRsvpText)(url);
    }
  });
});
define('lolma-us/adapters/application', ['exports', 'ember-data/adapters/rest', 'ember-service/inject', 'ember-computed'], function (exports, _emberDataAdaptersRest, _emberServiceInject, _emberComputed) {
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  exports['default'] = _emberDataAdaptersRest['default'].extend({

    // ----- Services -----
    config: (0, _emberServiceInject['default'])(),

    // ----- Overridden properties -----
    host: (0, _emberComputed.reads)('config.contentApiHost'),
    namespace: (0, _emberComputed.reads)('config.namespace'),

    // ----- Overridden methods -----
    urlForFindRecord: function urlForFindRecord(id, modelName, snapshot) {
      return this._super(id, modelName, snapshot) + '.json';
    },

    findRecord: function findRecord(store, type, id, snapshot) {
      return this._super(store, type, id, snapshot).then(function (response) {
        return _extends({}, response, { id: id });
      });
    }
  });
});
define('lolma-us/adapters/markdown-block', ['exports', 'lolma-us/adapters/_markdown'], function (exports, _lolmaUsAdapters_markdown) {
  exports['default'] = _lolmaUsAdapters_markdown['default'].extend({});
});
define('lolma-us/adapters/project-info', ['exports', 'ember-data/adapter', 'lolma-us/utils/fetch-github', 'rsvp', 'npm:lodash', 'ember-service/inject'], function (exports, _emberDataAdapter, _lolmaUsUtilsFetchGithub, _rsvp, _npmLodash, _emberServiceInject) {
  exports['default'] = _emberDataAdapter['default'].extend({

    // ----- Services -----
    session: (0, _emberServiceInject['default'])(),

    // ----- Overridden methods -----
    findRecord: function findRecord(store, type, id, snapshot) {
      var session = this.get('session');
      var url = 'repos/' + id;

      return (0, _lolmaUsUtilsFetchGithub['default'])(url, session);
    },

    findAll: function findAll(store, type, sinceToken, snapshotRecordArray) {
      var session = this.get('session');

      // Fetch user info with repo count
      return (0, _lolmaUsUtilsFetchGithub['default'])('users/lolmaus', session)

      // Fetch repos in batches of 100
      .then(function (_ref) {
        var public_repos = _ref.public_repos;
        return _rsvp['default'].all(_npmLodash['default'].times(Math.ceil(public_repos / 100), function (i) {
          return (0, _lolmaUsUtilsFetchGithub['default'])('users/lolmaus/repos?per_page=100&page=' + (i + 1), session);
        }));
      })

      // Join repo batches into a single array of batches
      .then(function (projectInfoBatches) {
        return projectInfoBatches.reduce(function (a, b) {
          return a.concat(b);
        }, []);
      }); //flatten

      // .then(projectInfos => (console.log('projectInfos', projectInfos), projectInfos))
    },

    shouldBackgroundReloadAll: function shouldBackgroundReloadAll() {
      return false;
    },
    shouldBackgroundReloadRecord: function shouldBackgroundReloadRecord() {
      return false;
    },
    shouldReloadAll: function shouldReloadAll() {
      return true;
    },
    shouldReloadRecord: function shouldReloadRecord() {
      return true;
    }
  });
});
define('lolma-us/adapters/stackoverflow-user', ['exports', 'ember-data/adapter', 'lolma-us/utils/fetch-rsvp'], function (exports, _emberDataAdapter, _lolmaUsUtilsFetchRsvp) {
  exports['default'] = _emberDataAdapter['default'].extend({

    // ----- Overridden methods -----
    findRecord: function findRecord(store, type, id, snapshot) {
      var url = 'https://api.stackexchange.com/2.2/users/' + id + '?site=stackoverflow';
      return (0, _lolmaUsUtilsFetchRsvp['default'])(url);
    }
  });
});
define('lolma-us/adapters/website', ['exports', 'lolma-us/adapters/application'], function (exports, _lolmaUsAdaptersApplication) {
  exports['default'] = _lolmaUsAdaptersApplication['default'].extend({

    // ----- Overridden methods -----
    pathForType: function pathForType() /*modelName*/{
      return '';
    }
  });
});
define('lolma-us/app', ['exports', 'ember', 'lolma-us/resolver', 'ember-load-initializers', 'lolma-us/config/environment'], function (exports, _ember, _lolmaUsResolver, _emberLoadInitializers, _lolmaUsConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _lolmaUsConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _lolmaUsConfigEnvironment['default'].podModulePrefix,
    Resolver: _lolmaUsResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _lolmaUsConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('lolma-us/authenticators/torii', ['exports', 'ember-simple-auth/authenticators/torii', 'ember-service/inject', 'lolma-us/utils/fetch-rsvp', 'rsvp'], function (exports, _emberSimpleAuthAuthenticatorsTorii, _emberServiceInject, _lolmaUsUtilsFetchRsvp, _rsvp) {
  exports['default'] = _emberSimpleAuthAuthenticatorsTorii['default'].extend({

    // ----- Services -----
    config: (0, _emberServiceInject['default'])(),
    torii: (0, _emberServiceInject['default'])(),

    // ----- Overridden methods -----
    authenticate: function authenticate(provider, options) {
      var _this = this;

      this._assertToriiIsPresent();

      var gatekeeperUrl = this.get('config.gatekeeperUrl');

      return this.get('torii').open(provider, options || {}).then(function (response) {
        var url = gatekeeperUrl + '/authenticate/' + response.authorizationCode;
        return (0, _lolmaUsUtilsFetchRsvp['default'])(url);
      }).then(function (data) {
        if (data.error) return _rsvp['default'].reject(data);
        return data;
      }).then(function (data) {
        return _this._authenticateWithProvider(provider, data), data;
      });
    }
  });
});
define('lolma-us/components/deferred-content', ['exports', 'ember-deferred-content/components/deferred-content'], function (exports, _emberDeferredContentComponentsDeferredContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberDeferredContentComponentsDeferredContent['default'];
    }
  });
});
define('lolma-us/components/deferred-content/fulfilled-content', ['exports', 'ember-deferred-content/components/deferred-content/fulfilled-content'], function (exports, _emberDeferredContentComponentsDeferredContentFulfilledContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberDeferredContentComponentsDeferredContentFulfilledContent['default'];
    }
  });
});
define('lolma-us/components/deferred-content/pending-content', ['exports', 'ember-deferred-content/components/deferred-content/pending-content'], function (exports, _emberDeferredContentComponentsDeferredContentPendingContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberDeferredContentComponentsDeferredContentPendingContent['default'];
    }
  });
});
define('lolma-us/components/deferred-content/rejected-content', ['exports', 'ember-deferred-content/components/deferred-content/rejected-content'], function (exports, _emberDeferredContentComponentsDeferredContentRejectedContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberDeferredContentComponentsDeferredContentRejectedContent['default'];
    }
  });
});
define('lolma-us/components/deferred-content/settled-content', ['exports', 'ember-deferred-content/components/deferred-content/settled-content'], function (exports, _emberDeferredContentComponentsDeferredContentSettledContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberDeferredContentComponentsDeferredContentSettledContent['default'];
    }
  });
});
define('lolma-us/components/head-content', ['exports', 'ember', 'lolma-us/templates/head'], function (exports, _ember, _lolmaUsTemplatesHead) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: '',
    model: _ember['default'].inject.service('head-data'),
    layout: _lolmaUsTemplatesHead['default']
  });
});
define('lolma-us/components/head-layout', ['exports', 'ember', 'ember-cli-head/templates/components/head-layout'], function (exports, _ember, _emberCliHeadTemplatesComponentsHeadLayout) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: '',
    layout: _emberCliHeadTemplatesComponentsHeadLayout['default']
  });
});
define('lolma-us/components/link-to', ['exports', 'ember-cli-staticboot/components/link-to'], function (exports, _emberCliStaticbootComponentsLinkTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliStaticbootComponentsLinkTo['default'];
    }
  });
});
define('lolma-us/components/markdown-to-html', ['exports', 'ember-cli-showdown/components/markdown-to-html'], function (exports, _emberCliShowdownComponentsMarkdownToHtml) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliShowdownComponentsMarkdownToHtml['default'];
    }
  });
});
define('lolma-us/components/torii-iframe-placeholder', ['exports', 'torii/components/torii-iframe-placeholder'], function (exports, _toriiComponentsToriiIframePlaceholder) {
  exports['default'] = _toriiComponentsToriiIframePlaceholder['default'];
});
define('lolma-us/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/app-version', ['exports', 'ember', 'lolma-us/config/environment'], function (exports, _ember, _lolmaUsConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _lolmaUsConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('lolma-us/helpers/append', ['exports', 'ember-composable-helpers/helpers/append'], function (exports, _emberComposableHelpersHelpersAppend) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend['default'];
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend.append;
    }
  });
});
define('lolma-us/helpers/array', ['exports', 'ember-helper'], function (exports, _emberHelper) {
  exports.array = array;

  function array(params /*, hash*/) {
    return params;
  }

  exports['default'] = (0, _emberHelper.helper)(array);
});
define('lolma-us/helpers/camelize', ['exports', 'ember-composable-helpers/helpers/camelize'], function (exports, _emberComposableHelpersHelpersCamelize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCamelize['default'];
    }
  });
  Object.defineProperty(exports, 'camelize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCamelize.camelize;
    }
  });
});
define('lolma-us/helpers/capitalize', ['exports', 'ember-composable-helpers/helpers/capitalize'], function (exports, _emberComposableHelpersHelpersCapitalize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCapitalize['default'];
    }
  });
  Object.defineProperty(exports, 'capitalize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCapitalize.capitalize;
    }
  });
});
define('lolma-us/helpers/chunk', ['exports', 'ember-composable-helpers/helpers/chunk'], function (exports, _emberComposableHelpersHelpersChunk) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk['default'];
    }
  });
  Object.defineProperty(exports, 'chunk', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk.chunk;
    }
  });
});
define('lolma-us/helpers/classify', ['exports', 'ember-composable-helpers/helpers/classify'], function (exports, _emberComposableHelpersHelpersClassify) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersClassify['default'];
    }
  });
  Object.defineProperty(exports, 'classify', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersClassify.classify;
    }
  });
});
define('lolma-us/helpers/compact', ['exports', 'ember-composable-helpers/helpers/compact'], function (exports, _emberComposableHelpersHelpersCompact) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact['default'];
    }
  });
  Object.defineProperty(exports, 'compact', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact.compact;
    }
  });
});
define('lolma-us/helpers/compute', ['exports', 'ember-composable-helpers/helpers/compute'], function (exports, _emberComposableHelpersHelpersCompute) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute['default'];
    }
  });
  Object.defineProperty(exports, 'compute', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute.compute;
    }
  });
});
define('lolma-us/helpers/contains', ['exports', 'ember-composable-helpers/helpers/contains'], function (exports, _emberComposableHelpersHelpersContains) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains['default'];
    }
  });
  Object.defineProperty(exports, 'contains', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains.contains;
    }
  });
});
define('lolma-us/helpers/dasherize', ['exports', 'ember-composable-helpers/helpers/dasherize'], function (exports, _emberComposableHelpersHelpersDasherize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDasherize['default'];
    }
  });
  Object.defineProperty(exports, 'dasherize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDasherize.dasherize;
    }
  });
});
define('lolma-us/helpers/dec', ['exports', 'ember-composable-helpers/helpers/dec'], function (exports, _emberComposableHelpersHelpersDec) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec['default'];
    }
  });
  Object.defineProperty(exports, 'dec', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec.dec;
    }
  });
});
define('lolma-us/helpers/drop', ['exports', 'ember-composable-helpers/helpers/drop'], function (exports, _emberComposableHelpersHelpersDrop) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop['default'];
    }
  });
  Object.defineProperty(exports, 'drop', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop.drop;
    }
  });
});
define('lolma-us/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/filter-by', ['exports', 'ember-composable-helpers/helpers/filter-by'], function (exports, _emberComposableHelpersHelpersFilterBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy['default'];
    }
  });
  Object.defineProperty(exports, 'filterBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy.filterBy;
    }
  });
});
define('lolma-us/helpers/filter', ['exports', 'ember-composable-helpers/helpers/filter'], function (exports, _emberComposableHelpersHelpersFilter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter['default'];
    }
  });
  Object.defineProperty(exports, 'filter', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter.filter;
    }
  });
});
define('lolma-us/helpers/find-by', ['exports', 'ember-composable-helpers/helpers/find-by'], function (exports, _emberComposableHelpersHelpersFindBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy['default'];
    }
  });
  Object.defineProperty(exports, 'findBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy.findBy;
    }
  });
});
define('lolma-us/helpers/flatten', ['exports', 'ember-composable-helpers/helpers/flatten'], function (exports, _emberComposableHelpersHelpersFlatten) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten['default'];
    }
  });
  Object.defineProperty(exports, 'flatten', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten.flatten;
    }
  });
});
define('lolma-us/helpers/group-by', ['exports', 'ember-composable-helpers/helpers/group-by'], function (exports, _emberComposableHelpersHelpersGroupBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersGroupBy['default'];
    }
  });
  Object.defineProperty(exports, 'groupBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersGroupBy.groupBy;
    }
  });
});
define('lolma-us/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/has-next', ['exports', 'ember-composable-helpers/helpers/has-next'], function (exports, _emberComposableHelpersHelpersHasNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext['default'];
    }
  });
  Object.defineProperty(exports, 'hasNext', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext.hasNext;
    }
  });
});
define('lolma-us/helpers/has-previous', ['exports', 'ember-composable-helpers/helpers/has-previous'], function (exports, _emberComposableHelpersHelpersHasPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'hasPrevious', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious.hasPrevious;
    }
  });
});
define('lolma-us/helpers/html-safe', ['exports', 'ember-composable-helpers/helpers/html-safe'], function (exports, _emberComposableHelpersHelpersHtmlSafe) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHtmlSafe['default'];
    }
  });
  Object.defineProperty(exports, 'htmlSafe', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHtmlSafe.htmlSafe;
    }
  });
});
define('lolma-us/helpers/inc', ['exports', 'ember-composable-helpers/helpers/inc'], function (exports, _emberComposableHelpersHelpersInc) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc['default'];
    }
  });
  Object.defineProperty(exports, 'inc', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc.inc;
    }
  });
});
define('lolma-us/helpers/intersect', ['exports', 'ember-composable-helpers/helpers/intersect'], function (exports, _emberComposableHelpersHelpersIntersect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect['default'];
    }
  });
  Object.defineProperty(exports, 'intersect', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect.intersect;
    }
  });
});
define('lolma-us/helpers/invoke', ['exports', 'ember-composable-helpers/helpers/invoke'], function (exports, _emberComposableHelpersHelpersInvoke) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke['default'];
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke.invoke;
    }
  });
});
define('lolma-us/helpers/is-after', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/is-after'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersIsAfter) {
  exports['default'] = _emberMomentHelpersIsAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/is-before', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/is-before'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersIsBefore) {
  exports['default'] = _emberMomentHelpersIsBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/is-between', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/is-between'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersIsBetween) {
  exports['default'] = _emberMomentHelpersIsBetween['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/is-nully', ['exports', 'ember-helper'], function (exports, _emberHelper) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports.isNully = isNully;

  function isNully(_ref /*, hash*/) {
    var _ref2 = _slicedToArray(_ref, 1);

    var value = _ref2[0];

    return value == null;
  }

  exports['default'] = (0, _emberHelper.helper)(isNully);
});
define('lolma-us/helpers/is-same-or-after', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersIsSameOrAfter) {
  exports['default'] = _emberMomentHelpersIsSameOrAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/is-same-or-before', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/is-same-or-before'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersIsSameOrBefore) {
  exports['default'] = _emberMomentHelpersIsSameOrBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/is-same', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/is-same'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersIsSame) {
  exports['default'] = _emberMomentHelpersIsSame['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/join', ['exports', 'ember-composable-helpers/helpers/join'], function (exports, _emberComposableHelpersHelpersJoin) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin['default'];
    }
  });
  Object.defineProperty(exports, 'join', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin.join;
    }
  });
});
define('lolma-us/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/map-by', ['exports', 'ember-composable-helpers/helpers/map-by'], function (exports, _emberComposableHelpersHelpersMapBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy['default'];
    }
  });
  Object.defineProperty(exports, 'mapBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy.mapBy;
    }
  });
});
define('lolma-us/helpers/map', ['exports', 'ember-composable-helpers/helpers/map'], function (exports, _emberComposableHelpersHelpersMap) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap['default'];
    }
  });
  Object.defineProperty(exports, 'map', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap.map;
    }
  });
});
define('lolma-us/helpers/moment-add', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-add'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentAdd) {
  exports['default'] = _emberMomentHelpersMomentAdd['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-calendar', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-calendar'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentCalendar) {
  exports['default'] = _emberMomentHelpersMomentCalendar['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('lolma-us/helpers/moment-format', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-from-now', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-from', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-from'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentFrom) {
  exports['default'] = _emberMomentHelpersMomentFrom['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-subtract', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-subtract'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentSubtract) {
  exports['default'] = _emberMomentHelpersMomentSubtract['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-to-date', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-to-date'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentToDate) {
  exports['default'] = _emberMomentHelpersMomentToDate['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-to-now', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-to', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/helpers/moment-to'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentHelpersMomentTo) {
  exports['default'] = _emberMomentHelpersMomentTo['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('lolma-us/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('lolma-us/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _emberMomentHelpersMoment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMoment['default'];
    }
  });
});
define('lolma-us/helpers/next', ['exports', 'ember-composable-helpers/helpers/next'], function (exports, _emberComposableHelpersHelpersNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext['default'];
    }
  });
  Object.defineProperty(exports, 'next', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext.next;
    }
  });
});
define('lolma-us/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _emberMomentHelpersNow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersNow['default'];
    }
  });
});
define('lolma-us/helpers/object-at', ['exports', 'ember-composable-helpers/helpers/object-at'], function (exports, _emberComposableHelpersHelpersObjectAt) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt['default'];
    }
  });
  Object.defineProperty(exports, 'objectAt', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt.objectAt;
    }
  });
});
define('lolma-us/helpers/optional', ['exports', 'ember-composable-helpers/helpers/optional'], function (exports, _emberComposableHelpersHelpersOptional) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional['default'];
    }
  });
  Object.defineProperty(exports, 'optional', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional.optional;
    }
  });
});
define('lolma-us/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/helpers/pipe-action', ['exports', 'ember-composable-helpers/helpers/pipe-action'], function (exports, _emberComposableHelpersHelpersPipeAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipeAction['default'];
    }
  });
});
define('lolma-us/helpers/pipe', ['exports', 'ember-composable-helpers/helpers/pipe'], function (exports, _emberComposableHelpersHelpersPipe) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe['default'];
    }
  });
  Object.defineProperty(exports, 'pipe', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe.pipe;
    }
  });
});
define('lolma-us/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('lolma-us/helpers/previous', ['exports', 'ember-composable-helpers/helpers/previous'], function (exports, _emberComposableHelpersHelpersPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'previous', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious.previous;
    }
  });
});
define('lolma-us/helpers/queue', ['exports', 'ember-composable-helpers/helpers/queue'], function (exports, _emberComposableHelpersHelpersQueue) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue['default'];
    }
  });
  Object.defineProperty(exports, 'queue', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue.queue;
    }
  });
});
define('lolma-us/helpers/range', ['exports', 'ember-composable-helpers/helpers/range'], function (exports, _emberComposableHelpersHelpersRange) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange['default'];
    }
  });
  Object.defineProperty(exports, 'range', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange.range;
    }
  });
});
define('lolma-us/helpers/reduce', ['exports', 'ember-composable-helpers/helpers/reduce'], function (exports, _emberComposableHelpersHelpersReduce) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce['default'];
    }
  });
  Object.defineProperty(exports, 'reduce', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce.reduce;
    }
  });
});
define('lolma-us/helpers/reject-by', ['exports', 'ember-composable-helpers/helpers/reject-by'], function (exports, _emberComposableHelpersHelpersRejectBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy['default'];
    }
  });
  Object.defineProperty(exports, 'rejectBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy.rejectBy;
    }
  });
});
define('lolma-us/helpers/repeat', ['exports', 'ember-composable-helpers/helpers/repeat'], function (exports, _emberComposableHelpersHelpersRepeat) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat['default'];
    }
  });
  Object.defineProperty(exports, 'repeat', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat.repeat;
    }
  });
});
define('lolma-us/helpers/reverse', ['exports', 'ember-composable-helpers/helpers/reverse'], function (exports, _emberComposableHelpersHelpersReverse) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse['default'];
    }
  });
  Object.defineProperty(exports, 'reverse', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse.reverse;
    }
  });
});
define('lolma-us/helpers/route-action', ['exports', 'ember-route-action-helper/helpers/route-action'], function (exports, _emberRouteActionHelperHelpersRouteAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberRouteActionHelperHelpersRouteAction['default'];
    }
  });
});
define('lolma-us/helpers/shuffle', ['exports', 'ember-composable-helpers/helpers/shuffle'], function (exports, _emberComposableHelpersHelpersShuffle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle['default'];
    }
  });
  Object.defineProperty(exports, 'shuffle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle.shuffle;
    }
  });
});
define('lolma-us/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('lolma-us/helpers/slice', ['exports', 'ember-composable-helpers/helpers/slice'], function (exports, _emberComposableHelpersHelpersSlice) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice['default'];
    }
  });
  Object.defineProperty(exports, 'slice', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice.slice;
    }
  });
});
define('lolma-us/helpers/sort-by', ['exports', 'ember-composable-helpers/helpers/sort-by'], function (exports, _emberComposableHelpersHelpersSortBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy['default'];
    }
  });
  Object.defineProperty(exports, 'sortBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy.sortBy;
    }
  });
});
define('lolma-us/helpers/t', ['exports', 'ember-i18n/helper'], function (exports, _emberI18nHelper) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberI18nHelper['default'];
    }
  });
});
define('lolma-us/helpers/take', ['exports', 'ember-composable-helpers/helpers/take'], function (exports, _emberComposableHelpersHelpersTake) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake['default'];
    }
  });
  Object.defineProperty(exports, 'take', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake.take;
    }
  });
});
define('lolma-us/helpers/titleize', ['exports', 'ember-composable-helpers/helpers/titleize'], function (exports, _emberComposableHelpersHelpersTitleize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTitleize['default'];
    }
  });
  Object.defineProperty(exports, 'titleize', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTitleize.titleize;
    }
  });
});
define('lolma-us/helpers/toggle-action', ['exports', 'ember-composable-helpers/helpers/toggle-action'], function (exports, _emberComposableHelpersHelpersToggleAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggleAction['default'];
    }
  });
});
define('lolma-us/helpers/toggle', ['exports', 'ember-composable-helpers/helpers/toggle'], function (exports, _emberComposableHelpersHelpersToggle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle['default'];
    }
  });
  Object.defineProperty(exports, 'toggle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle.toggle;
    }
  });
});
define('lolma-us/helpers/truncate', ['exports', 'ember-composable-helpers/helpers/truncate'], function (exports, _emberComposableHelpersHelpersTruncate) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTruncate['default'];
    }
  });
  Object.defineProperty(exports, 'truncate', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTruncate.truncate;
    }
  });
});
define('lolma-us/helpers/underscore', ['exports', 'ember-composable-helpers/helpers/underscore'], function (exports, _emberComposableHelpersHelpersUnderscore) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnderscore['default'];
    }
  });
  Object.defineProperty(exports, 'underscore', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnderscore.underscore;
    }
  });
});
define('lolma-us/helpers/union', ['exports', 'ember-composable-helpers/helpers/union'], function (exports, _emberComposableHelpersHelpersUnion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion['default'];
    }
  });
  Object.defineProperty(exports, 'union', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion.union;
    }
  });
});
define('lolma-us/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('lolma-us/helpers/w', ['exports', 'ember-composable-helpers/helpers/w'], function (exports, _emberComposableHelpersHelpersW) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersW['default'];
    }
  });
  Object.defineProperty(exports, 'w', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersW.w;
    }
  });
});
define('lolma-us/helpers/without', ['exports', 'ember-composable-helpers/helpers/without'], function (exports, _emberComposableHelpersHelpersWithout) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout['default'];
    }
  });
  Object.defineProperty(exports, 'without', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout.without;
    }
  });
});
define('lolma-us/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('lolma-us/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'lolma-us/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _lolmaUsConfigEnvironment) {
  var _config$APP = _lolmaUsConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('lolma-us/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('lolma-us/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('lolma-us/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('lolma-us/initializers/ember-i18n', ['exports', 'ember-i18n/initializers/ember-i18n'], function (exports, _emberI18nInitializersEmberI18n) {
  exports['default'] = _emberI18nInitializersEmberI18n['default'];
});
define('lolma-us/initializers/ember-simple-auth', ['exports', 'ember', 'lolma-us/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberSimpleAuthConfiguration, _emberSimpleAuthInitializersSetupSession, _emberSimpleAuthInitializersSetupSessionService) {
  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(registry) {
      var config = _lolmaUsConfigEnvironment['default']['ember-simple-auth'] || {};
      config.baseURL = _lolmaUsConfigEnvironment['default'].baseURL;
      _emberSimpleAuthConfiguration['default'].load(config);

      (0, _emberSimpleAuthInitializersSetupSession['default'])(registry);
      (0, _emberSimpleAuthInitializersSetupSessionService['default'])(registry);
    }
  };
});
define('lolma-us/initializers/export-application-global', ['exports', 'ember', 'lolma-us/config/environment'], function (exports, _ember, _lolmaUsConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_lolmaUsConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _lolmaUsConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_lolmaUsConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('lolma-us/initializers/initialize-torii-callback', ['exports', 'torii/redirect-handler'], function (exports, _toriiRedirectHandler) {
  exports['default'] = {
    name: 'torii-callback',
    before: 'torii',
    initialize: function initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }
      application.deferReadiness();
      _toriiRedirectHandler['default'].handle(window)['catch'](function () {
        application.advanceReadiness();
      });
    }
  };
});
define('lolma-us/initializers/initialize-torii-session', ['exports', 'torii/bootstrap/session', 'torii/configuration'], function (exports, _toriiBootstrapSession, _toriiConfiguration) {
  exports['default'] = {
    name: 'torii-session',
    after: 'torii',

    initialize: function initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }
      var configuration = (0, _toriiConfiguration.getConfiguration)();
      if (!configuration.sessionServiceName) {
        return;
      }

      (0, _toriiBootstrapSession['default'])(application, configuration.sessionServiceName);

      var sessionFactoryName = 'service:' + configuration.sessionServiceName;
      application.inject('adapter', configuration.sessionServiceName, sessionFactoryName);
    }
  };
});
define('lolma-us/initializers/initialize-torii', ['exports', 'torii/bootstrap/torii', 'torii/configuration', 'lolma-us/config/environment'], function (exports, _toriiBootstrapTorii, _toriiConfiguration, _lolmaUsConfigEnvironment) {

  var initializer = {
    name: 'torii',
    initialize: function initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }
      (0, _toriiConfiguration.configure)(_lolmaUsConfigEnvironment['default'].torii || {});
      (0, _toriiBootstrapTorii['default'])(application);
      application.inject('route', 'torii', 'service:torii');
    }
  };

  exports['default'] = initializer;
});
define('lolma-us/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('lolma-us/initializers/store-push-payload', ['exports', 'ember-data/store', 'ember-metal/utils', 'ember-debug'], function (exports, _emberDataStore, _emberMetalUtils, _emberDebug) {
  exports.initialize = initialize;

  function initialize() /* application */{
    _emberDataStore['default'].reopen({
      pushPayload: function pushPayload(modelName, inputPayload) {
        var _this = this;

        var serializer = undefined;
        var payload = undefined;

        if (!inputPayload) {
          payload = modelName;
          serializer = this.serializerFor('application');
          (0, _emberMetalUtils.assert)("You cannot use `store#pushPayload` without a modelName unless your default serializer defines `pushPayload`", typeof serializer.pushPayload === 'function');
        } else {
          payload = inputPayload;
          (0, _emberMetalUtils.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + (0, _emberDebug.inspect)(modelName), typeof modelName === 'string');
          serializer = this.serializerFor(modelName);
        }

        return this._adapterRun(function () {
          return serializer.pushPayload(_this, payload);
        });
      }
    });
  }

  exports['default'] = {
    name: 'store-push-payload',
    initialize: initialize
  };
});
define('lolma-us/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('lolma-us/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('lolma-us/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("lolma-us/instance-initializers/browser/clear-double-boot", ["exports"], function (exports) {
  /*globals Ember*/

  // When using `ember fastboot --serve-assets` the application output will
  // already be rendered to the DOM when the actual JavaScript loads. Ember
  // does not automatically clear its `rootElement` so this leads to the
  // "double" applications being visible at once (only the "bottom" one is
  // running via JS and is interactive).
  //
  // This removes any pre-rendered ember-view elements, so that the booting
  // application will replace the pre-rendered output

  exports["default"] = {
    name: "clear-double-boot",

    initialize: function initialize(instance) {
      var originalDidCreateRootView = instance.didCreateRootView;

      instance.didCreateRootView = function () {
        var elements = document.querySelectorAll(instance.rootElement + ' .ember-view');
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          element.parentNode.removeChild(element);
        }

        originalDidCreateRootView.apply(instance, arguments);
      };
    }
  };
});
define('lolma-us/instance-initializers/browser/ember-data-fastboot', ['exports', 'npm:lodash', 'ember'], function (exports, _npmLodash, _ember) {
  exports.initialize = initialize;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var inflector = _ember['default'].Inflector.inflector;

  function initialize(applicationInstance) {
    var shoebox = applicationInstance.lookup('service:fastboot').get('shoebox');
    if (!shoebox) return;

    var data = shoebox.retrieve('ember-data-store');
    if (!data) return;

    var store = applicationInstance.lookup('service:store');

    _npmLodash['default'].forOwn(data.types, function (records, modelNamePlural) {
      var modelName = inflector.singularize(modelNamePlural);
      var payload = _defineProperty({}, modelNamePlural, records);
      store.pushPayload(modelName, payload);
    });
  }

  exports['default'] = {
    name: 'ember-data-fastboot',
    initialize: initialize
  };
});
define('lolma-us/instance-initializers/browser/head', ['exports', 'ember', 'lolma-us/config/environment'], function (exports, _ember, _lolmaUsConfigEnvironment) {
  exports.initialize = initialize;

  function initialize(owner) {
    if (_lolmaUsConfigEnvironment['default']['ember-cli-head'] && _lolmaUsConfigEnvironment['default']['ember-cli-head']['suppressBrowserRender']) {
      return true;
    }

    // clear fast booted head (if any)
    _ember['default'].$('meta[name="ember-cli-head-start"]').nextUntil('meta[name="ember-cli-head-end"] ~').addBack().remove();

    var component = owner.lookup('component:head-layout');
    component.appendTo(document.head);
  }

  exports['default'] = {
    name: 'head-browser',
    initialize: initialize
  };
});
define("lolma-us/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('lolma-us/instance-initializers/ember-i18n', ['exports', 'ember-i18n/instance-initializers/ember-i18n'], function (exports, _emberI18nInstanceInitializersEmberI18n) {
  exports['default'] = _emberI18nInstanceInitializersEmberI18n['default'];
});
define('lolma-us/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, _emberSimpleAuthInstanceInitializersSetupSessionRestoration) {
  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(instance) {
      (0, _emberSimpleAuthInstanceInitializersSetupSessionRestoration['default'])(instance);
    }
  };
});
define('lolma-us/instance-initializers/setup-routes', ['exports', 'torii/bootstrap/routing', 'torii/configuration', 'torii/router-dsl-ext'], function (exports, _toriiBootstrapRouting, _toriiConfiguration, _toriiRouterDslExt) {
  exports['default'] = {
    name: 'torii-setup-routes',
    initialize: function initialize(applicationInstance, registry) {
      var configuration = (0, _toriiConfiguration.getConfiguration)();

      if (!configuration.sessionServiceName) {
        return;
      }

      var router = applicationInstance.get('router');
      var setupRoutes = function setupRoutes() {
        var authenticatedRoutes = router.router.authenticatedRoutes;
        var hasAuthenticatedRoutes = !Ember.isEmpty(authenticatedRoutes);
        if (hasAuthenticatedRoutes) {
          (0, _toriiBootstrapRouting['default'])(applicationInstance, authenticatedRoutes);
        }
        router.off('willTransition', setupRoutes);
      };
      router.on('willTransition', setupRoutes);
    }
  };
});
define('lolma-us/instance-initializers/walk-providers', ['exports', 'torii/lib/container-utils', 'torii/configuration'], function (exports, _toriiLibContainerUtils, _toriiConfiguration) {
  exports['default'] = {
    name: 'torii-walk-providers',
    initialize: function initialize(applicationInstance) {
      var configuration = (0, _toriiConfiguration.getConfiguration)();
      // Walk all configured providers and eagerly instantiate
      // them. This gives providers with initialization side effects
      // like facebook-connect a chance to load up assets.
      for (var key in configuration.providers) {
        if (configuration.providers.hasOwnProperty(key)) {
          (0, _toriiLibContainerUtils.lookup)(applicationInstance, 'torii-provider:' + key);
        }
      }
    }
  };
});
define('lolma-us/locales/en/translations', ['exports'], function (exports) {
  exports['default'] = {
    header: {
      title: 'Andrey Mikhaylov',
      frontend: 'frontend developer',
      ember: 'EmberJS specialist'
    },
    langSwitcher: 'по-русски',
    onlinePresence: {
      title: 'Online presence'
    },
    projects: {
      title: 'Open Source Contributions',
      showStalled: 'Show stalled projects',
      sassLibs: 'Sass Libraries',
      emberAddons: 'Ember Addons',
      emberApps: 'Ember Apps',
      jsLibs: 'JavaScript Libraries',
      jQueryPlugins: 'Old jQuery Plugins'
    },
    timeline: {
      title: 'Experience',
      items: {
        mgimo: "Graduated from <a href='http://english.mgimo.ru/' target='_blank'>Moscow University of Foreign Affairs</a> (BoA)",
        adv: "Web Projects Manager at <a href='https://adv.ru/english/' target='_blank'>ADV.ru</a>, Russia",
        alfamb: "Web Developer and SysAdmin at <a href='http://alfamb.ru/' target='_blank'>AlfaMB.ru</a>, Russia",
        stankin: "Graduated from <a href='http://stankin.ru/en/education/faculty-of-computer-science-and-control-systems/' target='_blank'>Moscow State Technological University \"Stankin\"</a> (Software engineer)",
        stkomp: "Head of Tech Dept at <a href='http://stkomp.ru/' target='_blank'>STKomp.ru</a>, Russia",
        hivemind: "Frontend Developer at <a href='http://hivemindunit.github.io/hivemind-frontend-prototype/settings/domains/categories2/' target='_blank'>Hivemind.io</a>, Russia",
        healthfundr: "Frontend Developer (trial) at <a href='https://healthfundr.com' target='_blank'>Healthfundr.com</a>, US",
        mipt: "Frontend Developer (trial) at <a href='http://mipt.co/' target='_blank'>MIPT.co</a>, US/Russia",
        hellobaby: "EmberJS Developer at <a href='http://hell-o-baby.com' target='_blank'>Hell'o Baby</a>, Russia",
        firecracker: "EmberJS Developer at <a href='http://firecracker.me' target='_blank'>Firecracker.me</a>, US",
        yourteam: "Your team?"
      }
    }
  };
});
define('lolma-us/locales/ru/translations', ['exports'], function (exports) {
  exports['default'] = {
    header: {
      title: 'Андрей Михайлов',
      frontend: 'фронтенд-разработчик',
      ember: 'специалист по EmberJS'
    },
    langSwitcher: 'english',
    onlinePresence: {
      title: 'В этих ваших интернетах'
    },
    projects: {
      title: 'Вклад в Open Source',
      showStalled: 'Показывать заброшенные проекты',
      sassLibs: 'Sass-библиотеки',
      emberAddons: 'Ember-аддоны',
      emberApps: 'Приложения на Ember',
      jsLibs: 'JavaScript-библиотеки',
      jQueryPlugins: 'Старые jQuery-плагины'
    },
    timeline: {
      title: 'Опыт',
      items: {
        mgimo: "<a href='http://english.mgimo.ru/' target='_blank'>МГИМО</a> финишд! (бакалавр)",
        adv: "Менеджер вэб-проектов в <a href='https://adv.ru/english/' target='_blank'>ADV.ru</a>, Россия",
        alfamb: "Вэб-разработчик и сисадмин <a href='http://alfamb.ru/' target='_blank'>AlfaMB.ru</a>, Россия",
        stankin: "Окончил <a href='http://stankin.ru/en/education/faculty-of-computer-science-and-control-systems/' target='_blank'>МГТУ \"Станкин\"</a> (ПО и вычислительная техника, специалист)",
        stkomp: "Руководитель технического отдела в <a href='http://stkomp.ru/' target='_blank'>STKomp.ru</a>, Россия",
        hivemind: "Фронтенд-разработчик в <a href='http://hivemindunit.github.io/hivemind-frontend-prototype/settings/domains/categories2/' target='_blank'>Hivemind.io</a>, Россия",
        healthfundr: "Фронтенд-разработчик (исп. срок) в <a href='https://healthfundr.com' target='_blank'>Healthfundr.com</a>, США",
        mipt: "Фронтенд-разработчик (исп. срок) в <a href='http://mipt.co/' target='_blank'>MIPT.co</a>, США/Россия",
        hellobaby: "EmberJS-разработчик в <a href='http://hell-o-baby.com' target='_blank'>Hell'o Baby</a>, Россия",
        firecracker: "EmberJS-разработчик в <a href='http://firecracker.me' target='_blank'>Firecracker.me</a>, США",
        yourteam: "Ваша команда?"
      }
    }
  };
});
define('lolma-us/locations/none', ['exports', 'ember'], function (exports, _ember) {
  var computed = _ember['default'].computed;
  var reads = _ember['default'].computed.reads;
  var service = _ember['default'].inject.service;
  var get = _ember['default'].get;
  var getOwner = _ember['default'].getOwner;
  exports['default'] = _ember['default'].NoneLocation.extend({
    implementation: 'fastboot',
    fastboot: service(),

    _fastbootHeadersEnabled: computed(function () {
      var config = getOwner(this).resolveRegistration('config:environment');
      return !!get(config, 'fastboot.fastbootHeaders');
    }),

    _redirectCode: computed(function () {
      var TEMPORARY_REDIRECT_CODE = 307;
      var config = getOwner(this).resolveRegistration('config:environment');
      return get(config, 'fastboot.redirectCode') || TEMPORARY_REDIRECT_CODE;
    }),

    _response: reads('fastboot.response'),
    _request: reads('fastboot.request'),

    setURL: function setURL(path) {
      if (get(this, 'fastboot.isFastBoot')) {
        var currentPath = get(this, 'path');
        var isInitialPath = !currentPath || currentPath.length === 0;
        var isTransitioning = currentPath !== path;
        var response = get(this, '_response');

        if (isTransitioning && !isInitialPath) {
          var protocol = get(this, '_request.protocol');
          var host = get(this, '_request.host');
          var redirectURL = protocol + '://' + host + path;

          response.statusCode = this.get('_redirectCode');
          response.headers.set('location', redirectURL);
        }

        // for testing and debugging
        if (get(this, '_fastbootHeadersEnabled')) {
          response.headers.set('x-fastboot-path', path);
        }
      }

      this._super.apply(this, arguments);
    }
  });
});
define('lolma-us/models/markdown-block', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships) {
  exports['default'] = _emberDataModel['default'].extend({

    // ----- Attributes -----
    title: (0, _emberDataAttr['default'])('string'),
    body: (0, _emberDataAttr['default'])('string'),

    // ----- Relationships -----
    website: (0, _emberDataRelationships.belongsTo)('markdown-block')
  });
});
define('lolma-us/models/project-info', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'ember-computed', 'ember-service/inject', 'lolma-us/utils/fetch-github', 'rsvp', 'ember-computed-template-string', 'ember-object', 'ember'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships, _emberComputed, _emberServiceInject, _lolmaUsUtilsFetchGithub, _rsvp, _emberComputedTemplateString, _emberObject, _ember) {
  var PromiseProxyMixin = _ember['default'].PromiseProxyMixin;

  var PromiseProxy = _emberObject['default'].extend(PromiseProxyMixin);

  exports['default'] = _emberDataModel['default'].extend({

    // ----- Attributes -----
    stargazersCount: (0, _emberDataAttr['default'])('number'),

    // ----- Relationships -----
    // project: belongsTo('project'),

    // ----- Services -----
    session: (0, _emberServiceInject['default'])(),

    // ----- Static properties -----

    // ----- Computed properties -----
    starUrl: _ember['default'].computed('id', function () {
      return 'user/starred/' + this.get('id');
    }),

    isStarredPromise: (0, _emberComputed['default'])('starUrl', 'session.isAuthenticated', function () {
      return this._requestIsStarred();
    }),
    isStarredProxy: (0, _emberComputed['default'])('isStarredPromise', function () {
      var promise = this.get('isStarredPromise');
      return PromiseProxy.create({ promise: promise });
    }),

    toggleStarPromise: undefined,
    toggleStarProxy: (0, _emberComputed['default'])('toggleStarPromise', function () {
      var promise = this.get('toggleStarPromise');
      if (!promise) return;
      return PromiseProxy.create({ promise: promise });
    }),

    starPromisePending: (0, _emberComputed['default'])('session.isAuthenticated', 'isStarredProxy.isPending', 'toggleStarProxy.isPending', function () {
      if (!this.get('session.isAuthenticated')) return false;
      return this.get('isStarredProxy.isPending') || this.get('toggleStarProxy.isPending');
    }),

    starPromiseFailed: (0, _emberComputed['default'])('session.isAuthenticated', 'isStarredProxy.isRejected', 'toggleStarProxy.isRejected', function () {
      if (!this.get('session.isAuthenticated')) return false;
      return this.get('isStarredProxy.isRejected') || this.get('toggleStarProxy.isRejected');
    }),

    originalIsStarred: (0, _emberComputed.alias)('isStarredProxy.content'),
    newIsStarred: (0, _emberComputed.alias)('toggleStarProxy.content'),

    effectiveIsStarred: (0, _emberComputed['default'])('newIsStarred', 'originalIsStarred', function () {
      var newIsStarred = this.get('newIsStarred');
      if (newIsStarred != null) return newIsStarred;
      return this.get('originalIsStarred');
    }),

    effectiveStargazersCount: (0, _emberComputed['default'])('stargazersCount', 'originalIsStarred', 'newIsStarred', function () {
      var stargazersCount = this.get('stargazersCount');
      var originalIsStarred = this.get('originalIsStarred');
      var newIsStarred = this.get('newIsStarred');

      if (originalIsStarred == null || newIsStarred == null || originalIsStarred === newIsStarred) return stargazersCount;

      if (originalIsStarred && !newIsStarred) return stargazersCount - 1;

      return stargazersCount + 1;
    }),

    // ----- Custom Methods -----
    _requestIsStarred: function _requestIsStarred() {
      var _this = this;

      var starUrl = this.get('starUrl');
      var session = this.get('session');

      return (0, _lolmaUsUtilsFetchGithub['default'])(starUrl, session, { mode: false }).then(function () {
        return true;
      })['catch'](function (response) {
        if (response.status === 404) return false;
        return _rsvp['default'].reject(response);
      }).then(function (status) {
        return _this.set('originalIsStarred', status);
      });
    },

    _star: function _star() {
      var starUrl = this.get('starUrl');
      var session = this.get('session');

      return (0, _lolmaUsUtilsFetchGithub['default'])(starUrl, session, { mode: false, method: 'PUT' }).then(function () {
        return true;
      });
    },

    _unstar: function _unstar() {
      var starUrl = this.get('starUrl');
      var session = this.get('session');

      return (0, _lolmaUsUtilsFetchGithub['default'])(starUrl, session, { mode: false, method: 'DELETE' }).then(function () {
        return false;
      });
    },

    toggleStar: function toggleStar() {
      if (this.get('isStarredProxy.isPending')) return;
      if (this.get('toggleStarProxy.isPending')) return;

      if (this.get('isStarredProxy.isRejected')) {
        var isStarredPromise = this._requestIsStarred();
        this.setProperties({ isStarredPromise: isStarredPromise });
      }

      var toggleStarPromise = this.get('effectiveIsStarred') ? this._unstar() : this._star();
      this.setProperties({ toggleStarPromise: toggleStarPromise });
    }

  });
});

// import wait from 'lolma-us/utils/wait'
define('lolma-us/models/project', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'ember-computed', 'ember-cpm/macros/conditional', 'ember-computed-template-string'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships, _emberComputed, _emberCpmMacrosConditional, _emberComputedTemplateString) {
  // import service from 'ember-service/inject'
  // import _ from 'npm:lodash'

  exports['default'] = _emberDataModel['default'].extend({

    // ----- Attributes -----
    group: (0, _emberDataAttr['default'])('string'),
    status: (0, _emberDataAttr['default'])('number'),
    type: (0, _emberDataAttr['default'])('string'),
    owner: (0, _emberDataAttr['default'])('string', { defaultValue: 'lolmaus' }),
    url: (0, _emberDataAttr['default'])('string'),
    description: (0, _emberDataAttr['default'])(''),
    emberObserver: (0, _emberDataAttr['default'])('boolean', { defaultValue: false }),

    // ----- Relationships -----
    website: (0, _emberDataRelationships.belongsTo)('website'),
    projectInfo: (0, _emberDataRelationships.belongsTo)('project-info', { async: true }),

    // ----- Services -----

    // ----- Computed properties -----
    gitHubUrl: Ember.computed('owner', 'id', function () {
      return 'https://github.com/' + this.get('owner') + '/' + this.get('id');
    }),
    effectiveUrl: (0, _emberCpmMacrosConditional['default'])('url', 'url', 'gitHubUrl'),
    effectiveName: (0, _emberCpmMacrosConditional['default'])('name', 'name', 'id'),

    // Return projectInfo without triggering a fetch
    projectInfoSync: (0, _emberComputed['default'])(function () {
      return this.belongsTo('projectInfo').value();
    }).volatile()
  });
});
define('lolma-us/models/stackoverflow-user', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _emberDataModel, _emberDataAttr) {
  // import {hasMany} from 'ember-data/relationships'

  exports['default'] = _emberDataModel['default'].extend({

    // ----- Attributes -----
    reputation: (0, _emberDataAttr['default'])('number'),
    bronze: (0, _emberDataAttr['default'])('number'),
    silver: (0, _emberDataAttr['default'])('number'),
    gold: (0, _emberDataAttr['default'])('number')
  });
});
define('lolma-us/models/website', ['exports', 'ember-data/model', 'ember-data/relationships'], function (exports, _emberDataModel, _emberDataRelationships) {
  exports['default'] = _emberDataModel['default'].extend({

    // ----- Relationships -----
    markdownBlocks: (0, _emberDataRelationships.hasMany)('markdown-block'),
    projects: (0, _emberDataRelationships.hasMany)('project')
  });
});

// import attr from 'ember-data/attr'
define('lolma-us/pods/application/route', ['exports', 'ember-route', 'ember-service/inject', 'rsvp', 'npm:lodash'], function (exports, _emberRoute, _emberServiceInject, _rsvp, _npmLodash) {
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  exports['default'] = _emberRoute['default'].extend({

    // ----- Services -----
    router: (0, _emberServiceInject['default'])('-routing'),
    fastboot: (0, _emberServiceInject['default'])(),

    // ----- Overridden properties -----

    // ----- Static properties -----

    // ----- Computed properties -----

    // ----- Overridden Methods -----
    model: function model() {
      var _this = this;

      var store = this.get('store');

      return _rsvp['default'].hash({
        isFastBoot: this.get('fastboot.isFastBoot'),
        website: store.findRecord('website', 'website'),
        projectInfos: store.findAll('project-info')
        // Ignore 403 error
        ['catch'](function (response) {
          console.log('projectInfos failed', response);
          if (response.status === 403) return null;
          return _rsvp['default'].reject(response);
        }),

        stackoverflowUser: store.findRecord('stackoverflowUser', '901944')['catch'](function () {
          return store.peekRecord('stackoverflowUser', '901944');
        })
      }).then(function (model) {
        return _rsvp['default'].hash(_extends({}, model, {
          projects: _this.fetchProjects(model.website)
        }));
      }).then(function (model) {
        return _rsvp['default'].hash(_extends({}, model, {
          remainingProjectInfos: _this.fetchRemainingProjectInfos(model.projects)
        }));
      });
    },

    // ----- Custom Methods -----
    fetchProjects: function fetchProjects(website) {
      var store = this.get('store');

      var promises = website.hasMany('projects').ids().map(function (id) {
        return store.findRecord('project', id);
      });

      return _rsvp['default'].all(promises);
    },

    fetchRemainingProjectInfos: function fetchRemainingProjectInfos(projects) {
      var store = this.get('store');
      var existingIds = store.peekAll('project-info').mapBy('id');

      if (!existingIds.length) return _rsvp['default'].resolve();

      var idsFormProjects = projects.map(function (project) {
        return project.belongsTo('projectInfo').id();
      });
      var remainingIds = _npmLodash['default'].reject(idsFormProjects, function (id) {
        return existingIds.includes(id);
      });

      var promises = remainingIds.map(function (id) {
        return store.findRecord('project-info', id)['catch'](function (response) {
          console.log('remainingProjectInfo failed', id, response);
          if (response.status === 403) return null;
          return _rsvp['default'].reject(response);
        });
      });

      return _rsvp['default'].all(promises);
    }

  });
});

// import computed from 'ember-computed'
// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define('lolma-us/pods/components/hero-header/component', ['exports', 'ember-component'], function (exports, _emberComponent) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    statement: undefined,

    // ----- Services -----

    // ----- Overridden properties -----
    classNames: ['heroHeader']

  });
});
// ----- Static properties -----

// ----- Computed properties -----

// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/hero-header/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"block\",[\"sec-tion\"],null,[[\"innerClass\"],[\"heroHeader-inner\"]],1]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"markdown-block\"],null,[[\"class\",\"section\"],[\"heroHeader-statement\",[\"get\",[\"statement\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"heroHeader-header\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h1\",[]],[\"static-attr\",\"class\",\"heroHeader-title h1\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"header.title\"],null],false],[\"text\",\" (lolmaus)\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"h2\",[]],[\"static-attr\",\"class\",\"heroHeader-subtitle\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"heroHeader-subtitle-element _frontend\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"t\"],[\"header.frontend\"],null],false],[\"text\",\",\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"heroHeader-subtitle-element _ember\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"t\"],[\"header.ember\"],null],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n  \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"class\",\"heroHeader-avatar\"],[\"static-attr\",\"src\",\"https://pbs.twimg.com/profile_images/458644904189501440/ANprYN38.jpeg\"],[\"static-attr\",\"alt\",\"My face\"],[\"static-attr\",\"width\",\"512\"],[\"static-attr\",\"height\",\"512\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"statement\"]]],null,0],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/hero-header/template.hbs" } });
});
define('lolma-us/pods/components/locale-switcher/component', ['exports', 'ember-component', 'ember-computed', 'ember-service/inject'], function (exports, _emberComponent, _emberComputed, _emberServiceInject) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    toggleLocaleAction: undefined,

    // ----- Services -----
    i18n: (0, _emberServiceInject['default'])('i18n'),

    // ----- Overridden properties -----
    attributeBindings: ['href'],
    classNames: ['localeSwitcher'],
    tagName: 'a',

    // ----- Static properties -----
    href: (0, _emberComputed['default'])('i18n.oppositeLocale', function () {
      return '/' + this.get('i18n.oppositeLocale');
    }),

    // ----- Computed properties -----

    // ----- Overridden Methods -----
    click: function click(event) {
      event.preventDefault();
      this.get('toggleLocaleAction')();
    }

  });
});
// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/locale-switcher/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"langSwitcher\"],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/locale-switcher/template.hbs" } });
});
define('lolma-us/pods/components/markdown-block/component', ['exports', 'ember-component'], function (exports, _emberComponent) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    section: undefined, // title, body

    // ----- Services -----

    // ----- Overridden properties -----
    classNames: ['markdownBlock']

  });
});
// ----- Static properties -----

// ----- Computed properties -----

// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/markdown-block/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"section\",\"title\"]]],null,1],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"section\",\"body\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"append\",[\"helper\",[\"markdown-to-html\"],[[\"get\",[\"section\",\"body\"]]],[[\"class\"],[\"markdownBlock-body\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"h2\",[]],[\"static-attr\",\"class\",\"markdownBlock-title -callout\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"section\",\"title\"]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/markdown-block/template.hbs" } });
});
define('lolma-us/pods/components/online-presence/component', ['exports', 'ember-component', 'ember-array-computed-macros'], function (exports, _emberComponent, _emberArrayComputedMacros) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    projectInfos: undefined,
    stackoverflowUser: undefined,

    // ----- Services -----

    // ----- Overridden properties -----
    classNames: ['onlinePresence'],

    // ----- Static properties -----

    // ----- Computed properties -----
    starsCount: (0, _emberArrayComputedMacros.sumBy)('projectInfos', 'stargazersCount')

  });
});
// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/online-presence/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"static-attr\",\"class\",\"onlinePresence-title -callout\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"t\"],[\"onlinePresence.title\"],null],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"onlinePresence-list\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"onlinePresence-item\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"class\",\"onlinePresence-item-icon\"],[\"static-attr\",\"src\",\"/images/service-icons/github.png\"],[\"static-attr\",\"width\",\"16\"],[\"static-attr\",\"height\",\"16\"],[\"static-attr\",\"alt\",\"GitHub\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"onlinePresence-item-service\"],[\"flush-element\"],[\"text\",\"\\n      GitHub:\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"https://github.com/lolmaus\"],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"text\",\"lolmaus\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"projectInfos\"]]],null,1],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n  \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"onlinePresence-item\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/images/service-icons/stackoverflow.png\"],[\"static-attr\",\"width\",\"16\"],[\"static-attr\",\"height\",\"16\"],[\"static-attr\",\"alt\",\"StackOverflow\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"https://stackoverflow.com/users/901944/lolmaus-andrey-mikhaylov\"],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"text\",\"StackOverflow\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"stackoverflowUser\"]]],null,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n  \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"onlinePresence-item\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/images/service-icons/twitter.png\"],[\"static-attr\",\"width\",\"16\"],[\"static-attr\",\"height\",\"13\"],[\"static-attr\",\"alt\",\"Twitter\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"onlinePresence-item-service\"],[\"flush-element\"],[\"text\",\"\\n      Twitter:\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"https://twitter.com/lolmaus_en\"],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"text\",\"@lolmaus_en\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n  \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"onlinePresence-item\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/images/service-icons/telegram.png\"],[\"static-attr\",\"width\",\"16\"],[\"static-attr\",\"height\",\"16\"],[\"static-attr\",\"alt\",\"Telegram\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"onlinePresence-item-service\"],[\"flush-element\"],[\"text\",\"\\n      Telegram:\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"https://telegram.me/lolmaus\"],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"text\",\"@lolmaus\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n  \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"onlinePresence-item\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/images/service-icons/gitter.png\"],[\"static-attr\",\"width\",\"16\"],[\"static-attr\",\"height\",\"16\"],[\"static-attr\",\"alt\",\"Gitter\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"onlinePresence-item-service\"],[\"flush-element\"],[\"text\",\"\\n      Gitter:\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"https://gitter.im/lolmaus\"],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"text\",\"lolmaus\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n  \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"onlinePresence-item\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/images/service-icons/ember.png\"],[\"static-attr\",\"width\",\"16\"],[\"static-attr\",\"height\",\"16\"],[\"static-attr\",\"alt\",\"Ember Slack Community\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"onlinePresence-item-service\"],[\"flush-element\"],[\"text\",\"\\n      Slack:\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"https://embercommunity.slack.com/messages/@lolmaus/\"],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"text\",\"@lolmaus\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n  \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"onlinePresence-item\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/images/service-icons/email.png\"],[\"static-attr\",\"width\",\"16\"],[\"static-attr\",\"height\",\"16\"],[\"static-attr\",\"alt\",\"E-mail\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"onlinePresence-item-service\"],[\"flush-element\"],[\"text\",\"\\n      E-mail:\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"mailto:lolmaus@gmail.com\"],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"text\",\"lolmaus@gmail.com\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"unknown\",[\"stackoverflowUser\",\"reputation\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n        ●\\n        \"],[\"append\",[\"unknown\",[\"stackoverflowUser\",\"gold\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n        ◍\\n        \"],[\"append\",[\"unknown\",[\"stackoverflowUser\",\"silver\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n        ○\\n        \"],[\"append\",[\"unknown\",[\"stackoverflowUser\",\"bronze\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      ★\"],[\"append\",[\"unknown\",[\"starsCount\"]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/online-presence/template.hbs" } });
});
define('lolma-us/pods/components/pro-ject/component', ['exports', 'ember-component', 'ember-computed', 'ember-metal/get', 'ember-service/inject'], function (exports, _emberComponent, _emberComputed, _emberMetalGet, _emberServiceInject) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    project: undefined,
    gitHubProjectsStats: undefined,
    locale: 'en',

    // ----- Services -----
    session: (0, _emberServiceInject['default'])(),

    // ----- Overridden properties -----
    classNames: ['proJect'],

    // ----- Static properties -----
    emptyString: '',

    // ----- Computed properties -----
    currentDescription: (0, _emberComputed['default'])('locale', 'project.description', function () {
      var locale = this.get('locale');
      var descriptionObject = this.get('project.description');
      return (0, _emberMetalGet['default'])(descriptionObject, locale);
    }),

    statusLabel: (0, _emberComputed['default'])('project.status', function () {
      var status = this.get('project.status');

      return status === 2 ? 'WIP' : status === 3 ? 'PoC' : status === 4 ? 'stalled' : '';
    }),

    starButtonLabel: (0, _emberComputed['default'])('session.isAuthenticated', 'project.projectInfo.starPromisePending', 'project.projectInfo.starPromiseFailed', 'project.projectInfo.effectiveIsStarred', function () {
      return !this.get('session.isAuthenticated') ? 'Star' : this.get('project.projectInfo.starPromisePending') ? 'Updating...' : this.get('project.projectInfo.starPromiseFailed') ? 'Retry' : this.get('project.projectInfo.effectiveIsStarred') ? 'Unstar' : 'Star';
    }),

    starCount: (0, _emberComputed['default'])('session.isAuthenticated', 'project.projectInfoSync', 'project.projectInfo.stargazersCount', 'project.projectInfo.effectiveStargazersCount', function () {
      if (this.get('session.isAuthenticated')) return this.get('project.projectInfo.effectiveStargazersCount');
      if (this.get('project.projectInfoSync')) return this.get('project.projectInfo.stargazersCount');
    }),

    // ----- Overridden Methods -----

    // ----- Custom Methods -----

    // ----- Events and observers -----

    // ----- Tasks -----

    // ----- Actions -----
    actions: {
      toggleStar: function toggleStar() {
        if (!this.get('session.isAuthenticated')) {
          window.open(this.get('project.gitHubUrl'), '_blank');
          return;
        }

        this.get('project.projectInfo').then(function (project) {
          return project.toggleStar();
        });
      }
    }
  });
});

// import conditional from "ember-cpm/macros/conditional"
// import templateString from 'ember-computed-template-string'
define("lolma-us/pods/components/pro-ject/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"proJect-meta\"],[\"flush-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"a\",[]],[\"dynamic-attr\",\"href\",[\"unknown\",[\"project\",\"effectiveUrl\"]],null],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"project\",\"effectiveName\"]],false],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"append\",[\"helper\",[\"star-button\"],null,[[\"label\",\"count\",\"disabled\",\"link\",\"act\"],[[\"get\",[\"starButtonLabel\"]],[\"get\",[\"starCount\"]],[\"helper\",[\"and\"],[[\"get\",[\"session\",\"isAuthenticated\"]],[\"get\",[\"project\",\"projectInfo\",\"starPromisePending\"]]],null],[\"get\",[\"project\",\"gitHubUrl\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"toggleStar\"],null]]]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"project\",\"emberObserver\"]]],null,2],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"helper\",[\"gte\"],[[\"get\",[\"project\",\"status\"]],2],null]],null,1],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"currentDescription\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"append\",[\"helper\",[\"markdown-to-html\"],[[\"get\",[\"currentDescription\"]]],[[\"class\"],[\"proJect-description\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"span\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"proJect-status -\",[\"unknown\",[\"project\",\"status\"]]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"statusLabel\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"a\",[]],[\"dynamic-attr\",\"href\",[\"concat\",[\"https://emberobserver.com/addons/\",[\"unknown\",[\"project\",\"id\"]]]]],[\"static-attr\",\"target\",\"_blank\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"img\",[]],[\"dynamic-attr\",\"src\",[\"concat\",[\"https://emberobserver.com/badges/\",[\"unknown\",[\"project\",\"id\"]],\".svg\"]]],[\"static-attr\",\"alt\",\"Ember Observer Score\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/pro-ject/template.hbs" } });
});
define('lolma-us/pods/components/pro-jects/component', ['exports', 'ember-component'], function (exports, _emberComponent) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    projects: undefined,
    gitHubProjectsStats: undefined,
    locale: 'en',

    // ----- Services -----

    // ----- Overridden properties -----
    classNames: ['proJects'],

    // ----- Static properties -----
    showStalled: false

  });
});
// ----- Computed properties -----

// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/pro-jects/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"static-attr\",\"class\",\"proJects-title -callout\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"t\"],[\"projects.title\"],null],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"isFastBoot\"]]],null,5],[\"text\",\"\\n\"],[\"block\",[\"with\"],[[\"helper\",[\"if\"],[[\"get\",[\"showStalled\"]],[\"get\",[\"projects\"]],[\"helper\",[\"reject-by\"],[\"status\",4,[\"get\",[\"projects\"]]],null]],null]],null,4]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"proJects-group-title h4\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"projects.jQueryPlugins\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"project-group\"],null,[[\"projects\",\"locale\",\"gitHubProjectsStats\"],[[\"get\",[\"projects\"]],[\"get\",[\"locale\"]],[\"get\",[\"gitHubProjectsStats\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"projects\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"proJects-group-title h4\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"projects.jsLibs\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"project-group\"],null,[[\"projects\",\"locale\",\"gitHubProjectsStats\"],[[\"get\",[\"projects\"]],[\"get\",[\"locale\"]],[\"get\",[\"gitHubProjectsStats\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"projects\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"proJects-group-title h4\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"projects.emberAddons\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"project-group\"],null,[[\"projects\",\"locale\",\"gitHubProjectsStats\"],[[\"helper\",[\"filter-by\"],[\"type\",\"addon\",[\"get\",[\"projects\"]]],null],[\"get\",[\"locale\"]],[\"get\",[\"gitHubProjectsStats\"]]]]],false],[\"text\",\"\\n\\n\\n    \"],[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"proJects-group-title h4\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"projects.emberApps\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"project-group\"],null,[[\"projects\",\"locale\",\"gitHubProjectsStats\"],[[\"helper\",[\"filter-by\"],[\"type\",\"app\",[\"get\",[\"projects\"]]],null],[\"get\",[\"locale\"]],[\"get\",[\"gitHubProjectsStats\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"projects\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"proJects-group-title h4\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"projects.sassLibs\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"project-group\"],null,[[\"projects\",\"locale\",\"gitHubProjectsStats\"],[[\"get\",[\"projects\"]],[\"get\",[\"locale\"]],[\"get\",[\"gitHubProjectsStats\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"projects\"]},{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"with\"],[[\"helper\",[\"filter-by\"],[\"group\",\"sass\",[\"get\",[\"projects\"]]],null]],null,3],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"with\"],[[\"helper\",[\"filter-by\"],[\"group\",\"ember\",[\"get\",[\"projects\"]]],null]],null,2],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"with\"],[[\"helper\",[\"filter-by\"],[\"group\",\"js\",[\"get\",[\"projects\"]]],null]],null,1],[\"text\",\"\\n\"],[\"block\",[\"with\"],[[\"helper\",[\"filter-by\"],[\"group\",\"jquery\",[\"get\",[\"projects\"]]],null]],null,0],[\"text\",\"\\n\"]],\"locals\":[\"projects\"]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"proJects-stalled\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"showStalled\"]]]]],false],[\"text\",\"\\n    \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"projects.showStalled\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/pro-jects/template.hbs" } });
});
define('lolma-us/pods/components/project-group/component', ['exports', 'ember-component'], function (exports, _emberComponent) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    projects: undefined,
    gitHubProjectsStats: undefined,
    locale: 'en',

    // ----- Services -----

    // ----- Overridden properties -----
    classNames: ['projectGroup']

  });
});
// ----- Static properties -----

// ----- Computed properties -----

// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/project-group/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"block\",[\"each\"],[[\"helper\",[\"sort-by\"],[\"status\",\"name\",[\"get\",[\"projects\"]]],null]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"append\",[\"helper\",[\"pro-ject\"],null,[[\"class\",\"project\",\"locale\",\"gitHubProjectsStats\"],[\"projectGroup-project\",[\"get\",[\"project\"]],[\"get\",[\"locale\"]],[\"get\",[\"gitHubProjectsStats\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"project\"]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/project-group/template.hbs" } });
});
define('lolma-us/pods/components/sec-tion/component', ['exports', 'ember-component'], function (exports, _emberComponent) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    innerClass: '',

    // ----- Services -----

    // ----- Overridden properties -----
    classNames: ['secTion']

  });
});
// ----- Static properties -----

// ----- Computed properties -----

// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/sec-tion/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"secTion-inner \",[\"unknown\",[\"innerClass\"]]]]],[\"flush-element\"],[\"text\",\"\\n  \"],[\"yield\",\"default\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/sec-tion/template.hbs" } });
});
define('lolma-us/pods/components/star-button/component', ['exports', 'ember-component'], function (exports, _emberComponent) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----
    label: undefined,
    link: undefined,
    act: undefined,
    count: undefined,

    // ----- Services -----

    // ----- Overridden properties -----
    classNames: ['starButton']

  });
});
// ----- Static properties -----

// ----- Computed properties -----

// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/star-button/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"open-element\",\"a\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"starButton-button \",[\"helper\",[\"if\"],[[\"get\",[\"disabled\"]],\"-disabled\",\"\"],null]]]],[\"dynamic-attr\",\"href\",[\"unknown\",[\"link\"]],null],[\"static-attr\",\"target\",\"_blank\"],[\"modifier\",[\"action\"],[[\"get\",[null]],[\"get\",[\"act\"]]]],[\"flush-element\"],[\"text\",\"\\n  ★ \"],[\"append\",[\"unknown\",[\"label\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"unless\"],[[\"helper\",[\"is-nully\"],[[\"get\",[\"count\"]]],null]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"starButton-count\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"count\"]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/star-button/template.hbs" } });
});
define('lolma-us/pods/components/time-line/component', ['exports', 'ember-component'], function (exports, _emberComponent) {
  exports['default'] = _emberComponent['default'].extend({

    // ----- Arguments -----

    // ----- Services -----

    // ----- Overridden properties -----
    classNames: ['timeLine']

  });
});
// ----- Static properties -----

// ----- Computed properties -----

// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define("lolma-us/pods/components/time-line/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"static-attr\",\"class\",\"timeLine-title -callout\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"t\"],[\"timeline.title\"],null],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"timeLine-list\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"helper\",[\"array\"],[[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2008-06\",false,\"mgimo\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2008-07\",\"2008-12\",\"adv\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2008-12\",\"2013-06\",\"alfamb\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2011-12\",false,\"stankin\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2013-07\",\"2014-03\",\"stkomp\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2014-03\",\"2014-06\",\"hivemind\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2014-06\",\"2014-07\",\"healthfundr\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2014-07\",\"2014-08\",\"mipt\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2014-09\",\"2015-08\",\"hellobaby\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[\"2015-09\",\"2016-11\",\"firecracker\"]]],[\"helper\",[\"hash\"],null,[[\"start\",\"end\",\"title\"],[[\"helper\",[\"now\"],null,null],true,\"yourteam\"]]]],null]],null,3],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"item\",\"end\"]],\"MMM YYYY\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            →\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"item\",\"start\"]],\"MMM YYYY\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"timeLine-item\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"timeLine-item-icon\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"timeLine-item-icon-icon\"],[\"flush-element\"],[\"text\",\"📅\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"timeLine-item-info\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"timeLine-item-date\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"item\",\"start\"]]],null,2],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"item\",\"end\"]]],null,1],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"helper\",[\"and\"],[[\"get\",[\"item\",\"end\"]],[\"helper\",[\"not-eq\"],[[\"get\",[\"item\",\"end\"]],true],null]],null]],null,0],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"append\",[\"helper\",[\"markdown-to-html\"],[[\"helper\",[\"t\"],[[\"helper\",[\"concat\"],[\"timeline.items.\",[\"get\",[\"item\",\"title\"]]],null]],null]],[[\"class\"],[\"timeLine-item-name\"]]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[\"item\"]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/components/time-line/template.hbs" } });
});
define('lolma-us/pods/index/route', ['exports', 'ember-route', 'ember-service/inject'], function (exports, _emberRoute, _emberServiceInject) {
  exports['default'] = _emberRoute['default'].extend({

    // ----- Services -----
    fastboot: (0, _emberServiceInject['default'])(),
    headData: (0, _emberServiceInject['default'])(),

    // ----- Overridden properties -----

    // ----- Static properties -----

    // ----- Computed properties -----

    // ----- Overridden Methods -----
    redirect: function redirect() {
      if (!this.get('fastboot.isFastBoot')) this.transitionTo('locale', { locale: 'en' });else this.set('headData.redirectToEn', true);
    }
  });
});
// model() {
//   /* jshint unused:false */
//   const model = this.modelFor('')
//
//   return RSVP.hash({
//     /* jshint ignore:start */
//     ...model,
//     /* jshint ignore:end */
//   })
// },

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----

// ----- Actions -----
// actions: {
// }
define('lolma-us/pods/locale/index/controller', ['exports', 'ember-controller', 'ember-service/inject'], function (exports, _emberController, _emberServiceInject) {
  exports['default'] = _emberController['default'].extend({

    // ----- Services -----
    session: (0, _emberServiceInject['default'])(),

    // ----- Overridden properties -----

    // ----- Static properties -----
    isAuthenticating: false,

    // ----- Computed properties -----

    // ----- Overridden Methods -----

    // ----- Custom Methods -----

    // ----- Events and observers -----

    // ----- Tasks -----

    // ----- Actions -----
    actions: {
      login: function login() {
        var _this = this;

        this.set('isAuthenticating', true);

        this.get('session').authenticate('authenticator:torii', 'github-oauth2')['finally'](function () {
          return _this.set('isAuthenticating', false);
        });
      },

      logout: function logout() {
        this.get('session').invalidate();
      }
    }
  });
});
define("lolma-us/pods/locale/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"route-localeIndex\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"hero-header\"],null,[[\"statement\"],[[\"helper\",[\"find-by\"],[\"id\",[\"helper\",[\"concat\"],[\"looking-for-job-\",[\"get\",[\"model\",\"locale\"]]],null],[\"get\",[\"model\",\"markdownBlocks\"]]],null]]]],false],[\"text\",\"\\n\\n  \"],[\"append\",[\"helper\",[\"locale-switcher\"],null,[[\"class\",\"toggleLocaleAction\"],[\"route-localeIndex-localeSwitcher\",[\"helper\",[\"route-action\"],[\"toggleLocale\"],null]]]],false],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"sec-tion\"],null,[[\"class\",\"innerClass\"],[\"route-localeIndex-cards\",\"route-localeIndex-cards-inner\"]],6],[\"text\",\"\\n\\n\\n\\n\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"model\",\"isFastBoot\"]]],null,5],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"login\"]],[\"flush-element\"],[\"text\",\"Log in\"],[\"close-element\"],[\"text\",\" to star projects\\n        \"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"logout\"]],[\"flush-element\"],[\"text\",\"Log out\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"session\",\"isAuthenticated\"]]],null,1,0]],\"locals\":[]},{\"statements\":[[\"text\",\"          Logging in...\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"hr\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isAuthenticating\"]]],null,3,2],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"sec-tion\"],null,[[\"class\",\"innerClass\"],[\"route-localeIndex-footer\",\"route-localeIndex-footer-inner\"]],4],[\"text\",\"  \"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"markdown-block\"],null,[[\"class\",\"section\"],[\"route-localeIndex-card _personality\",[\"helper\",[\"find-by\"],[\"id\",[\"helper\",[\"concat\"],[\"personality-\",[\"get\",[\"model\",\"locale\"]]],null],[\"get\",[\"model\",\"markdownBlocks\"]]],null]]]],false],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"online-presence\"],null,[[\"class\",\"projectInfos\",\"stackoverflowUser\"],[\"route-localeIndex-card _presence\",[\"get\",[\"model\",\"projectInfos\"]],[\"get\",[\"model\",\"stackoverflowUser\"]]]]],false],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"markdown-block\"],null,[[\"class\",\"section\"],[\"route-localeIndex-card _skills\",[\"helper\",[\"find-by\"],[\"id\",[\"helper\",[\"concat\"],[\"skills-\",[\"get\",[\"model\",\"locale\"]]],null],[\"get\",[\"model\",\"markdownBlocks\"]]],null]]]],false],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"pro-jects\"],null,[[\"class\",\"projects\",\"locale\",\"isFastBoot\",\"gitHubProjectsStats\"],[\"route-localeIndex-card _projects\",[\"get\",[\"model\",\"projects\"]],[\"get\",[\"model\",\"locale\"]],[\"get\",[\"model\",\"isFastBoot\"]],[\"get\",[\"model\",\"gitHubProjectsStats\"]]]]],false],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"time-line\"],null,[[\"class\"],[\"route-localeIndex-card _timeline\"]]],false],[\"text\",\"\\n\\n    \"],[\"append\",[\"helper\",[\"markdown-block\"],null,[[\"class\",\"section\"],[\"route-localeIndex-card _about-site\",[\"helper\",[\"find-by\"],[\"id\",[\"helper\",[\"concat\"],[\"about-site-\",[\"get\",[\"model\",\"locale\"]]],null],[\"get\",[\"model\",\"markdownBlocks\"]]],null]]]],false],[\"text\",\"\\n  \"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/pods/locale/index/template.hbs" } });
});
define('lolma-us/pods/locale/route', ['exports', 'ember-route', 'ember-service/inject', 'rsvp', 'npm:lodash'], function (exports, _emberRoute, _emberServiceInject, _rsvp, _npmLodash) {
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  exports['default'] = _emberRoute['default'].extend({

    // ----- Services -----
    i18n: (0, _emberServiceInject['default'])(),
    moment: (0, _emberServiceInject['default'])(),

    // ----- Overridden properties -----

    // ----- Static properties -----

    // ----- Computed properties -----

    // ----- Overridden Methods -----
    model: function model(_ref) {
      var locale = _ref.locale;

      if (!['en', 'ru'].includes(locale)) locale = 'en';
      this.set('i18n.locale', locale);
      this.get('moment').changeLocale(locale);

      var store = this.get('store');
      var model = this.modelFor('application');

      return _rsvp['default'].hash(_extends({}, model, {
        locale: locale,
        markdownBlocks: this.getMarkdownBlocks({ store: store, locale: locale, website: model.website })
      }));
    },

    // ----- Custom Methods -----
    getMarkdownBlocks: function getMarkdownBlocks(_ref2) {
      var store = _ref2.store;
      var locale = _ref2.locale;
      var website = _ref2.website;

      var promises = website.hasMany('markdownBlocks').ids().filter(function (id) {
        return _npmLodash['default'].endsWith(id, '-' + locale);
      }).map(function (id) {
        return store.findRecord('markdown-block', id);
      });

      return _rsvp['default'].all(promises);
    },

    // ----- Events and observers -----

    // ----- Tasks -----

    // ----- Actions -----
    actions: {
      toggleLocale: function toggleLocale() {
        var oppositeLocale = this.get('i18n.oppositeLocale');
        var currentRouteName = this.get('router.currentRouteName');
        var currentHandlerInfos = this.get('router.router.currentHandlerInfos');

        var segments = currentHandlerInfos.slice(2).map(function (info) {
          return info._names.map(function (name) {
            return info.params[name];
          });
        }).reduce(function (result, item) {
          return result.concat(item);
        }, []); //flatten

        this.transitionTo.apply(this, [currentRouteName, oppositeLocale].concat(_toConsumableArray(segments)));
      }
    }
  });
});
define('lolma-us/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('lolma-us/router', ['exports', 'ember', 'lolma-us/config/environment'], function (exports, _ember, _lolmaUsConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _lolmaUsConfigEnvironment['default'].locationType,
    rootURL: _lolmaUsConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('locale', { path: ':locale' }, function () {
      this.route('foo', { path: ':fooZZ' }, function () {
        this.route('bar', { path: ':barZZ/:bazZZ' });
      });
    });
  });

  exports['default'] = Router;
});
define('lolma-us/routes/application', ['exports', 'ember'], function (exports, _ember) {

  // Ensure the application route exists for ember-simple-auth's `setup-session-restoration` initializer
  exports['default'] = _ember['default'].Route.extend();
});
define('lolma-us/serializers/_markdown', ['exports', 'ember-data/serializers/rest', 'ember-array/utils', 'npm:front-matter', 'npm:js-yaml'], function (exports, _emberDataSerializersRest, _emberArrayUtils, _npmFrontMatter, _npmJsYaml) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  exports['default'] = _emberDataSerializersRest['default'].extend({
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {
      var _frontMatter = (0, _npmFrontMatter['default'])(payload);

      var attributes = _frontMatter.attributes;
      var body = _frontMatter.body;

      // const relationships = attributes.relationships || {}

      if (attributes.id) {
        id = attributes.id;
        delete attributes.id;
      }
      // delete attributes.relationships
      attributes.body = body;

      return {
        data: {
          id: id,
          type: primaryModelClass.modelName,
          attributes: attributes
        }
      };
    },

    // relationships
    normalize: function normalize(modelClass, resourceHash) {
      return this.normalizeResponse(null, modelClass, resourceHash);
    },

    serialize: function serialize(snapshot, options) {
      var _this = this;

      var attributes = {};

      if (options && options.includeId && snapshot.id) attributes.id = snapshot.id;

      snapshot.eachAttribute(function (key, attribute) {
        _this.serializeAttribute(snapshot, attributes, key, attribute);
      });

      var body = attributes.body;
      delete attributes.body;

      var yaml = _npmJsYaml['default'].safeDump(attributes);

      return '---\n' + yaml + '\n---\n\n' + body;
    },

    pushPayload: function pushPayload(store, payload) {
      var key = Object.keys(payload)[0];
      var payloadFragment = payload[key];
      var modelName = this.modelNameFromPayloadKey(key);
      var type = store.modelFor(modelName);
      var typeSerializer = store.serializerFor(type.modelName);
      var documentHash = { included: [] };

      if ((0, _emberArrayUtils.isEmberArray)(payloadFragment)) {
        documentHash.data = [];

        payloadFragment.forEach(function (payloadItem) {
          var _documentHash$included;

          var _typeSerializer$normalize = typeSerializer.normalize(type, payloadItem, key);

          var data = _typeSerializer$normalize.data;
          var included = _typeSerializer$normalize.included;

          documentHash.data.push(data);
          if (included) (_documentHash$included = documentHash.included).push.apply(_documentHash$included, _toConsumableArray(included));
        });
      } else {
        var _documentHash$included2;

        var _typeSerializer$normalize2 = typeSerializer.normalize(type, payloadFragment, key);

        var data = _typeSerializer$normalize2.data;
        var included = _typeSerializer$normalize2.included;

        documentHash.data = data;
        if (included) (_documentHash$included2 = documentHash.included).push.apply(_documentHash$included2, _toConsumableArray(included));
      }

      return store.push(documentHash);
    }
  });
});
define('lolma-us/serializers/application', ['exports', 'ember-data/serializers/json', 'ember-array/utils', 'ember-string', 'ember'], function (exports, _emberDataSerializersJson, _emberArrayUtils, _emberString, _ember) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  var inflector = _ember['default'].Inflector.inflector;
  exports['default'] = _emberDataSerializersJson['default'].extend({
    // serialize (snapshot, options) {
    //   return {
    //     [snapshot.modelName]: this._super(snapshot, options)
    //   }
    // }

    pushPayload: function pushPayload(store, payload) {
      var key = Object.keys(payload)[0];
      var payloadFragment = payload[key];
      var modelName = this.modelNameFromPayloadKey(key);
      var type = store.modelFor(modelName);
      var typeSerializer = store.serializerFor(type.modelName);
      var documentHash = { included: [] };

      if ((0, _emberArrayUtils.isEmberArray)(payloadFragment)) {
        documentHash.data = [];

        payloadFragment.forEach(function (payloadItem) {
          var _documentHash$included;

          var _typeSerializer$normalize = typeSerializer.normalize(type, payloadItem, key);

          var data = _typeSerializer$normalize.data;
          var included = _typeSerializer$normalize.included;

          documentHash.data.push(data);
          if (included) (_documentHash$included = documentHash.included).push.apply(_documentHash$included, _toConsumableArray(included));
        });
      } else {
        var _documentHash$included2;

        var _typeSerializer$normalize2 = typeSerializer.normalize(type, payloadFragment, key);

        var data = _typeSerializer$normalize2.data;
        var included = _typeSerializer$normalize2.included;

        documentHash.data = data;
        if (included) (_documentHash$included2 = documentHash.included).push.apply(_documentHash$included2, _toConsumableArray(included));
      }

      return store.push(documentHash);
    },

    modelNameFromPayloadKey: function modelNameFromPayloadKey(key) {
      return inflector.singularize((0, _emberString.dasherize)(key));
    }
  });
});
define('lolma-us/serializers/markdown-block', ['exports', 'lolma-us/serializers/_markdown'], function (exports, _lolmaUsSerializers_markdown) {
  exports['default'] = _lolmaUsSerializers_markdown['default'].extend({});
});
define('lolma-us/serializers/project-info', ['exports', 'lolma-us/serializers/application', 'npm:lodash', 'ember-string'], function (exports, _lolmaUsSerializersApplication, _npmLodash, _emberString) {
  exports['default'] = _lolmaUsSerializersApplication['default'].extend({

    // ----- Overridden properties -----
    primaryKey: 'full_name',

    // ----- Overridden methods -----
    keyForAttribute: function keyForAttribute(key, method) {
      return (0, _emberString.underscore)(key);
    },

    normalize: function normalize(primaryModelClass, payload) {
      var newPayload = _npmLodash['default'].pick(payload, ['stargazers_count', 'full_name']);
      return this._super(primaryModelClass, newPayload);
    }
  });
});
define('lolma-us/serializers/project', ['exports', 'lolma-us/serializers/application'], function (exports, _lolmaUsSerializersApplication) {
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  exports['default'] = _lolmaUsSerializersApplication['default'].extend({
    extractRelationships: function extractRelationships(modelClass, resourceHash) {
      var projectId = resourceHash.id;
      var owner = resourceHash.owner || 'lolmaus';
      var id = owner + '/' + projectId;

      return _extends({}, this._super(modelClass, resourceHash), {
        projectInfo: { data: { id: id, type: 'project-info' } }
      });
    }
  });
});
define('lolma-us/serializers/stackoverflow-user', ['exports', 'lolma-us/serializers/application', 'ember-string'], function (exports, _lolmaUsSerializersApplication, _emberString) {
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  exports['default'] = _lolmaUsSerializersApplication['default'].extend({

    // ----- Overridden properties -----
    primaryKey: 'user_id',

    // ----- Overridden methods -----
    keyForAttribute: function keyForAttribute(key, method) {
      return (0, _emberString.underscore)(key);
    },

    normalize: function normalize(primaryModelClass, payload) {
      var user = payload.items[0];
      var newPayload = _extends({
        user_id: user.user_id,
        reputation: user.reputation
      }, user.badge_counts);
      return this._super(primaryModelClass, newPayload);
    },

    serialize: function serialize(snapshot, options) {
      var _super = this._super(snapshot, options);

      var user_id = _super.user_id;
      var reputation = _super.reputation;
      var bronze = _super.bronze;
      var silver = _super.silver;
      var gold = _super.gold;

      return {
        items: [{
          user_id: parseInt(user_id, 10),
          reputation: reputation,
          badge_counts: { bronze: bronze, silver: silver, gold: gold }
        }]
      };
    }
  });
});

// import _ from 'npm:lodash'
define('lolma-us/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('lolma-us/services/config', ['exports', 'ember-service', 'ember-service/inject', 'ember-computed', 'lolma-us/config/environment', 'ember-computed-template-string'], function (exports, _emberService, _emberServiceInject, _emberComputed, _lolmaUsConfigEnvironment, _emberComputedTemplateString) {
  exports['default'] = _emberService['default'].extend({

    // ----- Services -----
    fastboot: (0, _emberServiceInject['default'])(),
    i18n: (0, _emberServiceInject['default'])(),

    // ----- Overridden properties -----

    // ----- Static properties -----
    envVars: _lolmaUsConfigEnvironment['default'].envVars,
    host: (0, _emberComputed.alias)('envVars.LMS_HOST'),
    gatekeeperUrl: (0, _emberComputed.alias)('envVars.LMS_GATEKEEPER_URL'),
    namespace: '/content',

    // ----- Computed properties -----
    contentApiHost: (0, _emberComputed['default'])('fastboot.isFastBoot', 'host', function () {
      return this.get('fastboot.isFastBoot') ? 'http://127.0.0.1:8081' : this.get('host');
    }),

    redirectUri: Ember.computed('host', 'i18n.locale', function () {
      return this.get('host') + '/' + this.get('i18n.locale');
    })

    // ----- Overridden Methods -----

    // ----- Custom Methods -----

    // ----- Events and observers -----

    // ----- Tasks -----

  });
});
define('lolma-us/services/cookies', ['exports', 'ember-cookies/services/cookies', 'ember-array/utils'], function (exports, _emberCookiesServicesCookies, _emberArrayUtils) {
  exports['default'] = _emberCookiesServicesCookies['default'].extend({

    // ----- Services -----

    // ----- Overridden properties -----

    // ----- Static properties -----

    // ----- Computed properties -----

    // ----- Overridden Methods -----

    // https://github.com/simplabs/ember-cookies/pull/27
    _filterCachedFastBootCookies: function _filterCachedFastBootCookies(fastBootCookiesCache) {
      var _get = this.get('_fastBoot.request');

      var requestPath = _get.path;
      var protocol = _get.protocol;

      // cannot use deconstruct here
      var host = this.get('_fastBoot.request.host');

      return (0, _emberArrayUtils.A)(Object.keys(fastBootCookiesCache)).reduce(function (acc, name) {
        var _fastBootCookiesCache$name = fastBootCookiesCache[name];
        var value = _fastBootCookiesCache$name.value;
        var options = _fastBootCookiesCache$name.options;

        options = options || {};

        var _options = options;
        var optionsPath = _options.path;
        var domain = _options.domain;
        var expires = _options.expires;
        var secure = _options.secure;

        if (optionsPath && requestPath && requestPath.indexOf(optionsPath) !== 0) {
          return acc;
        }

        if (domain && host.indexOf(domain) + domain.length !== host.length) {
          return acc;
        }

        if (expires && expires < new Date()) {
          return acc;
        }

        if (secure && protocol !== 'https') {
          return acc;
        }

        acc[name] = value;
        return acc;
      }, {});
    }

  });
});
// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----
define('lolma-us/services/fastboot', ['exports', 'ember'], function (exports, _ember) {
  var deprecate = _ember['default'].deprecate;
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  var deprecatingAlias = computed.deprecatingAlias;
  var readOnly = computed.readOnly;

  var RequestObject = _ember['default'].Object.extend({
    init: function init() {
      this._super.apply(this, arguments);

      var request = this.request;
      delete this.request;

      this.cookies = request.cookies;
      this.headers = request.headers;
      this.queryParams = request.queryParams;
      this.path = request.path;
      this.protocol = request.protocol;
      this._host = function () {
        return request.host();
      };
    },

    host: computed(function () {
      return this._host();
    })
  });

  var Shoebox = _ember['default'].Object.extend({
    put: function put(key, value) {
      _ember['default'].assert('shoebox.put is only invoked from the FastBoot rendered application', this.get('fastboot.isFastBoot'));
      _ember['default'].assert('the provided key is a string', typeof key === 'string');

      var fastbootInfo = this.get('fastboot._fastbootInfo');
      if (!fastbootInfo.shoebox) {
        fastbootInfo.shoebox = {};
      }

      fastbootInfo.shoebox[key] = value;
    },

    retrieve: function retrieve(key) {
      if (this.get('fastboot.isFastBoot')) {
        var shoebox = this.get('fastboot._fastbootInfo.shoebox');
        if (!shoebox) {
          return;
        }

        return shoebox[key];
      }

      var shoeboxItem = this.get(key);
      if (shoeboxItem) {
        return shoeboxItem;
      }

      var el = document.querySelector('#shoebox-' + key);
      if (!el) {
        return;
      }
      var valueString = el.textContent;
      if (!valueString) {
        return;
      }

      shoeboxItem = JSON.parse(valueString);
      this.set(key, shoeboxItem);

      return shoeboxItem;
    }
  });

  exports['default'] = _ember['default'].Service.extend({
    cookies: deprecatingAlias('request.cookies', { id: 'fastboot.cookies-to-request', until: '0.9.9' }),
    headers: deprecatingAlias('request.headers', { id: 'fastboot.headers-to-request', until: '0.9.9' }),

    init: function init() {
      this._super.apply(this, arguments);

      var shoebox = Shoebox.create({ fastboot: this });
      this.set('shoebox', shoebox);
    },

    host: computed(function () {
      deprecate('Usage of fastboot service\'s `host` property is deprecated.  Please use `request.host` instead.', false, { id: 'fastboot.host-to-request', until: '0.9.9' });

      return this._fastbootInfo.request.host();
    }),

    response: readOnly('_fastbootInfo.response'),
    metadata: readOnly('_fastbootInfo.metadata'),

    request: computed(function () {
      if (!get(this, 'isFastBoot')) return null;
      return RequestObject.create({ request: get(this, '_fastbootInfo.request') });
    }),

    isFastBoot: computed(function () {
      return typeof FastBoot !== 'undefined';
    }),

    deferRendering: function deferRendering(promise) {
      _ember['default'].assert('deferRendering requires a promise or thennable object', typeof promise.then === 'function');
      this._fastbootInfo.deferRendering(promise);
    }
  });
});
/* global FastBoot */
define('lolma-us/services/head-data', ['exports', 'ember-cli-head/services/head-data'], function (exports, _emberCliHeadServicesHeadData) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliHeadServicesHeadData['default'];
    }
  });
});
define('lolma-us/services/i18n', ['exports', 'ember-i18n/services/i18n', 'ember-computed'], function (exports, _emberI18nServicesI18n, _emberComputed) {
  exports['default'] = _emberI18nServicesI18n['default'].extend({

    // ----- Services -----

    // ----- Overridden properties -----

    // ----- Static properties -----

    // ----- Computed properties -----
    oppositeLocale: (0, _emberComputed['default'])('locale', function () {
      return this.get('locale') === 'en' ? 'ru' : 'en';
    })

  });
});
// ----- Overridden Methods -----

// ----- Custom Methods -----

// ----- Events and observers -----

// ----- Tasks -----
define('lolma-us/services/moment', ['exports', 'ember', 'lolma-us/config/environment', 'ember-moment/services/moment'], function (exports, _ember, _lolmaUsConfigEnvironment, _emberMomentServicesMoment) {
  exports['default'] = _emberMomentServicesMoment['default'].extend({
    defaultFormat: _ember['default'].get(_lolmaUsConfigEnvironment['default'], 'moment.outputFormat')
  });
});
define('lolma-us/services/popup', ['exports', 'torii/services/popup'], function (exports, _toriiServicesPopup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _toriiServicesPopup['default'];
    }
  });
});
define('lolma-us/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _emberSimpleAuthServicesSession) {
  exports['default'] = _emberSimpleAuthServicesSession['default'];
});
define('lolma-us/services/torii-session', ['exports', 'torii/services/session'], function (exports, _toriiServicesSession) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _toriiServicesSession['default'];
    }
  });
});
define('lolma-us/services/torii', ['exports', 'torii/services/torii'], function (exports, _toriiServicesTorii) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _toriiServicesTorii['default'];
    }
  });
});
define('lolma-us/session-stores/application', ['exports', 'ember-simple-auth/session-stores/cookie', 'ember-computed'], function (exports, _emberSimpleAuthSessionStoresCookie, _emberComputed) {
  // import RSVP from 'rsvp'
  // import config from 'lolma-us/config/environment'

  exports['default'] = _emberSimpleAuthSessionStoresCookie['default'].extend({

    // ----- Services -----
    _secureCookies: (0, _emberComputed['default'])(function () {
      if (this.get('_fastboot.isFastBoot')) return this.get('_fastboot.request.protocol') === 'https';
      return window.location.protocol === 'https:';
    }).volatile()
  });
});
define("lolma-us/templates/head", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": null, "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"link\",[]],[\"static-attr\",\"href\",\"https://fonts.googleapis.com/css?family=PT+Sans+Caption|PT+Sans:400,400i,700&subset=cyrillic\"],[\"static-attr\",\"rel\",\"stylesheet\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"redirectToEn\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"meta\",[]],[\"static-attr\",\"http-equiv\",\"refresh\"],[\"static-attr\",\"content\",\"0; url=/en\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "lolma-us/templates/head.hbs" } });
});
define('lolma-us/torii-providers/github-oauth2', ['exports', 'ember-service/inject', 'ember-computed', 'torii/providers/github-oauth2'], function (exports, _emberServiceInject, _emberComputed, _toriiProvidersGithubOauth2) {
  exports['default'] = _toriiProvidersGithubOauth2['default'].extend({

    // ----- Services -----
    config: (0, _emberServiceInject['default'])(),

    // ----- Overridden methods -----
    fetch: function fetch(data) {
      return data;
    },

    redirectUri: (0, _emberComputed.alias)('config.redirectUri')
  });
});
define("lolma-us/utils/fetch-github", ["exports", "lolma-us/utils/fetch-rsvp", "rsvp"], function (exports, _lolmaUsUtilsFetchRsvp, _rsvp) {
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  exports["default"] = fetchGitHub;

  function fetchGitHub(url, sessionService) {
    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var _ref$mode = _ref.mode;
    var mode = _ref$mode === undefined ? 'json' : _ref$mode;
    var _ref$method = _ref.method;
    var method = _ref$method === undefined ? 'GET' : _ref$method;

    var fullUrl = "https://api.github.com/" + url;
    var token = sessionService && sessionService.get('data.authenticated.token');

    return (0, _lolmaUsUtilsFetchRsvp.fetchRsvpRaw)(fullUrl, {
      method: method,
      headers: _extends({
        Accept: 'application/vnd.github.v3+json'
      }, token ? { Authorization: "token " + token } : {})
    }).then(function (response) {
      if (method && response.status >= 400) return _rsvp["default"].reject(response);
      return response;
    }).then(function (response) {
      return mode === 'json' ? response.json() : mode === 'text' ? response.text() : response;
    })["catch"](function (response) {
      if (response.status === 401 && sessionService && sessionService.get('isAuthenticated')) {
        sessionService.invalidate();
        return null;
      }

      return _rsvp["default"].reject(response);
    });
  }
});
define("lolma-us/utils/fetch-rsvp", ["exports", "rsvp", "ember-network/fetch"], function (exports, _rsvp, _emberNetworkFetch) {
  exports.fetchRsvpRaw = fetchRsvpRaw;
  exports.fetchRsvpText = fetchRsvpText;
  exports["default"] = fetchRsvpJson;

  function fetchRsvpRaw() {
    var promise = _emberNetworkFetch["default"].apply(undefined, arguments);

    return new _rsvp["default"].Promise(function (resolve, reject) {
      promise.then(resolve, reject);
    });
  }

  function fetchRsvpText() {
    return fetchRsvpRaw.apply(undefined, arguments).then(function (response) {
      if (response.status < 400) return response;
      return _rsvp["default"].reject(response);
    }).then(function (response) {
      return response.text();
    });
  }

  function fetchRsvpJson() {
    return fetchRsvpRaw.apply(undefined, arguments).then(function (response) {
      if (response.status < 400) return response;
      return _rsvp["default"].reject(response);
    }).then(function (response) {
      return response.json();
    });
    // .then(response => (console.log('response', response), response))
  }
});
define('lolma-us/utils/i18n/compile-template', ['exports', 'ember-i18n/utils/i18n/compile-template'], function (exports, _emberI18nUtilsI18nCompileTemplate) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberI18nUtilsI18nCompileTemplate['default'];
    }
  });
});
define('lolma-us/utils/i18n/missing-message', ['exports', 'ember-i18n/utils/i18n/missing-message'], function (exports, _emberI18nUtilsI18nMissingMessage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberI18nUtilsI18nMissingMessage['default'];
    }
  });
});
define("lolma-us/utils/random-string", ["exports"], function (exports) {
  exports["default"] = randomString;

  function randomString() {
    return Math.random().toString(36).substr(2);
  }
});
define('lolma-us/utils/titleize', ['exports', 'ember-composable-helpers/utils/titleize'], function (exports, _emberComposableHelpersUtilsTitleize) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersUtilsTitleize['default'];
    }
  });
});
define('lolma-us/utils/wait', ['exports', 'rsvp'], function (exports, _rsvp) {
  exports['default'] = wait;

  function wait() {
    var ms = arguments.length <= 0 || arguments[0] === undefined ? 1000 : arguments[0];

    return new _rsvp['default'].Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('lolma-us/config/environment', ['ember'], function(Ember) {
  var prefix = 'lolma-us';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("lolma-us/app")["default"].create({"name":"lolma-us","version":"0.0.0+675e08c2"});
}

define('~fastboot/app-factory', ['lolma-us/app', 'lolma-us/config/environment'], function(App, config) {
  App = App['default'];
  config = config['default'];

  return {
    'default': function() {
      return App.create(config.APP);
    }
  };
});


/* jshint ignore:end */
//# sourceMappingURL=lolma-us.map
