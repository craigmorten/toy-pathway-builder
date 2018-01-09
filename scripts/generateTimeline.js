const csvToJson = require('./csvToJson.js');

csvToJson.run(() => {
    const toTimeline = require('./toTimelineFile.js');
    toTimeline.run();
});