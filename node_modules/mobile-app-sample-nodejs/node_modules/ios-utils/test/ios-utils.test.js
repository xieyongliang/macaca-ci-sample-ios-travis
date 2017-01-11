'use strict';

var iOSUtils = require('..');

describe('test', function() {
  it('should be ok', function *() {
    var xcodePath = yield iOSUtils.getXcodePath();
    xcodePath.should.be.ok();
    console.log(xcodePath);
    var xcodeVersion = yield iOSUtils.getXcodeVersion();
    xcodeVersion.should.be.ok();
    console.log(xcodeVersion);
    var iOSSDKVersion = yield iOSUtils.getIOSSDKVersion();
    iOSSDKVersion.should.be.ok();
    console.log(iOSSDKVersion);
  });
});
