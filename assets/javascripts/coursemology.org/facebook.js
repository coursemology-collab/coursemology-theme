// The official Facebook SDK does not play well with Turbolinks. To get it to
// work, some workarounds are needed, which are explained below.
//
// There needs to be some coordination between the HTML and the JavaScript. The
// HTML looks like this:
//
//   body
//     #fb-root[data-turbolinks-permanent]
//     / The code below does not come from FB
//     javascript:
//       typeof FB !== "undefined" && FB !== null ? FB.XFBML.parse() : void 0;
//
//   ...
//
//   div.fb-like[data-href="https://www.facebook.com/coursemology"
//               data-width="20"
//               data-layout="button_count"
//               data-action="like"
//               data-size="small"
//               data-show-faces="false"
//               data-share="false"]
//
// The SDK requires that the first element in the body is div#fb-root, which is
// the mechanism that the SDK uses to communicate with the Facebook servers.
// Because we are using Turbolinks, upon each visit, the contents of #fb-root
// would be lost. We need to give it the attribute data-turbolinks-permanent,
// so that the contents of #fb-root are persisted across Turbolinks visits.
//
// Immediately after #fb-root is parsed, we need to execute
//
//   typeof FB !== "undefined" && FB !== null ? FB.XFBML.parse() : void 0;
//
// The like button itself is represented by div.fb-like. We cannot use the same
// data-turbolinks-permanent trick to persist it across Turbolinks visits
// because within it there is an iframe that fails to be persisted to the new
// page properly. To work around that, we can only load an empty div.fb-like
// upon each Turbolinks visit and then use the above code to re-activate the
// SDK, which will in turn transform the empty div to the Facebook like button.
//
// The code,
//
//   typeof FB !== "undefined" && FB !== null ? FB.XFBML.parse() : void 0;
//
// , is a bit of a hack and relies on the fact that enough of the Facebook SDK
// is retained across Turbolinks visits such that the above code is able to
// bring it back to life.
var loadFacebookSDK;

$(function() {
  loadFacebookSDK();
});

loadFacebookSDK = function() {
  // The code in this function came from FB's code generator verbatim
  /* jshint ignore:start */
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7";
            fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  /* jshint ignore:end */
};
