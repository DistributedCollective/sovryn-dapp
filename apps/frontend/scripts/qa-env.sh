#!/usr/bin/env bash
# Reads a QA fork state file and prints `export` lines that point the dapp's
# RSK RPC at that fork instead of mainnet. Meant to be `eval`'d by the caller,
# e.g.: eval "$(scripts/qa-env.sh /path/to/perimeter-qa.json)"
#
# Usage: qa-env.sh <path-to-perimeter-qa.json>
set -euo pipefail

STATE_FILE="${1:?usage: qa-env.sh <path-to-perimeter-qa.json>}"

node -e '
  const fs = require("fs");
  const state = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  if (!state.rpc) {
    throw new Error(process.argv[1] + " is missing \"rpc\"");
  }
  console.log("export REACT_APP_RSK_RPC_OVERRIDE=" + state.rpc);
  console.log("export REACT_APP_NETWORK=mainnet");
' "$STATE_FILE"
