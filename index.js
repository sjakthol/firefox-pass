"use strict";

const _ = require("sdk/l10n").get;
const { notify } = require("sdk/notifications");
const Pass = require("src/pass");

Pass.isAvailable().then(() => {
  return Pass.listPasswords();
}).then(sites => {
  const cm = require("sdk/context-menu");
  const { URL } = require("sdk/url");
  const { clearTimeout, setTimeout } = require("sdk/timers");

  let hostnamePredicate = context => {
    let host = URL(context.documentURL).host;
    if (!host || typeof host !== "string" || !host.length) {
      return false;
    }

    return !!sites.find(site => site.endsWith(host));
  };

  // Show the menu item if it opens on a password input and the URL of the
  // frame is stored in the manager.
  let context = [cm.SelectorContext("input[type='password']"),
                 cm.PredicateContext(hostnamePredicate)];

  cm.Item({
    label: _("ui.ctx.label"),
    context: context,
    contentScript: "self.on('click', _ => self.postMessage(_.ownerDocument.URL))",
    onMessage: url => {
      let host = URL(url).host;
      let site = sites.find(site => site.endsWith(host));

      // Show the success notification on a timeout as a successful copy is
      // blocks the pass command for 45 seconds.
      let successNotificationTimeout = setTimeout(() => {
        notify({
          title: _("ui.notification.success.title"),
          text: _("ui.notification.success.body")
        });
      }, 500);

      Pass.copyToClipboard(site).catch(err => {
        // Cancel the success notification.
        clearTimeout(successNotificationTimeout);
        notify({
          title: _("ui.notification.error.title"),
          text: _("ui.notification.error.body")
        });
      });
    }
  });
}).catch(err => {
  console.log(err);
  notify({
    title: _("ui.notification.initFail.title"),
    text: _("ui.notification.initFail.body")
  });
});
