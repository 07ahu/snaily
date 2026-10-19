/* ---------- sending: postcards go to Supabase and come back by link ----------
   Each device signs in anonymously once, so every postcard has an owner (an account can be
   linked to it later). A sent card is a row in `postcards` plus its two images in the private
   `postcards` bucket; the link is ?p=<id>. Opening one asks get_postcard() who it's from and
   when it arrives, and only once it has arrived can the images be read (see supabase/schema.sql). */
const Net=(()=>{
 const on=typeof SNAILY!=="undefined"&&!!(SNAILY.url&&SNAILY.key&&window.supabase);
 let sb=null,user=null;
 const client=()=>sb||(sb=supabase.createClient(SNAILY.url,SNAILY.key));
 function me(){if(!user)user=(async()=>{const c=client(),{data:{session}}=await c.auth.getSession();if(session)return session.user;
   const{data,error}=await c.auth.signInAnonymously();if(error)throw error;return data.user})().catch(e=>{user=null;throw e});
  return user}
 const link=id=>location.origin+location.pathname+'?p='+id;
 /* front and back are JPEG blobs; returns {id,url} */
 async function send({front,back,sender,deliverAt}){await me();const c=client();
  const{data,error}=await c.from('postcards').insert({sender,deliver_at:deliverAt.toISOString()}).select('id').single();if(error)throw error;
  for(const[name,blob]of[['front.jpg',front],['back.jpg',back]]){const{error:e}=await c.storage.from('postcards').upload(`${data.id}/${name}`,blob,{contentType:'image/jpeg'});if(e)throw e}
  return{id:data.id,url:link(data.id)}}
 /* null if there's no such postcard; the image URLs only once it has arrived */
 async function open(id){const c=client(),{data,error}=await c.rpc('get_postcard',{pid:id});if(error)throw error;const r=data&&data[0];if(!r)return null;
  const out={sender:r.sender,deliverAt:new Date(r.deliver_at),arrived:r.arrived};
  if(r.arrived){const{data:s,error:e}=await c.storage.from('postcards').createSignedUrls([`${id}/front.jpg`,`${id}/back.jpg`],3600);if(e)throw e;out.front=s[0].signedUrl;out.back=s[1].signedUrl}
  return out}
 return{on,send,open,link}})();
