"use strict";
(function() {
	this.Sexhr = function(options)
	{
		options || (options = {});

		return new Promise(function(resolve, reject) {
			var url = options.url;
			var method = (options.method || 'get').toUpperCase();
			var emulate = options.emulate || true;

			if(!options.url) throw new Error('no url given');

			url = url.replace(/#.*$/, '');
			if(emulate && ['GET', 'POST'].indexOf(method) < 0)
			{
				var append = '?_method='+method;
				if(url.match(/\?/))
				{
					url = url.replace(/\?/, append+'&');
				}
				else
				{
					url += append;
				}
				method = 'POST';
			}

			var xhr = new XMLHttpRequest();
			xhr.open(method, url, true);
			xhr.responseType = options.response_type || 'text';
			if(options.timeout) xhr.timeout = options.timeout;

			Object.keys(options.headers || {}).forEach(function(k) {
				xhr.setRequestHeader(k, options.headers[k]);
			});
			xhr.onload = function(e)
			{
				if(xhr.status >= 200 && xhr.status < 300)
				{
					var value = xhr.response;
					return resolve(value);
				}
				else if(xhr.status >= 400)
				{
					reject({xhr: xhr, code: xhr.status, msg: xhr.responseText});
				}
			};
			xhr.onabort = function(e)
			{
				reject({xhr: xhr, code: -2, msg: 'aborted'});
			};
			xhr.onerror = function(e)
			{
				reject({xhr: xhr, code: -1, msg: 'error'});
			};

			// set xhr.on[progress|abort|etc]
			Object.keys(options).forEach(function(k) {
				if(!k.substr(0, 2) == 'on') return false;
				if(['onload', 'onerror', 'onabort'].indexOf(k) >= 0) return false;
				var fn = options[k];
				xhr[k] = function(e) { fn(e, xhr); };
			});
			// set xhr.upload.on[progress|abort|etc]
			Object.keys(options.upload || {}).forEach(function(k) {
				if(!k.substr(0, 2) == 'on') return false;
				var fn = options[k];
				xhr.upload[k] = function(e) { fn(e, xhr); };
			});
			xhr.send(options.data);
		});
	};
}).apply((typeof exports != 'undefined') ? exports : this);

