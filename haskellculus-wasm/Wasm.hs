module Wasm where

import Foreign.C.String (CString, peekCString, newCString)
import Foreign.Marshal.Alloc (callocBytes, free)
import Foreign.Ptr (Ptr)

import Haskellculus.MExp
import Haskellculus.Differentiate
import Haskellculus.Simplify
import Haskellculus.Latexify

foreign export ccall "hs_differentiateText" differentiateText :: CString -> CString -> IO CString

differentiateText :: CString -> CString -> IO CString
differentiateText exprC varC = do
  exprStr <- peekCString exprC
  varStr <- peekCString varC
  case reads exprStr :: [(MExp, String)] of
    [(expr, "")] ->
      newCString (show (simplify (differentiate (simplify expr) varStr)))
    _ ->
      newCString "Could not parse expression"

foreign export ccall "hs_textExprToLatex" textExprToLatex :: CString -> IO CString

textExprToLatex :: CString -> IO CString
textExprToLatex exprC = do
  exprStr <- peekCString exprC
  case reads exprStr :: [(MExp, String)] of
    [(expr, "")] ->
      newCString (latexify expr)
    _ ->
      newCString "\\text{Could not parse expression}"


-- The below code is based on
-- https://www.tushar-adhatrao.in/blogs/haskell_to_wasm.html
foreign export ccall "callocBuffer" callocBuffer :: Int -> IO (Ptr a)
foreign export ccall "freeBuffer" freeBuffer :: Ptr a -> IO ()

callocBuffer :: Int -> IO (Ptr a)
callocBuffer = callocBytes

freeBuffer :: Ptr a -> IO ()
freeBuffer = free
