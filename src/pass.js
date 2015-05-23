"use strict";

const { spawn } = require("sdk/system/child_process");
const { env } = require('sdk/system/environment');
const { notify } = require("sdk/notifications");
const { get: _ } = require("sdk/l10n");

module.exports = {
  /**
   * Copies the password @param item to clipboard.
   *
   * @param {String} item - The password item to copy.
   */
  copyToClipboard: function(item) {
    this._spawn(["-c", item])
      .catch(() => {
        notify({
          title: _("ui.notify.error.title"),
          text: _("ui.notify.error.body", item),
        });
      });
  },

  /**
   * Test if the pass utility is installed and configured.
   *
   * @returns Promise - A promise that resolves if the utility is in use,
   * rejects otherwise.
   */
  isAvailable: function() {
    return this._spawn();
  },

  /**
   * Retrieves an updated list of passwords from 'pass'.
   *
   * @returns Promise - A promise that resolves with an array of item names or
   * rejects if an error occurs.
   */
  listPasswords: function() {
    return this._spawn().then(output => {
      return output.split("\n")
        .filter(item => item.startsWith("|-- ")) // only take the toplevel items
        .map(item => item.split("|-- ")[1]);
    });
  },

  /**
   * Spawns the pass utility with given parameters.
   *
   * @param {Array} parameters - The command line parameters to call 'pass' with.
   *
   * @returns Promise - A promise that resolves with the stdout contents if the
   * process exits with status 0 and rejects with stderr contents if the exit
   * status is non-zero.
   */
  _spawn: function(parameters) {
    try {
      let stdout = "";
      let stderr = "";
      let process = spawn("/usr/bin/pass", parameters || [], {
        env: {
          GPG_AGENT_INFO: env.GPG_AGENT_INFO,
          DISPLAY: env.DISPLAY,
          PATH: env.PATH,
          HOME: env.HOME,
        }
      });

      process.stdout.on("data", s => stdout += s);
      process.stderr.on("data", s => stderr += s);

      return new Promise((resolve, reject) => {
        process.on("close", status => {
          if (status === 0) {
            resolve(stdout);
          } else {
            console.error("pass exited with code " + status);
            console.log("stdout:");
            console.log(stdout);
            console.log("stderr:");
            console.log(stderr);
            reject(stderr);
          }
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
