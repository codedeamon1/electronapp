const path = require('path');
const { app, BrowserWindow, powerMonitor, Menu,  Tray, nativeImage, ipcMain } = require('electron');
  
const storage = require('electron-storage');
const AutoLaunch = require('auto-launch');
let {PythonShell} = require('python-shell')

const exeName = path.basename(app.getPath('exe'));


  let autoLaunch = new AutoLaunch({
    name: 'Infoapto',
    path: app.getPath('exe'),
  });


  let win, tray;
  
   

  const createWindow = () => {
  const browserWindows = {};
  const { loadingWindow, mainWindow } = browserWindows;
   
    
    win = new BrowserWindow({
      width: 1000,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
      icon: path.join(__dirname, 'public/infoaptoicon.png'),
  
      
    });

  win.once("ready-to-show", () => win.show());

  win.on("closed", () => (win = null));

  tray = new Tray(nativeImage.createEmpty());

  
  if(!app.isPackaged) {
  tray = new Tray('infoaptoicon.png');
  } else {
  tray = new Tray(path.join(__dirname, 'public/infoaptoicon.png'));
 
  }
  

  tray.setToolTip("Infoapto App");

  const contextMenu = Menu.buildFromTemplate([

    {

    label: "Show",

    type: "normal",

    click() {

      win.show();

    }

    } 


    
  ]);

  tray.on("click", () => (win.isVisible() ? win.hide() : win.show()));

  tray.setContextMenu(contextMenu);

  win.on("close", e => {

    if (win.isVisible()) {

    win.hide();

    e.preventDefault();

    }

  });


  


  win.loadFile(path.join(__dirname, './public/index.html'));
/**
   * @description - Function to use custom JavaSCript in the DOM.
   * @param {string} command - JavaScript to execute in DOM.
   * @param {function} callback - Callback to execute here once complete.
   * @returns {Promise}
   */
 const executeOnWindow = (command, callback) => {
  return mainWindow.webContents.executeJavaScript(command)
    .then(callback)
    .catch(console.error);
};
  



  };

    

  app.on("ready", ()=>{
    
    autoLaunch.enable();
    if (win == null) createWindow();
  
  }
   
);

 

  app.on("activate", () => {

  if (win == null) createWindow();

  });

 

  app.on("window-all-closed", () => {
   
  if (process.playform !== "darwin") app.quit();

  });

 

  ipcMain.on("asynchronous-message", (event, arg) => {

  if (arg === "tray") win.hide();

  if (arg === "quit") app.quit();

  });

function showMainWindow() {
 
  

   
 win.loadFile('./public/main.html') // For testing purposes only
  .then(() => { win.show(); })
  console.log("out");
  
  storage.get("checkfile", (err, data) => {
    let options = {
      args: data.userid
  };
    if (err) {
      console.error(err)
    } else {
      mydir=path.join(__dirname, 'public/app.py')
      console.log(mydir)
        PythonShell.run(mydir, options, function (err) {
          console.log(data)
        
        if (err) throw err;
        console.log('finished');
      });
    }
  });

}

function showLoginWindow() {
  
  win.loadFile('./public/index.html')
.then(() => { win.show(); })
}
 

ipcMain.on('message:loginShow', (event) => {
  showLoginWindow();
})

ipcMain.on('message:loginhide', (event, session) => {
  showMainWindow();
})




ipcMain.on('openFile', (event, id) => { 
 

  const {dialog} = require('electron') 
  const fs = require('fs') 
  dialog.showOpenDialog(
    {
      title:'Open Dialogue',
      message:'First Dialog',
      //pass 'openDirectory' to strictly open directories
      properties: ['openDirectory']
    }
).then(result=>{
  

  const str = result.filePaths[0];
  if(str === undefined){ 

  } else {
    
    var axios = require('axios');
    var data = JSON.stringify({
       "userid" : id,
       "path": str
    });
   
    var config = {
      method: 'post',
      url: 'http://ec2-3-89-125-78.compute-1.amazonaws.com:8000/savepaths',
      headers: { 
        'Content-Type': 'application/json'
        },
      data : data
    };
    
    axios(config)
    .then(function (response) {
       if(response.data.status === 1){
         

        event.sender.send('getData', str) 
         
       }    
    })
    .catch(function (error) {
      console.log(error);
    });
    

  }

})

  
  
 
})  

 