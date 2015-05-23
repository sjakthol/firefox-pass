"use strict";

const { spawn } = require("sdk/system/child_process");
const { env } = require('sdk/system/environment');

module.exports = {
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
          "PATH": env.PATH,
          "HOME": env.HOME,
        }
      });

      process.stdout.on("data", s => stdout += s);
      process.stderr.on("data", s => stderr += s);

      return new Promise((resolve, reject) => {
        process.on("close", status => {
          if (status === 0) {
            resolve(stdout);
          } else {
            reject(stderr);
          }
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
