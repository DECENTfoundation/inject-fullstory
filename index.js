var through = require('through2'),
	gutil = require('gulp-util');

module.exports = function(opts) {

	opts = opts || {};
	opts.id = opts.id || '';
	opts.namespace = opts.namespace || 'FullStory namespace conflict. Please set window["_fs_namespace"].';
	opts.tag = opts.tag || 'head';


	return through.obj(function(file, enc, cb) {

		if(file.isNull()) return cb(null, file);
		if(file.isStream()) return cb(new Error("Custom plugin: streams not supported."));


		////////////////////////////////////////////////////////////////////////////////////////////////////

		var fullstoryScript = "<script>\n"+

				"window['_fs_debug'] = false;\n"+

				"window['_fs_host'] = 'fullstory.com';\n"+

				"window['_fs_org'] = '"+opts.id+"';\n"+

				"window['_fs_namespace'] = 'FS';\n"+

				"(function(m,n,e,t,l,o,g,y) {\n"+

				"if (e in m) {if(m.console && m.console.log) {m.console.log('"+opts.namespace+"');} else {return;}}\n"+

				"g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];\n"+

				"o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';\n"+

				"y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);\n"+

				"g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};g.event=function(i,v){g('event',{n:i,p:v})};\n"+

				'g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};\n'+

				'g.consent=function(a){g("consent",!arguments.length||a)};\n'+

				"g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};\n"+

				"g.clearUserCookie=function(){};\n"+

				"})(window,document,window['_fs_namespace'],'script','user');";

				//"</script>"

			fullstoryScript += "</script>\n  </"+opts.tag+">\n";

		////////////////////////////////////////////////////////////////////////////////////////////////////


		var content = file.contents.toString()
		content = content.replace('<\/' + opts.tag + '>', fullstoryScript);
		file.contents = new Buffer(content)
		cb(null, file)
	})

}
