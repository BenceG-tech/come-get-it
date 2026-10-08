import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
const source=readFileSync(new URL('./index.ts',import.meta.url),'utf8');
const code=stripTypeScriptTypes(source.replace(/^import .*;\n/gm,''),{mode:'transform'});
function harness(dbError=null){
 const sent=[],stored=[];
 const chain={select(){return this},eq(){return this},gte(){return this},then(resolve){return Promise.resolve({count:0}).then(resolve)}};
 const ctx=vm.createContext({Request,Response,Date,JSON,setTimeout,console:{log(){},warn(){},error(){}},Deno:{env:{get:()=>undefined}},
 createClient:()=>({from:table=>({select:()=>chain,insert:async value=>{stored.push({table,value});return {error:table==='lead_requests'?null:dbError}}})}),
 fetch:async (url,options)=>{sent.push(JSON.parse(options.body));return new Response(JSON.stringify({id:'test'}),{status:200})},
 serve:handler=>{ctx.handler=handler}});
 vm.runInContext(code,ctx);
 return {sent,stored,run:body=>ctx.handler(new Request('https://test.invalid',{method:'POST',headers:{origin:'https://come-get-it.app','content-type':'application/json'},body:JSON.stringify(body)}))};
}
for(const type of ['user_signup','venue_application']){
 test(`${type}: persists before sending and notifies hello@`,async()=>{
  const h=harness();const r=await h.run({type,data:{email:'applicant@example.com',name:'Test',venueName:'Test venue'}});
  assert.equal(r.status,200);assert.equal(h.stored[0].table,type==='user_signup'?'waitlist_signups':'venue_applications');
  assert.deepEqual(h.sent.map(x=>x.to),[['applicant@example.com'],['hello@come-get-it.app']]);
 });
 test(`${type}: database failure never reports success or sends email`,async()=>{
  const h=harness({code:'XX000'});const r=await h.run({type,data:{email:'applicant@example.com'}});
  assert.equal(r.status,500);assert.equal(h.sent.length,0);
 });
}
test('duplicate application is explicit and does not send duplicate mail',async()=>{
 const h=harness({code:'23505'});assert.equal((await h.run({type:'user_signup',data:{email:'applicant@example.com'}})).status,409);assert.equal(h.sent.length,0);
});
test('invalid types and payloads never persist or send',async()=>{
 for(const body of [{type:'bad',data:{email:'applicant@example.com'}},{type:'user_signup'},{type:'user_signup',data:{email:42}}]){
  const h=harness();assert.equal((await h.run(body)).status,400);assert.equal(h.sent.length,0);assert.equal(h.stored.length,0);
 }
});
