from re import T
import sys

value = sys.argv[1]
from pynput import mouse
from datetime import datetime,timedelta  
from pynput.mouse import Listener as lst 
import time
import json
import requests
import os
directory = os.getcwd()

import socket   
hostname=socket.gethostname()   
IPAddr=socket.gethostbyname(hostname)   
 

url1='http://ec2-3-89-125-78.compute-1.amazonaws.com:8000/timedetail'
url2= 'http://ec2-3-89-125-78.compute-1.amazonaws.com:8000/savebreak'



myuserid=value
print(myuserid)

def on_click(x, y, button, pressed):
    
    now = datetime.now()
    act_time = now.strftime("%H:%M:%S")
    date = now.strftime('%d-%m-%Y')
   
    ict_time1 = datetime.strptime(ict_time, "%H:%M:%S")
    act_time1 = datetime.strptime(act_time, "%H:%M:%S")

    mydate1=ict_time1-timedelta(seconds=mytime)
    mydate1=str(mydate1)
    thehour=mydate1.split(" ")
    myhour=thehour[1]
    myact_time1 = datetime.strptime(myhour, "%H:%M:%S")
    data=act_time1-myact_time1
    data1=data.total_seconds()
    data=str(data)
    if(data1>mytime):
       thejson={"userid":myuserid,"itime":ict_time,"atime":act_time,"timespent":data,"date":date,"date1":myhour}
       x = requests.post(url2, json = thejson)
    return False
def on_scroll(x, y, dx, dy):
    
    now = datetime.now()
    act_time = now.strftime("%H:%M:%S")
    date = now.strftime('%d-%m-%Y')
  
    ict_time1 = datetime.strptime(ict_time, "%H:%M:%S")
    act_time1 = datetime.strptime(act_time, "%H:%M:%S")

    mydate1=ict_time1-timedelta(seconds=mytime)
    mydate1=str(mydate1)
    thehour=mydate1.split(" ")
    myhour=thehour[1]
    myact_time1 = datetime.strptime(myhour, "%H:%M:%S")
    data=act_time1-myact_time1
    data1=data.total_seconds()
    data=str(data)
    if(data1>mytime):
       thejson={"userid":myuserid,"itime":ict_time,"atime":act_time,"timespent":data,"date":date,"date1":myhour}
       x = requests.post(url2, json = thejson)
    return False
    
    

def on_move(x, y):
    
    now = datetime.now()
    date = now.strftime('%d-%m-%Y')
    act_time = now.strftime("%H:%M:%S")
   
  
    ict_time1 = datetime.strptime(ict_time, "%H:%M:%S")
    act_time1 = datetime.strptime(act_time, "%H:%M:%S")
    mydate1=ict_time1-timedelta(seconds=mytime)
    mydate1=str(mydate1)
    thehour=mydate1.split(" ")
    myhour=thehour[1]
    myact_time1 = datetime.strptime(myhour, "%H:%M:%S")
    data=act_time1-myact_time1
    data1=data.total_seconds()
    data=str(data)
    if(data1>mytime):
       thejson={"userid":myuserid,"itime":ict_time,"atime":act_time,"timespent":data,"date":date,"date1":myhour}
       x = requests.post(url2, json = thejson)
       
    return False
    
      
k=1 
while(k!=0):
# The event listener will be running in this block
    with mouse.Events() as events:
        try:
            mydata1=requests.get(url1)
            jsondata=json.loads(mydata1.text)
            mytime=jsondata['data']['time']
            if mytime:
                event = events.get(mytime)
                if event is None:
                    now = datetime.now()
                    ict_time = now.strftime("%H:%M:%S")
                
                    listener1=lst(
                    on_move=on_move,
                    on_click=on_click,
                    on_scroll=on_scroll
                    )  
                    listener1.start()

                    listener1.join()
                else:
                    pass
            else:
                pass    
            time.sleep(20)
        except Exception:
            pass

# Collect events until released