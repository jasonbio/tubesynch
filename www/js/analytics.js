  var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-21656782-14']);
	_gaq.push(['_addIgnoredRef', 'www.tubesynch.com']); 
	_gaq.push(['_addIgnoredRef', 'tubesynch.com']); 
	_gaq.push(['_addIgnoredRef', 'socket.tubesynch.com']); 
	_gaq.push(['_addIgnoredRef', 'stage.tubesynch.com']); 
	_gaq.push(['_trackPageview']);
	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	function ga_heartbeat() {
  		_gaq.push(['_trackEvent', 'Heartbeat', 'Heartbeat', '', 0, true]);
  		setTimeout(ga_heartbeat, 5*60*1000);
	}
	ga_heartbeat();