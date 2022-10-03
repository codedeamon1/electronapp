if(userid){


   
    
    
    var userpath1 = userpath.replace(/\\/g, "//");


    console.log(userpath1)
var watcher = chokidar.watch(userpath1);
watcher.on('add', function(path) {
var ext=path.split('.').pop()
console.log(path)
if(ext=="pdf"||ext=="docx"||ext=="doc"){

   fs.readFile(path).then(async(data)=>{
    var filename = path.replace(/^.*[\\\/]/, '')
    var { birthtime } = fs.statSync(path)
    const time=moment(birthtime).format("HH:mm:ss")
    console.log(time)
     if(data){
     
       var mydat=await filesaver(data,filename,userid,time)
       if(mydat==1){
       
       }
       else{
        
       }
     }
   })
   .catch(e=>{
    console.log(e)
   })
  

}
})

getfiles={
  "userid":userid
}
var config = {
  method: 'post',
  url: 'http://ec2-3-89-125-78.compute-1.amazonaws.com:8000/getfiles',
  headers: { 
    'Content-Type': 'application/json'
    },
  data : getfiles
};
axios(config).then(function(response){
  if(response.data.status==1){
    console.log(response.data.data[3])
  }
}).catch(error=>console.log(error));
  }

