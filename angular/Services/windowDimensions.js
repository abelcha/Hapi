/*
 * Detects on which browser the user is navigating
 *
 * Usage:
 * var browser = detectBrowser();
 *
 */
angular.module('edison').service('detectBrowser', ['$window',
  function($window) {

    // http://stackoverflow.com/questions/22947535/how-to-detect-browser-using-angular
    return function() {
      var userAgent = $window.navigator.userAgent,
        browsers = {
          chrome: /chrome/i,
          safari: /safari/i,
          firefox: /firefox/i,
          ie: /internet explorer/i
        };

      for (var key in browsers) {
        if (browsers[key].test(userAgent)) {
          return key;
        }
      }

      return 'unknown';
    }
  }
]);

/*
 * Get window height and width
 *
 * Usage:
 * windowDimensions.height();
 * windowDimensions.width();
 *
 */
angular.module('edison').factory('windowDimensions', ['$window', 'detectBrowser',
  function($window, detectBrowser) {
    var browser = detectBrowser();

    return {
      height: function() {
        return (browser === 'safari') ? document.documentElement.clientHeight : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      },

      width: function() {
        console.log('watchDimensions')
        return (browser === 'safari') ? document.documentElement.clientWidth : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      }
    }
  }
]);

/*
 * Watch window resizing event to set new window dimensions,
 * and broadcast the event to the app
 *
 * Usage:
 * <html watch-window-resize>...</html>
 *
 * Bind the resize event:
   $scope.$on('watchWindowResize::resize', function() {
       // Do something
   });
 *
 */
angular.module('edison').directive('watchWindowResize', ['$window', '$timeout', 'windowDimensions',
  function($window, $timeout, windowDimensions) {

    return {
      link: function($scope) {
        // Get window's dimensions
        $scope.getDimensions = function() {

          // Namespacing events with name of directive + event to avoid collisions
          // http://stackoverflow.com/questions/23272169/what-is-the-best-way-to-bind-to-a-global-event-in-a-angularjs-directive
          $scope.$broadcast('watchWindowResize::resize', {
            height: windowDimensions.height(),
            width: windowDimensions.width()
          });
        }

        // On window resize...
        angular.element($window).on('resize', function(e) {

          // Reset timeout
          $timeout.cancel($scope.resizing);

          // Add a timeout to not call the resizing function every pixel
          $scope.resizing = $timeout(function() {

            $scope.getDimensions();
          }, 300);
        });
      }
    }
  }
]);
