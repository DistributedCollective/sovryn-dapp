const core = require('@actions/core');
const pinataSDK = require('@pinata/sdk');

function getPinList(pinata) {
  return pinata.pinList({
    status: 'pinned',
    pageLimit: 1000,
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

  const pinata = new pinataSDK(pinataKey, pinataSecret);

  getPinList(pinata).then(pins => {
    console.log(`Processing a total of ${pins.rows.length}`);
    unpinList(pinata, pins);
  });
} catch (error) {
  core.setFailed(error.message);
}
