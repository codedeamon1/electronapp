var chokidar = require('chokidar');
const path = require('path')
const { spawn } = require('child_process');
const AWS = require("aws-sdk");


var fs = require('fs');
var axios = require('axios');

var userid=sessionStorage.getItem('id');
var userpath=sessionStorage.getItem('path');  
if(userid){
 
  var userpath1 = userpath.replace(/\\/g, "//");
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
   
      filesaver(data,filename,userid,time).then(mydat=>{
        if(mydat==1){
          console.log("File process complete")
          }
      })
      .catch(e=>{
        console.log(e)
      })
    
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
async function uploader(data2,path,userid,time){
      
       const storage = new AWS.S3({
         accessKeyId: 'AKIA3HZ4LC7ZL2LYZHP6',
         secretAccessKey: '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'
       })
       try { 
         const parames = {
             Bucket: 'infoapp/office/'+userid,
             Key: `${path}`,
             Body: data2
           }
     
          await storage.upload(parames).promise(err=>{
           if(!err){
             console.log("s3upload")
              
           }
          })
          
          return 1
          
     }
     catch(err){
       if(err){
         console.log(err);
         return 0
       }
     }
     
     }
         
       
       
   
      
     
     
async function filesaver(data2,filename,userid,time){
     
       thisdata=JSON.stringify({
         "file":filename,
         "userid":userid,
         "time":time
       })
       var config = {
         method: 'post',
         url: 'http://ec2-3-89-125-78.compute-1.amazonaws.com:8000/appuploads',
         headers: { 
           'Content-Type': 'application/json'
           },
         data : thisdata
        };
        
        axios(config)
        .then(function (response) {
        
          if(response.data.status === 1){
            uploader(data2,filename,userid,time)
          }
        else{
          console.log("skip")
        }})
        .catch(error=>{
          console.log(error)
        })
          
     }
     