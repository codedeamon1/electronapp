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

  fs.readFile(path,(err,data)=>{
    var filename = path.replace(/^.*[\\\/]/, '')
    var { birthtime } = fs.statSync(path)
    const time=moment(birthtime).format("HH:mm:ss")
    console.log(time)
    if(data){
   console.log(data)
      var mydat=filesaver(data,filename,userid,time)
        if(mydat==1){
          console.log("File process complete")
          }
     
     
    
   }
 })



}
})


}

         
       
       
   
      
     
     
async function filesaver(data2,filename,userid,time){
     console.log("infunction")
       thisdata=JSON.stringify({
         "file":filename,
         "userid":userid,
         "time":time
       })
       var config = {
         method: 'post',
         url: 'http://ec2-54-197-18-205.compute-1.amazonaws.com:8000/filecheck',
         headers: { 
           'Content-Type': 'application/json'
           },
         data : thisdata
        };
        
        axios(config)
        .then(function (response) {
        
          if(response.data.status === 0){
           console.log("new file")
          }
        else{
          console.log("already exist")
        }})
        .catch(error=>{
          console.log(error)
        })
          
     }
     