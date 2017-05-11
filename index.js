var fs = require('fs');
var xml2js = require('xml2js');

var arg = process.argv[2];
if (arg !== 'major' && arg !== 'minor' && arg !== 'patch') {
  console.log('Invalid argument. Must be \'major\', \'minor\', or \'patch\'.');
  return;
}

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/config.xml', function (err, data) {
  if (err) {
    console.error(err);
  } else {
    parser.parseString(data, function (err, result) {
      if (err) {
        console.error(err);
      } else {
        result.widget.$['android-versionCode'] = increaseAndroidVersion(result.widget.$['android-versionCode']);
        result.widget.$.version = increaseVersion(result.widget.$.version, process.argv[2]);
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(result);
        writeToFile(xml);
        console.log("Version bumped to: ", result.widget.$.version);
      }
    });
  }
});

function increaseAndroidVersion(oldVersion) {
  var androidVersionCode = parseInt(oldVersion);
  androidVersionCode++;
  return androidVersionCode.toString();
}

function increaseVersion(oldVersion, amount) {
  var version = oldVersion.split('.');
  var major = version[0];
  var minor = version[1];
  var patch = version[2];
  switch (amount) {
    case 'major':
      version[0] = parseInt(major) + 1;
      version[1] = 0;
      version[2] = 0;
      break;
    case 'minor':
      version[1] = parseInt(minor) + 1;
      version[2] = 0;
      break;
    case 'patch':
      version[2] = parseInt(patch) + 1;
      break;
  }
  return version.join('.');
}

function writeToFile(xml) {
  fs.writeFile("./config.xml", xml + '\n', function (err) {
    if (err) {
      return console.log(err);
    }
  });
}