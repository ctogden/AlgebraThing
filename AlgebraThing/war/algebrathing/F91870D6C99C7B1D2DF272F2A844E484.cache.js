algebrathing.onScriptDownloaded(["var $wnd = $wnd || window.parent;var __gwtModuleFunction = $wnd.algebrathing;var $sendStats = __gwtModuleFunction.__sendStats;$sendStats('moduleStartup', 'moduleEvalStart');var $gwt_version = \"2.6.0\";var $strongName = 'F91870D6C99C7B1D2DF272F2A844E484';var $doc = $wnd.document;function __gwtStartLoadingFragment(frag) {var fragFile = 'deferredjs/' + $strongName + '/' + frag + '.cache.js';return __gwtModuleFunction.__startLoadingFragment(fragFile);}function __gwtInstallCode(code) {return __gwtModuleFunction.__installRunAsyncCode(code);}var $stats = $wnd.__gwtStatsEvent ? function(a) {return $wnd.__gwtStatsEvent(a);} : null;var $sessionId = $wnd.__gwtStatsSessionId ? $wnd.__gwtStatsSessionId : null;function i(){}\nfunction S(){}\nfunction fc(){}\nfunction bb(){}\nfunction Rb(){}\nfunction C(a){}\nfunction ac(a){}\nfunction o(){Y()}\nfunction I(){return F}\nfunction Mb(){return !!$stats}\nfunction Lb(a){return new Jb[a]}\nfunction dc(b,a){return b.indexOf(a)}\nfunction K(a,b){return ab(a,b,null)}\nfunction kb(a,b){return a.cM&&!!a.cM[b]}\nfunction nb(a,b){return a!=null&&kb(a,b)}\nfunction B(a,b,c){return a.apply(b,c);var d}\nfunction Vb(a){return typeof a=='number'&&a>0}\nfunction L(a){$wnd.clearTimeout(a)}\nfunction Yb(){o.call(this)}\nfunction $b(){o.call(this)}\nfunction q(){q=fc;p=new i}\nfunction P(){P=fc;O=new S}\nfunction Ub(a){var b=Jb[a.b];a=null;return b}\nfunction T(a,b){!a&&(a=[]);a[a.length]=b;return a}\nfunction W(a,b){a.length>=b&&a.splice(0,b);return a}\nfunction Z(){try{null.a()}catch(a){return a}}\nfunction r(a){q();o.call(this);this.b=a;X(this)}\nfunction hb(){hb=fc;fb=[];gb=[];ib(new bb,fb,gb)}\nfunction J(a){$wnd.setTimeout(function(){throw a},0)}\nfunction M(){return K(function(){v!=0&&(v=0);A=-1},10)}\nfunction H(a){a&&R((P(),O));--v;if(a){if(A!=-1){L(A);A=-1}}}\nfunction Tb(a,b,c){var d;d=new Rb;Vb(c)&&Wb(c,d);return d}\nfunction Sb(a,b,c){var d;d=new Rb;Vb(c!=0?-c:0)&&Wb(c!=0?-c:0,d);return d}\nfunction db(a,b,c,d,e){var f;f=cb(e,d);eb(a,b,c,f);return f}\nfunction eb(a,b,c,d){hb();jb(d,fb,gb);d.cZ=a;d.cM=b;return d}\nfunction jb(a,b,c){hb();for(var d=0,e=b.length;d<e;++d){a[b[d]]=c[d]}}\nfunction ib(a,b,c){var d=0,e;for(var f in a){if(e=a[f]){b[d]=f;c[d]=e;++d}}}\nfunction G(a,b,c){var d;d=D();try{return B(a,b,c)}finally{H(d)}}\nfunction cc(a,b){if(b==null){return false}return String(a)==b}\nfunction Hb(a){if(nb(a,3)){return a}return a==null?new r(null):Fb(a)}\nfunction lb(a,b){if(a!=null&&!(a.cM&&a.cM[b])){throw new Yb}return a}\nfunction mb(a){if(a!=null&&(a.tM==fc||kb(a,1))){throw new Yb}return a}\nfunction ab(a,b,c){var d=$wnd.setTimeout(function(){a();c!=null&&C(c)},b);return d}\nfunction Q(a){var b,c;if(a.b){c=null;do{b=a.b;a.b=null;c=U(b,c)}while(a.b);a.b=c}}\nfunction R(a){var b,c;if(a.c){c=null;do{b=a.c;a.c=null;c=U(b,c)}while(a.c);a.c=c}}\nfunction F(b){return function(){try{return G(b,this,arguments)}catch(a){throw a}}}\nfunction Fb(b){var c=b.__gwt$exception;if(!c){c=new r(b);try{b.__gwt$exception=c}catch(a){}}return c}\nfunction Gb(a){var b;if(nb(a,2)){b=lb(a,2);if(b.b!==(q(),p)){return b.b===p?null:b.b}}return a}\nfunction n(a){var b,c,d;c=db(Cb,gc,0,a.length,0);for(d=0,b=a.length;d<b;++d){if(!a[d]){throw new $b}c[d]=a[d]}}\nfunction Y(){var a,b,c,d;c=W($(Z()),2);d=db(Cb,gc,0,c.length,0);for(a=0,b=d.length;a<b;a++){d[a]=new ac(c[a])}n(d)}\nfunction X(a){var b,c,d,e;d=$(a.b===(q(),p)?null:a.b);e=db(Cb,gc,0,d.length,0);for(b=0,c=e.length;b<c;b++){e[b]=new ac(d[b])}n(e)}\nfunction $(a){var b,c,d,e;d=a!=null&&a.tM!=fc&&!kb(a,1)?mb(a):null;e=d&&d.stack?d.stack.split('\\n'):[];for(b=0,c=e.length;b<c;b++){e[b]=V(e[b])}return e}\nfunction gwtOnLoad(b,c,d,e){$moduleName=c;$moduleBase=d;if(b)try{ic(Eb)()}catch(a){b(c)}else{ic(Eb)()}}\nfunction D(){var a;if(v!=0){a=(new Date).getTime();if(a-w>2000){w=a;A=M()}}if(v++==0){Q((P(),O));return true}return false}\nfunction ec(c){if(c.length==0||c[0]>nc&&c[c.length-1]>nc){return c}var a=c.replace(/^(\\s*)/,jc);var b=a.replace(/\\s*$/,jc);return b}\nfunction cb(a,b){var c=new Array(b);if(a==3){for(var d=0;d<b;++d){c[d]={l:0,m:0,h:0}}}else if(a>0&&a<3){var e=a==1?0:false;for(var d=0;d<b;++d){c[d]=e}}return c}\nfunction Wb(a,b){var c;b.b=a;if(a==2){c=String.prototype}else{if(a>0){var d=Ub(b);if(d){c=d.prototype}else{d=Jb[a]=function(){};d.cZ=b;return}}else{return}}c.cZ=b}\nfunction Nb(a){return $stats({moduleName:$moduleName,sessionId:$sessionId,subSystem:'startup',evtGroup:'moduleStartup',millis:(new Date).getTime(),type:'onModuleLoadStart',className:a})}\nfunction U(b,c){var d,e,f,g;for(e=0,f=b.length;e<f;e++){g=b[e];try{g[1]?g[0].e()&&(c=T(c,g)):g[0].e()}catch(a){a=Hb(a);if(nb(a,3)){d=a;J(nb(d,2)?lb(d,2).d():d)}else throw Gb(a)}}return c}\nfunction Kb(a,b,c){var d=Jb[a];if(d&&!d.cZ){_=d.prototype}else{!d&&(d=Jb[a]=function(){});_=d.prototype=b<0?{}:Lb(b);_.cM=c}for(var e=3;e<arguments.length;++e){arguments[e].prototype=_}if(d.cZ){_.cZ=d.cZ;d.cZ=null}}\nfunction V(a){var b,c,d;d=jc;a=ec(a);b=a.indexOf('(');c=a.indexOf('function')==0?8:0;if(b==-1){b=dc(a,String.fromCharCode(64));c=a.indexOf('function ')==0?9:0}b!=-1&&(d=ec(a.substr(c,b-c)));return d.length>0?d:'anonymous'}\nfunction Eb(){var a;Mb()&&Nb('com.google.gwt.useragent.client.UserAgentAsserter');a=Pb();cc(kc,a)||($wnd.alert('ERROR: Possible problem with your *.gwt.xml module file.\\nThe compile time user.agent value (gecko1_8) does not match the runtime user.agent value ('+a+'). Expect more errors.\\n'),undefined);Mb()&&Nb('com.google.gwt.user.client.DocumentModeAsserter');Ob();Mb()&&Nb('com.jazzberryjam.algebra_thing.client.AlgebraThing')}\nfunction Pb(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf('webkit')!=-1}())return 'safari';if(function(){return b.indexOf(mc)!=-1&&$doc.documentMode>=10}())return 'ie10';if(function(){return b.indexOf(mc)!=-1&&$doc.documentMode>=9}())return 'ie9';if(function(){return b.indexOf(mc)!=-1&&$doc.documentMode>=8}())return 'ie8';if(function(){return b.indexOf('gecko')!=-1}())return kc;return 'unknown'}\nfunction Ob(){var a,b,c;b=$doc.compatMode;a=eb(Db,gc,1,[lc]);for(c=0;c<a.length;c++){if(cc(a[c],b)){return}}a.length==1&&cc(lc,a[0])&&cc('BackCompat',b)?\"GWT no longer supports Quirks Mode (document.compatMode=' BackCompat').<br>Make sure your application's host HTML page has a Standards Mode (document.compatMode=' CSS1Compat') doctype,<br>e.g. by using &lt;!doctype html&gt; at the start of your application's HTML page.<br><br>To continue using this unsupported rendering mode and risk layout problems, suppress this message by adding<br>the following line to your*.gwt.xml module file:<br>&nbsp;&nbsp;&lt;extend-configuration-property name=\\\"document.compatMode\\\" value=\\\"\"+b+'\"/&gt;':\"Your *.gwt.xml module configuration prohibits the use of the current doucment rendering mode (document.compatMode=' \"+b+\"').<br>Modify your application's host HTML page doctype, or update your custom 'document.compatMode' configuration property settings.\"}\nvar jc='',nc=' ',lc='CSS1Compat',qc='[Ljava.lang.',pc='com.google.gwt.core.client.',kc='gecko1_8',oc='java.lang.',mc='msie';var _,Jb={},hc={3:1},gc={};Kb(1,-1,gc,i);_.tM=fc;Kb(8,1,hc);Kb(7,8,hc);Kb(6,7,hc);Kb(5,6,{2:1,3:1},r);_.d=function s(){return this.b===p?null:this.b};var p;Kb(12,1,{});var v=0,w=0,A=-1;Kb(14,12,{},S);var O;Kb(22,1,{},bb);var fb,gb;Kb(34,1,{},Rb);_.b=0;Kb(35,6,hc,Yb);Kb(36,6,hc,$b);Kb(37,1,{},ac);_=String.prototype;_.cM={1:1};var ic=I();var xb=Tb(oc,'Object',1),qb=Tb(pc,'Scheduler',12),pb=Tb(pc,'JavaScriptObject$',9),Bb=Tb(oc,'Throwable',8),vb=Tb(oc,'Exception',7),yb=Tb(oc,'RuntimeException',6),zb=Tb(oc,'StackTraceElement',37),Cb=Sb(qc,'StackTraceElement;',38),sb=Tb('com.google.gwt.lang.','SeedUtil',28),ub=Tb(oc,'Class',34),Ab=Tb(oc,'String',2),Db=Sb(qc,'String;',39),tb=Tb(oc,'ClassCastException',35),ob=Tb(pc,'JavaScriptException',5),wb=Tb(oc,'NullPointerException',36),rb=Tb('com.google.gwt.core.client.impl.','SchedulerImpl',14);$sendStats('moduleStartup', 'moduleEvalEnd');gwtOnLoad(__gwtModuleFunction.__errFn, __gwtModuleFunction.__moduleName, __gwtModuleFunction.__moduleBase, __gwtModuleFunction.__softPermutationId,__gwtModuleFunction.__computePropValue);$sendStats('moduleStartup', 'end');\n//# sourceURL=algebrathing-0.js\n"]);
