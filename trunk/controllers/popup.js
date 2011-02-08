/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * 1- check for login status, if logged in, check in session for online friends. if not logged in, shows log in icon with url to webserver application that sends to authinticate and login to facebook, in background page a running script asks for authintication.
 * 2- shows a list of online friends and shows the last chats.
 */
var background=chrome.extension.getBackgroundPage();
var proxy=background.Proxy;
var POPUPConnectHandler=function(ob){
    //populate list of all friends and save it in the localStorage
    $("#friend-list").html(ob.friendlist);

    //____ running the intervals
    fbchatpopup.runIntervals();

    $("#online-friends").html(ob.onlineFriends);
    $('#notconnected').fadeOut();
    $("#container").fadeIn('fast');
}
var fbchatPOPUP = function(){
    var fbchatpopup = {
        friendsInterval:null,
        /**
         * create html for list of friends.
         */
        populateFriendsList:function(list,online){
            var out=background.fbchatpopup.populateFriendsList(list, online);
            return out;
        },
        /**
         * fired when clicking on connect.
         */
        connect:function(){
            window.localStorage.connected = 'connecting';
            //___loading dots #loadindots
            $("#notconnected").hide();
            $("#loadingdiv").show();
            $("#loadindots").Loadingdotdotdot({
                "speed": 400,
                "maxDots": 4
            });
            chrome.extension.sendRequest({
                'action':'connect'
            },function(ob){
                //stoping the loader.
                $("#loadindots").Loadingdotdotdot("stop");
                $("#loadingdiv").hide();

                //populate list of all friends and save it in the localStorage
                $("#friend-list").html(ob.friendlist);

                //____ running the intervals
                fbchatpopup.runIntervals();

                $("#online-friends").html(ob.onlineFriends);
                $('#notconnected').fadeOut();
                $("#container").fadeIn('fast');
            });
        },
        /**
         * update online friends popup
         */
        updatetOnlineFriends:function(){
            console.log('updating frinds:'+(new Date()).getMinutes())
            var staticlist=null;
            background.fbchatdb.getOnlineFriends(function(list){
                staticlist=fbchatpopup.populateFriendsList(list,true);
                window.localStorage.onlineFriends=staticlist;
                fbchatpopup.setOnlineFriendsList(staticlist);
            });
        },
        /**
         * setting the online friends from the localStorage or from paramters
         */
        setOnlineFriendsList:function(staticlist){
            if(staticlist != null && staticlist != ""){
                $("#online-friends").html(staticlist);
            }else{
                $("#online-friends").html(window.localStorage.onlineFriends);
            }
            
        },
        /**
         * disconnecting from chat.
         */
        disconnect:function(){
            console.log('disconnecting');
            $('#container').hide();
            $("#notconnected").fadeIn('fast');
            //disconnecting from server
            chrome.extension.sendRequest({
                'action':'disconnect'
            });
            window.localStorage.connected=false;
            //setting icon to offline
            chrome.browserAction.setIcon({
                path:'icons/32x32_off.png'
            });
        },
        /**
         * log out
         */
        logout:function(){
            console.log('logging out');
            for(i in window.localStorage){
                delete window.localStorage[i]
            }
            window.localStorage.logged=false;
            window.localStorage.connected=false;
            chrome.browserAction.setIcon({
                path:'icons/32x32_off.png'
            });
            window.close();
        },
        /**
         * setting the onclick actions
         */
        setClickEventActions:function(){
            $("#connect").click(function(){
                fbchatpopup.connect();
            });
            //disconnect and logout actions
            $('#disconnect').click(function(){
                console.log('disconnecting');
                fbchatpopup.disconnect();
            });
            $('#logout').click(function(){
                console.log('logging out');
                fbchatpopup.logout();
            });
        },
        updateConversations:function(list){
        },
        updateConversation:function(msg){
        },
        /**
         * running the intervals while popup is on.
         */
        runIntervals:function(){
            fbchatpopup.friendsInterval=window.setInterval("fbchatpopup.updatetOnlineFriends();", 1000 * 60 * 2);
        }
    };
    $(function(){
        //______check if user is logged to application on facebook or not. if not user will  be redirected to facebook to authenticate application.
        if(! JSON.parse(window.localStorage.logged)){
            background.extension.openURL(proxy.baseURL+proxy.loginURL, true);
            chrome.extension.sendRequest({
                'action':'getAuth'
            });
            window.close();
        }

        //_____check if user is connected or not, if not shows you are not connected.
        if(window.localStorage.connected == 'false'){
            $('#container').hide();
            $("#notconnected").fadeIn('fast');
        }else if(window.localStorage.connected == 'connecting'){
            //___loading dots #loadindots
            $('#container').hide();
            $("#loadingdiv").fadeIn();
            $("#loadindots").Loadingdotdotdot({
                "speed": 400,
                "maxDots": 4
            });
        }else{
            fbchatpopup.runIntervals();
            //___ setting the online friends list
            fbchatpopup.setOnlineFriendsList();
            //___update friends list from sessionStroge
            $("#friend-list").html(window.localStorage.friendList);
            //___update chat windows.
            $("#conversation-container").html("");
            //___update open chat box name
            $("#chat-buddy-name").html("");
            $("#chat-buddy-img").hide();

        }
        
        fbchatpopup.setClickEventActions();

    });
    return fbchatpopup;
}

var fbchatpopup=new fbchatPOPUP();