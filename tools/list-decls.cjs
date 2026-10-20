const fs=require('fs'), parser=require('@babel/parser');
const src=fs.readFileSync(process.argv[2],'utf8'); const [lo,hi]=[+process.argv[3],+process.argv[4]];
const ast=parser.parse(src,{sourceType:'script'});
const body=ast.program.body[0].expression.callee.body.body;
const lines=src.split('\n');
for(const st of body){
  const L=st.loc.start.line; if(L<lo||L>hi) continue;
  const names=[];
  if(st.type==='FunctionDeclaration') names.push(st.id.name);
  else if(st.type==='VariableDeclaration') for(const d of st.declarations) names.push(d.id.name+'@'+d.loc.start.line);
  else if(st.type==='ClassDeclaration') names.push(st.id.name);
  else { continue; }
  if(st.type==='VariableDeclaration'){
    for(const d of st.declarations){ const l=d.loc.start.line; console.log(d.id.name+'\t'+l+'\t'+lines[l-1].trim().slice(0,70)+' | '+(lines[l]||'').trim().slice(0,60)); }
  } else console.log(names[0]+'\t'+L+'\t'+lines[L-1].trim().slice(0,70)+' | '+(lines[L]||'').trim().slice(0,70));
}
