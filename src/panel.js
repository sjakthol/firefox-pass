const { Panel } = require("sdk/panel");
const tabs = require("sdk/tabs");
const { URL } = require("sdk/url");

const Pass = require("./pass");

let panel = module.exports = Panel({
  contentURL: "./selector-panel.html",
  contentScriptFile: "./selector-panel.js",
  onShow: () => {
    Pass.listPasswords()
      .then(items => {
        panel.port.emit("select", items, getActiveTabDomain());
      }).catch(err => {
        panel.port.emit("error");
      });
  },

  onHide: () => {
    panel.port.emit("reset");
  },
});

panel.port.on("item-selected", item => {
  panel.hide();
  console.log("Selected " + item);
});

function getActiveTabDomain() {
  return URL(tabs.activeTab.url).hostname || "";
}
