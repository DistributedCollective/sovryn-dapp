const core = require('@actions/core');
const pinataSDK = require('@pinata/sdk');

function getPinList(pinata, pinName, pinEnd) {
  console.log(
    `Calling API to get pin list with pinName ${pinName} before ${pinEnd}`,
  );
  return pinata.pinList({
    status: 'pinned',
    pageLimit: 1000,
    metadata: { name: pinName },
    pinEnd: pinEnd,
  });
}

async function unpinList(pinata, pins) {
  for (var pin of pins.rows) {
    pinata.unpin(pin.ipfs_pin_hash).catch(e => {
      console.log(e);
    });
  }
}

try {
  // inputs are defined in action metadata file
  const pinataKey = core.getInput('pinataKey');
  const pinataSecret = core.getInput('pinataSecret');
  const pinName = core.getInput('pinName');
  const pinEndTimestamp = core.getInput('pinEndTimestamp');
  console.log('pinEndTimestamp');
  console.log(pinEndTimestamp);
  const pinEndDate = new Date(pinEndTimestamp * 1000);
  const pinEnd = pinEndDate.toISOString();
  const pinata = new pinataSDK(pinataKey, pinataSecret);
  console.log(`Pin Name: ${pinName}`);
  getPinList(pinata, pinName, pinEnd).then(pins => {
    console.log(`Processing a total of ${pins.rows.length}`);
    unpinList(pinata, pins);
  });
} catch (error) {
  core.setFailed(error.message);
}
