/* Exact scalar GMM posterior and CDF-rank transport, shared with the image worker. */
const FlowMath=(()=>{
 const mu=[-3,-1,1,3],pi=[.25,.25,.25,.25],sigma=.45;
 const table=new Float64Array(CDF_BYTES.buffer);
 function cdf(x){if(x>=8)return 1;if(x<=-8)return 0;const a=(x+8)*2048,i=Math.floor(a);return table[i]+(a-i)*(table[i+1]-table[i])}
 const normal=(x,m,s)=>Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
 function rank(z,t){const sd=Math.sqrt(t*t*sigma*sigma+(1-t)**2);return mu.reduce((a,m,j)=>a+pi[j]*cdf((z-t*m)/sd),0)}
 function inverse(q,t){q=Math.max(1e-10,Math.min(1-1e-10,q));const sd=Math.sqrt(t*t*sigma*sigma+(1-t)**2);let lo=-10,hi=10,z=0;for(let k=0;k<45;k++){let value=0,d=0;for(let j=0;j<4;j++){value+=pi[j]*cdf((z-t*mu[j])/sd);d+=pi[j]*normal(z,t*mu[j],sd)}const err=value-q;if(Math.abs(err)<1e-11)return z;if(err>0)hi=z;else lo=z;const next=z-err/Math.max(d,1e-300);z=next>lo&&next<hi?next:(lo+hi)/2}return z}
 function posterior(z,t){const n=1-t,V=t*t*sigma*sigma+n*n,log=mu.map((m,j)=>Math.log(pi[j])-(z-t*m)**2/(2*V)),max=Math.max(...log),a=log.map(v=>Math.exp(v-max)),sum=a.reduce((a,b)=>a+b,0),w=a.map(v=>v/sum),cm=mu.map(m=>m+t*sigma*sigma/V*(z-t*m)),ce=mu.map(m=>n/V*(z-t*m)),m=w.reduce((s,v,i)=>s+v*cm[i],0),e=w.reduce((s,v,i)=>s+v*ce[i],0);return {m,e,v:m-e,w,cm,ce,V,sd:n*sigma/Math.sqrt(V)}}
 function photoWeights(z,t,photos,q){const N=photos.length;if(t===0)return Array(N).fill(1/N);if(t>=1)return Array.from({length:N},(_,i)=>i===Math.min(N-1,Math.floor(q*N))?1:0);const p=posterior(z,t),out=new Array(N);let previous=0;for(let i=0;i<N-1;i++){const edge=photos[i].right;let cumulative=0;for(let j=0;j<4;j++)cumulative+=p.w[j]*cdf((edge-p.cm[j])/p.sd);out[i]=Math.max(0,cumulative-previous);previous=cumulative}out[N-1]=Math.max(0,1-previous);const sum=out.reduce((a,b)=>a+b,0);return out.map(v=>v/sum)}
 const path=q=>Array.from({length:301},(_,i)=>{const t=i/300;return [t,inverse(q,t)]});
 return {mu,pi,sigma,cdf,normal,rank,inverse,posterior,photoWeights,path};
})();
if(typeof module!=='undefined')module.exports=FlowMath;
