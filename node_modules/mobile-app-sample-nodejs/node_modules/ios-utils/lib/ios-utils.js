'use strict';

const path = require('path');

const _ = require('./helper');

exports.getXcodePath = function() {
  var args = Array.prototype.slice.call(arguments);
  var cmd = 'xcode-select --print-path';

  if (args.length) {
    var cb = args[0];

    if (typeof cb === 'function') {
      _.exec(cmd).then(data => {
        cb.call(this, null, data);
      }).catch(err => {
        cb.call(this, `exec ${cmd} error with: ${err}`);
      });
    } else {
      console.log('get xcode path failed');
    }
  } else {
    return _.exec(cmd);
  }
};

exports.getXcodeVersion = function() {
  var args = Array.prototype.slice.call(arguments);

  if (args.length) {
    var cb = args[0];

    if (typeof cb === 'function') {
      this.getXcodePath().then(xcodePath => {
        var plistPath = path.resolve(xcodePath, '..', 'Info.plist');
        var cmd = `/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "${plistPath}"`;
        _.exec(cmd).then(data => {
          cb.call(this, null, data);
        }).catch(err => {
          cb.call(this, `exec ${cmd} error with: ${err}`);
        });
      });
    } else {
      console.log('get xcode version failed');
    }
  } else {
    return new Promise((resolve, reject) => {
      this.getXcodePath().then(xcodePath => {
        var plistPath = path.resolve(xcodePath, '..', 'Info.plist');
        var cmd = `/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "${plistPath}"`;
        _.exec(cmd).then(data => {
          resolve(data);
        }).catch(err => {
          reject(`exec ${cmd} error with: ${err}`);
        });
      });

    });
  }
};

exports.getIOSSDKVersion = function() {
  var args = Array.prototype.slice.call(arguments);
  var cmd = 'xcrun --sdk iphonesimulator --show-sdk-version';

  if (args.length) {
    var cb = args[0];

    if (typeof cb === 'function') {
      _.exec(cmd).then(data => {
        cb.call(this, null, data);
      }).catch(err => {
        cb.call(this, `exec ${cmd} error with: ${err}`);
      });
    } else {
      console.log('get ios sdk version failed');
    }
  } else {
    return _.exec(cmd);
  }
};

exports.getBundleId = function() {
  var args = Array.prototype.slice.call(arguments);
  const app = path.resolve(args[0]);
  const plistPath = path.resolve(app, 'Info.plist');

  if (args.length > 1) {
    var cb = args[1];

    _.bplist.parseFile(plistPath, (err, obj) => {
      if (err) {
        return cb.call(this, `get bundleId failed with: ${err}`);
      }
      const bundleId = obj[0].CFBundleIdentifier;

      if (!bundleId) {
        return cb.call(this, `There is no bundleId in plist: ${plistPath}`);
      }
      console.log(`Get bundleId ${bundleId} from plist ${plistPath}`);
      cb.call(this, null, bundleId);
    });
  } else {
    return new Promise(resolve => {
      const cmd = `/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" "${plistPath}"`;

      _.exec(cmd).then(bundleId => {
        console.log(`CFBundleIdentifier is ${bundleId}`);
        console.log(`Get bundleId ${bundleId} from plist ${plistPath}`);
        resolve(bundleId);
      });
    });
  }
};

exports.getDeviceInfo = function(udid) {
  return {
    isIOS: udid.length === 36 || udid.length === 40,
    isRealIOS: udid.length === 40 && !udid.includes('-')
  };
};
