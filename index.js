"use strict";

const Pass = require("src/pass");

Pass.isAvailable().then(() => {
  const _ = require("sdk/l10n").get;
  const cm = require("sdk/context-menu");

  // Add a context menu item for password inputs.
  cm.Item({
    label: _("ui.ctx.label"),
    context: cm.SelectorContext("input[type='password']"),
    contentScript: "self.on('click', self.postMessage)",
    onMessage: ev => {

    }
  });
}, stderr => {
  console.error("pass is not available. Add-on functionality disabled.");
});
