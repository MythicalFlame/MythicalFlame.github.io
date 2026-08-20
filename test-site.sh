#!/bin/bash
set -e

MAIN_PATH=$(dirname "$(realpath "$0")")

echo "Building haskellculus-wasm..."
cd "$MAIN_PATH/haskellculus-wasm"
cabal clean
wasm32-wasi-cabal build

echo "Copying WASM to site..."
WASM_PATH=$(wasm32-wasi-cabal list-bin haskellculus-wasm)
rm "$MAIN_PATH/site/haskellculus/haskellculus.wasm"
cp "$WASM_PATH" "$MAIN_PATH/site/haskellculus/haskellculus.wasm"

echo "Starting web server..."
cd "$MAIN_PATH/site"
python3 -m http.server
