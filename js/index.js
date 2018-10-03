/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};
app.initialize();
window.addEventListener("load",function(){
	init();
})

var optobj = {
	tingin:0,
	kaishi:9,
	syuryo:17,
	kyukeistart:12,
	kyukei:60,
	zangyoup:25
};

var ALLEN = 0;
var DB = null;
function db_onCreate(e) {
    var db = this.result;
    if (db.objectStoreNames.contains("items")) {
        db.deleteObjectStore("items");
    }
    var store  = db.createObjectStore("items",{
        keyPath:"data"
    });
}
function deleteDBItem(str,cb){
    var trans = DB.transaction(["items"], "readwrite");
    var store = trans.objectStore("items");
    var req = store.delete(str+"");
    req.onsuccess = function () {
    	cb();
    };
    req.onerror = function(){
    	cb();
    };
}
function deleteObjectStore(cb){
    var trans = DB.transaction(["items"], "readwrite");
    var store = trans.objectStore("items");
    var request = store.clear();
    request.onsuccess = function (e) {
        if(cb)cb();
    }
}
function getItem(str,cb,day){
    var trans = DB.transaction(["items"], "readwrite");
    var store = trans.objectStore("items");
    var req = store.get(str+"");
    req.onsuccess = function() {
        var result = this.result; 
        if(cb){
        	if(!result || !result.datas){
	        	cb(null,str,day)
        	}else{
	        	cb(result.datas,str,day)
        	}
        }
    };
}

function init(){
    var request = indexedDB.open("work-database", "1");
    request.onupgradeneeded = db_onCreate;
    request.onsuccess = function (e) {
        DB = this.result;
        var lobj = localStorage.getItem("__setting__");
        if(!lobj){
		    showSetting();
        }else{
        	optobj = JSON.parse(lobj);
        }
        addEvent();
        addCalender();
        getDBItem();
    };
}
function addCalender(){
    var d = new Date(); 
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var str = year*10000+month*100+day;
    $('#calendar').fullCalendar({
        header: {
            left: 'prev',
            center: 'title',
            right: ''
        },
        lang: "ja",
		editable: false,
        defaultDate: year+"-"+addZero(month)+'-'+addZero(day),
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        eventLimit: false, // allow "more" link when too many events
        height:380,
		timeFormat: "H:mm",
		displayEventEnd: 'true',
		monthNames: ['１月','２月','３月','４月','５月','６月','７月','８月','９月','１０月','１１月','１２月'],
		monthNamesShort: ['１月','２月','３月','４月','５月','６月','７月','８月','９月','１０月','１１月','１２月'],
		dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
		dayNamesShort: ['日','月','火','水','木','金','土'],
		firstDay: 1,
		fixedWeekCount:false,
        dayClick: function (date, jsEvent, view) {
        	clickDay(date, jsEvent, view);
        },
        eventClick: function (event, jsEvent, view) {
        	clickEvent(event, jsEvent, view);
        },
        events: []
    });
}


function changeZikyuu(){
	if(100000 < this.value || this.value < 0){
		this.value = 0;
	}
}
function changeKaishi(){
	if(23 < this.value || this.value < 0){
		this.value = 9;
	}
}
function changeSyuryo(){
	if(23 < this.value || this.value < 0){
		this.value = 17;
	}
}
function changeKyukei(){
	if(23 < this.value || this.value < 0){
		this.value = 12;
	}
}
function changeKyukeiTime(){
	if(180 < this.value || this.value < 0){
		this.value = 60;
	}
}
function changeZangyo(){
	if(500 < this.value || this.value < 0){
		this.value = 25;
	}
}
function setSettings(){
    var zikyuval = document.getElementById("zikyu_inpt").value-0;
    var kaishi = document.getElementById("kaishi_inpt").value-0;
    var syuryo = document.getElementById("end_inpt").value-0;
    var keyukei = document.getElementById("kyukei_inpt").value-0;
    var kyukeitime = document.getElementById("kyukei_time_inpt").value-0;
    var zangyoup = document.getElementById("zangyo_inpt").value-0;

    optobj.tingin = zikyuval
    optobj.kaishi = kaishi
    optobj.syuryo = syuryo
    optobj.kyukeistart = keyukei
    optobj.kyukei = kyukeitime
    optobj.zangyoup = zangyoup

    localStorage.setItem("__setting__",JSON.stringify(optobj));
    var ocont = document.getElementById("settingdiv");
    hideWrap(ocont,500);
    setTimeout(function(){
    	location.reload();
    },800)
}
function addEvent(){
    document.getElementById("zikyu_inpt").addEventListener("change",changeZikyuu,false);
    document.getElementById("kaishi_inpt").addEventListener("change",changeKaishi,false);
    document.getElementById("end_inpt").addEventListener("change",changeSyuryo,false);
    document.getElementById("kyukei_inpt").addEventListener("change",changeKyukei,false);
    document.getElementById("kyukei_time_inpt").addEventListener("change",changeKyukeiTime,false);
    document.getElementById("zangyo_inpt").addEventListener("change",changeZangyo,false);
    document.getElementById("setting_ok_btn").addEventListener("click",setSettings,false);
    document.getElementById("setting_img").addEventListener("click",showSetting,false);
    document.getElementById("syukin_btn").addEventListener("click",clickSyukin,false);
    document.getElementById("taikin_btn").addEventListener("click",clickTaikin,false);
    document.getElementById("syusei_btn").addEventListener("click",function(){
        var ocont = document.getElementById("optdiv");
	    document.getElementById("loadingModal").style.display = "block";
	    syuseiData();
	    setTimeout(function(){
	        hideWrap(ocont,500);
	        document.getElementById("loadingModal").style.display = "none";
	    },1500)
    });  
    document.getElementById("syusei_sakuzyo_btn").addEventListener("click",deleteData,false);
    document.getElementById("cancel_opt_container").addEventListener("click",function(){
        var ocont = document.getElementById("optdiv");
        hideWrap(ocont,500);
    });  
	setTimeout(function(){
	    document.querySelector(".fc-prev-button").addEventListener("click",function(){
		    var time = $('#calendar').fullCalendar('getDate');
		    getDBItem(time)
		});
	},300)
    addSwipeEvent();
}




function addSwipeEvent(){
    var touchStartX;
    var touchStartY;
    var touchMoveX;
    var touchMoveY;
    var flg = false;
    window.addEventListener("touchstart", function(event) {
        touchStartX = event.touches[0].pageX;
        touchStartY = event.touches[0].pageY;
        flg = false;
    }, false);
    window.addEventListener("touchmove", function(event) {
        touchMoveX = event.changedTouches[0].pageX;
        touchMoveY = event.changedTouches[0].pageY;
        flg = true;
    }, false);
    window.addEventListener("touchend", function(event) {
        if(!flg)return;
        if (touchStartY+80 < touchMoveY) {
			reloadPage();
        } 
        if (touchStartX > touchMoveX) {
            if (touchStartX > (touchMoveX + 50)) {
                var ocont = document.getElementById("optdiv");
                hideWrap(ocont,-500)
            }
        } else if (touchStartX < touchMoveX) {
            if ((touchStartX + 50) < touchMoveX) {
                var ocont = document.getElementById("optdiv");
                hideWrap(ocont,500)
            }
        }
        flg = false;
    }, false);
}
function getDBItem(time){
	if(time){
	    var year = time.year();
	    var month = time.month()+1;
	    var day = getMonthDays(year,month)
	    ALLEN = 0;
	}else{
	    var d = new Date(); 
	    var year = d.getFullYear();
	    var month = d.getMonth()+1;
	    var day = d.getDate()-0;
	}
    for (var i = 1; i <= day; i++) {
	    var str = year*10000+month*100+i;
	    var func = function(res,str,day){
	    	if(!res)return;
		    var ctime = $('#calendar').fullCalendar('getDate');
		    var cmonth = ctime.month()+1;
		    if(cmonth !== month){
			    ALLEN = 0;
				document.getElementById("kingaku").textContent = "￥"+ALLEN;
		    	return;
		    }
			var obj = {
				datas:res
			};
			addCalendarEvent(str,"start",obj)
			addCalendarEvent(str,"end",obj)
	    };
    	getItem(str,func,day);
    }
}
function deleteData(){
    var df = document.getElementById("syusei_day").textContent;
    var sd = new Date(df); 
    var year = sd.getFullYear();
    var month = sd.getMonth()+1;
    var day = sd.getDate();
    var str = year*10000+month*100+day;
	var evt = $('#calendar').fullCalendar('getEventSourceById', str+"_start");
	if(evt){
		$('#calendar').fullCalendar('removeEvents', evt.id);
		$('#calendar').fullCalendar('removeEventSource', evt.id);
	}
	var cb = function(){
	    document.getElementById("loadingModal").style.display = "block";
	    setTimeout(function(){
	        hideWrap(document.getElementById("optdiv"),500);
	        document.getElementById("loadingModal").style.display = "none";
	        location.reload();
	    },1500)
	};
	deleteDBItem(str,cb);
}
function coundKyurou(stime,etime,day,str){
    var sh = stime.h-0;
    var sm = stime.m-0;
    var eh = etime.h-0;
    var em = etime.m-0;
    var kyukei = optobj.kyukei;
    var syuryo = optobj.syuryo;
    var wm = 0,wh = 0;
    var zm = 0,zh = 0;
    var en = 0,zen = 0;
    var tingin15m = parseInt(optobj.tingin/4);

    if(sh === eh){
    	if((em - sm) > 15){
    		wm = em - sm;
            wm = wm % 60;
            en += parseInt(wm / 15) * tingin15m;
    	}
    }else{
        em = parseInt(em / 15) * 15;
        if(sh === optobj.kaishi-1){
            sh = optobj.kaishi-1;
            sm = 59;
        }

        if(optobj.kaishi < optobj.syuryo){
            if(sh >= optobj.kyukeistart){
                kyukei = 0;
            }else if(eh <= optobj.kyukeistart){
                kyukei = 0;
            }
            if(eh < sh){
                eh+=24;
            }
        }else{
            if(eh < sh){
                eh+=24;
                syuryo+=24;
            }
        }

        if(eh < syuryo || (eh === syuryo && em === 0)){
            wm = (eh*60+em) - (sh*60+sm);
            if(wm > kyukei){
	            wm-= kyukei;
            }
            wh = parseInt(wm / 60);
            wm = wm % 60;
            en += wh * optobj.tingin;
            en += parseInt(wm / 15) * tingin15m;
        }else{
            wm = (syuryo*60) - (sh*60+sm) - kyukei;
            wh = parseInt(wm / 60);
            wm = wm % 60;

            en += wh * optobj.tingin;
            en += parseInt(wm / 15) * tingin15m;

            zm = (eh*60+em) - (syuryo*60);
            zh = parseInt(zm / 60);
            zm = zm % 60;

            var ztingin = optobj.tingin*(1+(optobj.zangyoup/100));
            var ztingin15m = parseInt(ztingin/4);
            zen += zh * ztingin;
            zen += parseInt(zm / 15) * ztingin15m;
        }
    }
    en = parseInt(en);
    zen = parseInt(zen);
	var dayen = en + zen;
	ALLEN += dayen;

	var time = stime;
    var year = time.y;
    var month = time.mo;
    var day = time.d;
    var event = {
    	id:str+"_en",
    	allDay:true,
        title:"￥"+dayen,
        textColor:"#000000",
        backgroundColor:"#ffffff",
        borderColor:"#ffffff",
        start:year+"-"+addZero(month)+"-"+addZero(day)
    };
    $('#calendar').fullCalendar('renderEvent', event, true);
	document.getElementById("kingaku").textContent = "￥"+ALLEN;
}
function timezoneOffset(){
    var date = new Date(),
        timezoneOffset = date.getTimezoneOffset(),
        hours = ('00' + Math.floor(Math.abs(timezoneOffset/60))).slice(-2),
        minutes = ('00' + Math.abs(timezoneOffset%60)).slice(-2),
        string = (timezoneOffset >= 0 ? '-' : '+') + hours + ':' + minutes;
    return string;
}
function syuseiData(){
    var df = document.getElementById("syusei_day").textContent;
    var sval = document.getElementById("syukin_syusei_btn").value;
    var tval = document.getElementById("taikin_syusei_btn").value;
    var sd = new Date(df+"T"+sval+timezoneOffset()); 
    var year = sd.getFullYear();
    var month = sd.getMonth()+1;
    var day = sd.getDate();
    var h = sd.getHours();
    var m = sd.getMinutes();
    var s = sd.getSeconds();
    var str = year*10000+month*100+day;
	var evt = $('#calendar').fullCalendar('getEventSourceById', str+"_start");
	if(evt){
		$('#calendar').fullCalendar('removeEvents', evt.id);
		$('#calendar').fullCalendar('removeEventSource', evt.id);
	}
    var time = {
        y:year,
        mo:month,
        d:day,
        h:h,
        m:m,
        s:s
    };
    sendDB(str,"start",time,false,true);
    var ed = new Date(df+"T"+tval+timezoneOffset()); 
    var eh = ed.getHours();
    var em = ed.getMinutes();
    var es = ed.getSeconds();
    if(eh < h){
    	eh+=24;
    }
    var time = {
        y:year,
        mo:month,
        d:day,
        h:eh,
        m:em,
        s:es
    };
    sendDB(str,"end",time,false,false,setTimeout(function(){location.reload()},500));
}
function hideWrap(elem,mv){
	if(elem.style.display == "block"){
        elem.style.left = mv+"px";
        setTimeout(function(){
            elem.style.display = "none";
        },300)
        return true;
	}
	return false;
}
function showSetting(){
    var lobj = localStorage.getItem("__setting__");
    if(lobj){
    	document.getElementById("zikyu_inpt").value = optobj.tingin;
    	document.getElementById("kaishi_inpt").value = optobj.kaishi;
    	document.getElementById("end_inpt").value = optobj.syuryo;
    	document.getElementById("kyukei_inpt").value = optobj.kyukeistart;
    	document.getElementById("kyukei_time_inpt").value = optobj.kyukei;
    	document.getElementById("zangyo_inpt").value = optobj.zangyoup;
    }
    document.getElementById("settingdiv").style.display = "block";
    setTimeout(function(){
        document.getElementById("settingdiv").style.left = 0;
    },10)
}
function clickEvent(event, jsEvent, view){
    var cd = new Date(event._start._i); 
    var year = cd.getFullYear();
    var month = cd.getMonth()+1;
    var day = cd.getDate()-0;
    var df = year+"-"+addZero(month)+"-"+addZero(day);
    document.getElementById("syusei_day").textContent = df;
    document.getElementById("optdiv").style.display = "block";
    setTimeout(function(){
        document.getElementById("optdiv").style.left = 0;
    },10)
    var year = cd.getFullYear();
    var month = cd.getMonth()+1;
    var day = cd.getDate()-0;
    var str = year*10000+month*100+day;
    var func = function(res,str,day){
    	setTimeValue(res);
    };
	getItem(str,func,day);
}
function clickDay(date, jsEvent, view){
	var df = date.format();
    if(df.indexOf("T") > -1){
        df = df.split("T")[0];
    }
    document.getElementById("syusei_day").textContent = df;
    document.getElementById("optdiv").style.display = "block";
    setTimeout(function(){
        document.getElementById("optdiv").style.left = 0;
    },10)
    var cd = new Date(df); 
    var year = cd.getFullYear();
    var month = cd.getMonth()+1;
    var day = cd.getDate()-0;
    var str = year*10000+month*100+day;
    var func = function(res,str,day){
    	setTimeValue(res);
    };
	getItem(str,func,day);
}
function setTimeValue(res){
	if(!res){
	    document.getElementById("syukin_syusei_btn").value = addZero(optobj.kaishi-1)+":"+addZero(59);
	    document.getElementById("taikin_syusei_btn").value = addZero(optobj.syuryo)+":"+addZero(1);
	}else{
		var sdata = res;
		for (var i = 0; i < sdata.length; i++) {
			var item = sdata[i];
			if(item.type === "start"){
				var time = item.time;
			    var h = time.h;
			    var m = time.m;
			    document.getElementById("syukin_syusei_btn").value = addZero(h)+":"+addZero(m);
			    break;
			}
		}
		for (var i = sdata.length - 1; i >= 0; i--) {
			var item = sdata[i];
			if(item.type === "end"){
				var time = item.time;
			    var h = time.h;
			    var m = time.m;
			    if(h > 23){
			    	h -= 24;
			    }
			    document.getElementById("taikin_syusei_btn").value = addZero(h)+":"+addZero(m);
			    break;
			}
		}
	}
}
function addZero(i) {
    if (i < 10)i = "0" + i;
    return i;
}
function clickSyukin(){
    sendStartDate("start");
}
function clickTaikin(){
    sendStartDate("end");
}
function sendStartDate(type){
    var d = new Date(); 
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var str = year*10000+month*100+day;
	var evt = $('#calendar').fullCalendar('getEventSourceById', str+"_start");
	if(!evt){
	    // if(optobj.kaishi < optobj.syuryo){
	    if(type === "end" && h < optobj.kaishi-1){
	    	day--;
	    	if(day < 1){
	    		month--;
	    		if(month < 1){
	    			month = 12;
	    			year--;
	    		}
				day = getMonthDays(year, month);
	    	}
	    	h += 24;
	    }
	    // }
	}
    var time = {
        y:year,
        mo:month,
        d:day,
        h:h,
        m:m,
        s:s
    };
    document.getElementById("time_info").textContent = time.h+"時"+time.m+"分"+time.s+"秒";
    document.getElementById("loadingModal").style.display = "block";
    setTimeout(function(){
        document.getElementById("loadingModal").style.display = "none";
    },2000)
    sendDB(str,type,time)
}
function sendDB(str,type,time,cancel,syusei,cb) {
    if(DB){
        var trans = DB.transaction(["items"], "readwrite");
        var store = trans.objectStore("items");
        var rq = store.get(str+"");
        rq.onsuccess = function() {
            var result = this.result;
            var datas = [];
            var data = {
                type:type,
                time:time
            };
            if(result){
                datas = result.datas;
            }
            if(syusei){
	            datas.unshift(data);
            }else{
	            datas.push(data);
            }
            var sdata = {
                data:str+"",
                datas:datas
            };
            var req = store.put(sdata);
            req.onsuccess = function () {
                if(!cancel){
                	addCalendarEvent(str,type,sdata)
                }else{
                	cancel();
                }
            };
        };
    }
}
function addCalendarEvent(str,type,obj){
	var sdata = obj.datas;
	if(type === "start"){
		var evt = $('#calendar').fullCalendar('getEventSourceById', str+"_"+type);
		if(evt)return;
		for (var i = 0; i < sdata.length; i++) {
			var item = sdata[i];
			if(item.type === "start"){
				var time = item.time;
			    var year = time.y;
			    var month = time.mo;
			    var day = time.d;
			    var h = time.h;
			    var m = time.m;
			    var event = {
			    	id:str+"_"+type,
			        title:"",
			        backgroundColor:"#FF1493",
			        start:year+"-"+addZero(month)+"-"+addZero(day)+"T"+addZero(h)+":"+addZero(m)+timezoneOffset()
			    };
			    $('#calendar').fullCalendar('addEventSource', event);
			    $('#calendar').fullCalendar('renderEvent', event, true);
			    break;
			}
		}
	}else if(type === "end"){
		for (var i = sdata.length - 1; i >= 0; i--) {
			var item = sdata[i];
			if(item.type === "end"){
				var callback = function(){
					var evt = $('#calendar').fullCalendar('getEventSourceById', str+"_start");
					$('#calendar').fullCalendar('removeEvents', evt.id);
					$('#calendar').fullCalendar('removeEventSource', evt.id);
					var time = item.time;
				    var year = time.y;
				    var month = time.mo;
				    var day = time.d;
				    var h = time.h;
				    var m = time.m;

				    if(23 < h){
				    	day++;
				    	h -= 24;
				    }
				    var maxday = getMonthDays(year,month)
				    if(day > maxday){
				    	month++;
				    	day = 1;
				    	if(month > 12){
				    		year++;
				    		month = 1;
				    		day = 1;
				    	}
				    }

				    var event = {
				    	id:str+"_start",
				        title:"",
				        backgroundColor:"#00BFFF",
				        start:evt.start,
				        end:year+"-"+addZero(month)+"-"+addZero(day)+"T"+addZero(h)+":"+addZero(m)+timezoneOffset(),
				    };
				    $('#calendar').fullCalendar('addEventSource', event);
				    $('#calendar').fullCalendar('renderEvent', event, true);
				    var sd = new Date(event.start); 
	    			var stime = {
					    y : sd.getFullYear(),
					    mo : sd.getMonth()+1,
					    d : sd.getDate(),
					    h : sd.getHours(),
					    m : sd.getMinutes(),
					    s : sd.getSeconds()
	    			};
				    var ed = new Date(event.end); 
	    			var etime = {
					    y : ed.getFullYear(),
					    mo : ed.getMonth()+1,
					    d : ed.getDate(),
					    h : ed.getHours(),
					    m : ed.getMinutes(),
					    s : ed.getSeconds()
	    			};
					coundKyurou(stime,etime,day,str);
				};

				var evt = $('#calendar').fullCalendar('getEventSourceById', str+"_start");
				if(!evt){
					var time = item.time;
				    var year = time.y;
				    var month = time.mo;
				    var day = time.d;
				    var h = optobj.kaishi-1;
				    if(h < 0){
				    	day--;
				    	if(day < 1){
				    		month--;
				    		if(month < 1){
				    			month = 12;
				    			year--;
				    		}	
				    		day = getMonthDays(year, month);
				    	}
				    	h+=24;
				    }
				    var m = 59;
				    var event = {
				    	id:str+"_start",
				        title:"",
				        backgroundColor:"#FF1493",
				        start:year+"-"+addZero(month)+"-"+addZero(day)+"T"+addZero(h)+":"+addZero(m)+timezoneOffset()
				    };
				    $('#calendar').fullCalendar('addEventSource', event);
				    $('#calendar').fullCalendar('renderEvent', event, true);
			        sendDB(
			        	str,"start",
				        {
					        y:year,
					        mo:month,
					        d:day,
					        h:h,
					        m:m,
					        s:0
					    },
					    callback
					);
			    }else{
			    	callback();
			    }
				break;
			}
		}
	}
}
function getMonthDays(year, month) {  
  return new Date(year, month, 0).getDate();
};
