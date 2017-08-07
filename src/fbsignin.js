
window.fbAsyncInit = function() {
	FB.init({
		appId: '1006551369445523',
		status: true,
		cookie: true,
		xfbml: true
	});
};

        // Load the SDK asynchronously
        (function(d){
        	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        	if (d.getElementById(id)) {return;}
        	js = d.createElement('script'); js.id = id; js.async = true;
        	js.src = "//connect.facebook.net/en_US/all.js";
        	ref.parentNode.insertBefore(js, ref);
        }(document));

        function login() {
        	FB.login(function(response) {

            // handle the response
            console.log("Response goes here!");

        }, {scope: 'read_stream,publish_stream,publish_actions,read_friendlists'});            
        }

        function logout() {
        	FB.logout(function(response) {
              // user is now logged out
          });
        }

        var status = FB.getLoginStatus();

        console.log(status);

        
