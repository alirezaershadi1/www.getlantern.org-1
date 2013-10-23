'use strict';

angular.module('GetLanternSiteApp', [
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'angular-google-analytics'
  ],
  ['$translateProvider', 'constants', 'translations', function ($translateProvider, constants, translations) {
    angular.forEach(translations, function (transTable, langCode) {
      $translateProvider.translations(langCode, transTable);
    });
    $translateProvider.useCookieStorage();
    $translateProvider.preferredLanguage(negotiatedLang() || constants.DEFAULT_LANGCODE);
    $translateProvider.fallbackLanguage(constants.DEFAULT_LANGCODE);

    function negotiatedLang() {
      // requires session.js
      var langPref = window.session && window.session.locale && window.session.locale.lang;
      if (!langPref) {
        return;
      }
      var countryPref = window.session.locale.country,
          bestMatch;
      for (var lc in constants.LANGS) {
        var split = lc.split('_'),
            langAvail = split[0];
        if (langAvail === langPref) {
          var countryAvail = angular.lowercase(split[1]);
          if (countryAvail === countryPref) {
            //console.debug('exact match:', lc);
            return lc;
          }
          // if we had access to the list of the browser's weighted preferences
          // we could do something smarter
          bestMatch = bestMatch || lc;
        }
      }
      //console.debug('best match:', bestMatch);
      return bestMatch;
    }
  }])
  .run(['$rootScope', '$translate', 'constants', function ($rootScope, $translate, constants) {
    angular.forEach(constants, function (value, key) {
      $rootScope[key] = value;
    });
    $rootScope.activeLang = constants.LANGS[$translate.uses()];

    $rootScope.changeLang = function (langCode) {
      $rootScope.activeLang = constants.LANGS[langCode];
      $translate.uses(langCode);
    };
  }])
  .config(['AnalyticsProvider', 'constants', function (AnalyticsProvider, constants) {
    AnalyticsProvider.setAccount(constants.GA_ACCOUNT_ID);
  }]);
