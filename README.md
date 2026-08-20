# MythicalFlame's Site

Hi there! This is my personal site. There's not much here for now. Currently, this site hosts the WASM compiled version of [Haskellculus](https://github.com/MythicalFlame/Haskellculus), where you can enter a mathematical expression, have it differentiated symbolically, and then displayed in LaTeX using MathJax.

## Hosting the site

You can clone the repo then do `./test-site.sh` to run the website locally if you have regular Cabal, [ghc-wasm-meta](https://gitlab.haskell.org/haskell-wasm/ghc-wasm-meta), and Python 3.

If you want to just compile Haskellculus into WASM, you can `cd` into `haskellculus-wasm` and run `wasm32-wasi-cabal build`, assuming you have ghc-wasm-meta.
