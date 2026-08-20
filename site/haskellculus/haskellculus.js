import { WASI } from "https://cdn.jsdelivr.net/npm/@bjorn3/browser_wasi_shim@0.3.0/+esm";

const wasi = new WASI([], [], []);
const wasm = await WebAssembly.compileStreaming(fetch("haskellculus.wasm"));
const inst = await WebAssembly.instantiate(wasm, {
	"wasi_snapshot_preview1": wasi.wasiImport,
});
wasi.initialize(inst);
inst.exports.hs_init();

document.getElementById("differentiateButton").addEventListener("click", differentiate);

function differentiate() {
	const exprStr = document.getElementById("expr").value;
	if (exprStr.trim() === "") {
		alert("Please enter a non-empty expression!");
		return;
	}
	const varStr = document.getElementById("var").value;
	if (varStr.trim() === "") {
		alert("Please enter a non-empty variable!");
		return;
	}
	const result = callWithStrings(inst.exports.hs_differentiateText, [exprStr, varStr]);
	document.getElementById("result").innerHTML = result;
	document.getElementById("latex").innerHTML = "\\(" + callWithStrings(inst.exports.hs_textExprToLatex, [result]) + "\\)";
	MathJax.typeset();
}

/*
 * The below function is based off of Tushar Adhatrao's Haskell to WASM tutorial
 * https://www.tushar-adhatrao.in/blogs/haskell_to_wasm.html
 *
 * The original tutorial function only supported calling functions with one string argument.
 * I have modified it to accept an array of arguments instead.
 */
function callWithStrings(func, args) {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder("utf8");

	const ptrList = [];
	for (let i = 0; i < args.length; ++i) {
		const encoded = encoder.encode(args[i] + '\0');
		ptrList[i] = inst.exports.callocBuffer(encoded.length);
		new Uint8Array(inst.exports.memory.buffer, ptrList[i], encoded.length).set(encoded);
	}

	const resultPtr = func.apply(null, ptrList);
	const resultBytes = new Uint8Array(inst.exports.memory.buffer, resultPtr);
	const length = resultBytes.findIndex(b => b === 0);
	const result = decoder.decode(new Uint8Array(inst.exports.memory.buffer, resultPtr, length));

	for (let i = 0; i < ptrList.length; ++i)
	{
		inst.exports.freeBuffer(ptrList[i]);
	}
	inst.exports.freeBuffer(resultPtr);

	return result;
}
