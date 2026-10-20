// One-time tool: rename the minified top-level identifiers of the original Creekfolk bundle
// to readable names, using Babel's scope-aware renamer (references and shadowing handled).
const fs=require('fs'), parser=require('@babel/parser');
const traverse=require('@babel/traverse').default, generate=require('@babel/generator').default;
const [,, inFile, mapFile, outFile]=process.argv;
const map=JSON.parse(fs.readFileSync(mapFile,'utf8'));
const src=fs.readFileSync(inFile,'utf8');
const ast=parser.parse(src,{sourceType:'script'});
let done=0, missing=[];
traverse(ast,{ Program(p){
  const fn=p.get('body.0.expression.callee');
  const scope=fn.scope;
  for(const [from,to] of Object.entries(map)){
    if(scope.hasOwnBinding(from)){ scope.rename(from,to); done++; } else missing.push(from);
  }
  p.stop();
}});
const out=generate(ast,{retainLines:true,comments:true},src).code;
fs.writeFileSync(outFile,out);
console.log('renamed',done,'missing',missing.join(' '));
