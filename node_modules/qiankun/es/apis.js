import _noop from "lodash/noop";
import { __assign, __awaiter, __generator, __read, __rest, __spread } from "tslib";
import { mountRootParcel, registerApplication, start as startSingleSpa } from 'single-spa';
import { loadApp } from './loader';
import { doPrefetchStrategy } from './prefetch';
import { Deferred, toArray } from './utils';
window.__POWERED_BY_QIANKUN__ = true;
var microApps = []; // eslint-disable-next-line import/no-mutable-exports

export var frameworkConfiguration = {};
var frameworkStartedDefer = new Deferred();
export function registerMicroApps(apps, lifeCycles) {
  var _this = this; // Each app only needs to be registered once


  var unregisteredApps = apps.filter(function (app) {
    return !microApps.some(function (registeredApp) {
      return registeredApp.name === app.name;
    });
  });
  microApps = __spread(microApps, unregisteredApps);
  unregisteredApps.forEach(function (app) {
    var name = app.name,
        activeRule = app.activeRule,
        _a = app.loader,
        loader = _a === void 0 ? _noop : _a,
        props = app.props,
        appConfig = __rest(app, ["name", "activeRule", "loader", "props"]);

    registerApplication({
      name: name,
      app: function app() {
        return __awaiter(_this, void 0, void 0, function () {
          var _a, mount, otherMicroAppConfigs;

          var _this = this;

          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                loader(true);
                return [4
                /*yield*/
                , frameworkStartedDefer.promise];

              case 1:
                _b.sent();

                return [4
                /*yield*/
                , loadApp(__assign({
                  name: name,
                  props: props
                }, appConfig), frameworkConfiguration, lifeCycles)];

              case 2:
                _a = _b.sent(), mount = _a.mount, otherMicroAppConfigs = __rest(_a, ["mount"]);
                return [2
                /*return*/
                , __assign({
                  mount: __spread([function () {
                    return __awaiter(_this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2
                        /*return*/
                        , loader(true)];
                      });
                    });
                  }], toArray(mount), [function () {
                    return __awaiter(_this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2
                        /*return*/
                        , loader(false)];
                      });
                    });
                  }])
                }, otherMicroAppConfigs)];
            }
          });
        });
      },
      activeWhen: activeRule,
      customProps: props
    });
  });
}
export function loadMicroApp(app, configuration) {
  if (configuration === void 0) {
    configuration = frameworkConfiguration;
  }

  var props = app.props,
      appConfig = __rest(app, ["props"]);

  return mountRootParcel(function () {
    return loadApp(appConfig, configuration);
  }, __assign({
    domElement: document.createElement('div')
  }, props));
}
export function start(opts) {
  if (opts === void 0) {
    opts = {};
  }

  frameworkConfiguration = __assign({
    prefetch: true,
    singular: true,
    sandbox: true
  }, opts);

  var prefetch = frameworkConfiguration.prefetch,
      sandbox = frameworkConfiguration.sandbox,
      singular = frameworkConfiguration.singular,
      urlRerouteOnly = frameworkConfiguration.urlRerouteOnly,
      importEntryOpts = __rest(frameworkConfiguration, ["prefetch", "sandbox", "singular", "urlRerouteOnly"]);

  if (prefetch) {
    doPrefetchStrategy(microApps, prefetch, importEntryOpts);
  }

  if (sandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox'); // 快照沙箱不支持非 singular 模式

      if (!singular) {
        console.error('[qiankun] singular is forced to be true when sandbox enable but proxySandbox unavailable');
        frameworkConfiguration.singular = true;
      }
    }
  }

  startSingleSpa({
    urlRerouteOnly: urlRerouteOnly
  });
  frameworkStartedDefer.resolve();
}