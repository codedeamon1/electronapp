const path = require('path');
const fs = require('fs');
const AWS = require("aws-sdk"); 
//joining path of directory 

var dirpath=path.join('D:',"uploads")
console.log(dirpath)
//passsing directoryPath and callback function
fs.readdir(dirpath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
         
         fs.readFile(dirpath+"\\"+file, async (err, data2) => {
         const storage = new AWS.S3({
         accessKeyId: 'AKIA3HZ4LC7ZL2LYZHP6',
         secretAccessKey: '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'
       })
       try { 
         const parames = {
             Bucket: 'infoapp/resumes',
             Key: `${file}`,
             Body: data2
           }
     
          await storage.upload(parames).promise(err=>{
           if(!err){
             console.log("s3upload")
           }
          })    
     }
     catch(err){
       if(err){
       console.log("too much load")
         console.log(err);
        
       }
     }
         })
    });
});