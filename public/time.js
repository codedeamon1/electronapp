
 const fs = require ('fs')
 var moment =require('moment')
var { birthtime } = fs.statSync("C:\\Users\\mii57\\OneDrive\\Pictures\\Saved Pictures")
const today=moment(birthtime).format("DD-MM-YYYY HH:mm:ss")
console.log(today)