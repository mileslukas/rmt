



var Exp_Shell = function(){

	var bannerUrl = (typeof previewBannerUrl != "undefined")? previewBannerUrl : "scripts/richMedia/media/banner.jpg";

	var ADMAXIM_BANNER_W = 768;
	var ADMAXIM_BANNER_H = 120;

	var RM_DESIGN_W = 768;
	var RM_DESIGN_H = 1104;

	var adBannerW = (ADMAXIM_BannerWidth != undefined) ? ADMAXIM_BannerWidth : ADMAXIM_BANNER_W;
	var adBannerH = (ADMAXIM_BannerHeight != undefined) ? ADMAXIM_BannerHeight : ADMAXIM_BANNER_H;

	var standalone = (typeof isStandalone != "undefined" && isStandalone) ? true : false;

	var isMobile = {
    	Android: function() {
        	return navigator.userAgent.match(/Android/i);
    	},
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i);
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
	};

	var page_scale;
	/*
	if( isMobile.any() ){
		page_scale = ($(window).width() / RM_DESIGN_W);
	} else {
		page_scale = 1;
	}*/
	
	var windowWidth = $(window).width();
	if (windowWidth < RM_DESIGN_W){
		page_scale = windowWidth / RM_DESIGN_W;
	} else {
		page_scale = 1;
	}


	var adExpandW = RM_DESIGN_W * page_scale;
	var adExpandH = RM_DESIGN_H * page_scale;

 	if (ADMAXIM_BannerWidth === undefined) adBannerW = adBannerW * page_scale;
	if (ADMAXIM_BannerHeight === undefined) adBannerH = adBannerH * page_scale;






	var clickUrl = (ADMAXIM_clickUrl != undefined) ? ADMAXIM_clickUrl  : " ";
	var clickId = (ADMAXIM_clickId != undefined) ? ADMAXIM_clickId  : " ";

	var appId = (ADMAXIM_appId != undefined) ? ADMAXIM_appId : "";

	var assetRoot = "http://cdnuk.admaxim.com.s3.amazonaws.com/";


	var assetUrl;
	if (appId != "") {
		assetUrl = assetRoot + appId + '/';
	} else {
		assetUrl = '';
	}
	//console.log("assetUrl:" + assetUrl);
	var iframeUrl = (typeof externalAdUrl != "undefined")? externalAdUrl : assetUrl + "scripts/richMedia/expanded.html";
	

	if (typeof ADMAXIM_clickId != "undefined" && typeof ADMAXIM_appId != "undefined"){
		iframeUrl += "?clickid=" + ADMAXIM_clickId + "&appid=" + ADMAXIM_appId;
	}

	var adBanner = (ADMAXIM_adBanner != undefined) ? ADMAXIM_adBanner : bannerUrl;

	//var closeBtnUrl = assetUrl + "btnClose.png";

	var AdMaximBanner = document.getElementById('AdMaximBanner');

	var adLoaded = false;

	var bannerStr = "";
	if (!standalone) bannerStr += "<img id=\"adBanner\" onclick='exp_shell.bannerClick()' src=\""+adBanner+"\" style=\"display:block; width:"+adBannerW+"px; height:"+adBannerH+"px; \" \/>";
	bannerStr += "<img id=\"AdMaximTrack\" style=\"display:block; margin:-1px 0 0 -1px; padding:0; width:1px; height:1px\" \/>";
	var iframeStr = "<iframe id='adFrame' allowtransparency='true' scrolling='no' src='' width='0' height='0' style='border:none; position:absolute; top:0; left:0;'></iframe>";
	var expandedExp;
	var trackImg;
	var expandedIframe;


	function buildAd(){

		AdMaximBanner.innerHTML = bannerStr;


		var ex = document.createElement('div');
		ex.setAttribute('id', 'adExpand');
		ex.style.width = "1px";
		ex.style.height = "1px";
		ex.style.left = "-1px";
		ex.style.top = "-1px";
		ex.style.position = "absolute";
		ex.style.overflow = "hidden";
		ex.innerHTML = iframeStr;
		document.body.appendChild(ex);

		trackImg = document.getElementById("AdMaximTrack");
		expandedExp = document.getElementById("adExpand");
		expandedIframe = document.getElementById("adFrame");

		if (!standalone){
			var btnW = 60;	
			var btnH = 60;

			var imgBtn = document.createElement('img');
			imgBtn.src = assetUrl + "scripts/richMedia/media/close_btn.png";
			imgBtn.style.width = btnW * page_scale + "px";
			imgBtn.style.height = btnH * page_scale + "px";
			imgBtn.style.right = "0px";
			imgBtn.style.top = "0px";
			imgBtn.style.position = "absolute";
			ex.appendChild(imgBtn);
			
			var closeBtn = document.createElement('div');
			closeBtn.setAttribute('onclick', 'exp_shell.closeBtnClick()');
			closeBtn.style.width = btnW * page_scale + "px";
			closeBtn.style.height = btnH * page_scale + "px";
			closeBtn.style.right = "0px";
			closeBtn.style.top = "0px";
			closeBtn.style.position = "absolute";
			ex.appendChild(closeBtn);
		} else {
			expandExp();
		}
	

		updateiFrameSize();

	}


	function updateiFrameSize(){	
		var adFrameCss = "";
		adFrameCss += ' transform-origin: 0% 0%;';
		adFrameCss += ' -ms-transform-origin: 0% 0%;';
		adFrameCss += ' -webkit-transform-origin: 0% 0%;';
		adFrameCss += ' -moz-transform-origin: 0% 0%;';
		adFrameCss += ' -o-transform-origin: 0% 0%;',
		adFrameCss += ' transform: scale('+page_scale+','+page_scale+');';
		adFrameCss += ' -ms-transform: scale('+page_scale+','+page_scale+');';
		adFrameCss += ' -webkit-transform: scale('+page_scale+','+page_scale+');';
		adFrameCss += ' -o-transform: scale('+page_scale+','+page_scale+');';
		adFrameCss += ' -moz-transform: scale('+page_scale+','+page_scale+');';
		adFrameCss += ' -ms-transform: scale('+page_scale+','+page_scale+');';

		console.log(adFrameCss);
		addCssClass('#adFrame', adFrameCss); 
	}

	function addCssClass ( selector, styles ){
        try {
            style = document.getElementById('myCustomStyleID');
            temp = style.innerHTML;
            style.innerHTML = temp + selector + "{ " + styles + "}\n";
        }
        catch (err)
        {
            style = document.createElement("style");
            style.id = 'myCustomStyleID'
            style.setAttribute('type', 'text/css');
            style.innerHTML = selector + "{ " + styles + " }\n";
            document.head.insertBefore(style,document.head.childNodes[0]);   
        }
    }


	function closeExpand(){
		//expandedExp.style.display = "none";
		expandedExp.style.width = "1px";
		expandedExp.style.height = "1px";
		expandedExp.style.left = "-1px";
		expandedExp.style.top = "-1px";
		expandedIframe.width = 0;
		expandedIframe.height = 0;

		expandedIframe.src = "";
	}

	function expandExp(){
		if (!adLoaded){
			trackImg.src = clickUrl;
			adLoaded = true;
		}

		//setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
		
		expandedExp.style.width = adExpandW + "px";
		expandedExp.style.height = adExpandH + "px";
		expandedExp.style.left = "0px";
		expandedExp.style.top = "0px";

		expandedIframe.width = RM_DESIGN_W;
		expandedIframe.height = RM_DESIGN_H;
		expandedIframe.src = iframeUrl;
	}


	this.closeBtnClick = function(){
		if (useMraid()){	
			mraid.close();
		} else {
			closeExpand();
		}
	}

	this.bannerClick = function(){
		if (useMraid()){	
			mraid.expand();
		} else {
			expandExp();
		}
	}

	function useMraid(){
		var use;
		if (typeof mraid === "object") {
			use = true;
		} else {
			use = false;
		}
		return use;
	}





	function createAd() {

		registerMraidHandlers(mraid);

		mraid.setExpandProperties({
			width : adExpandW,
			height : adExpandH,
			useCustomClose : true
		});

		buildAd();
	};

	/*
	 * Add a listener to the stateChange event to figure out what state the client
	 * listener is in and whether to render the rich functionality or not
	 */
	function registerMraidHandlers(mraid, basePath) {
		
		mraid.addEventListener("stateChange", function(state) {
			switch (state) {
				case "hidden":
					closeExpand();
					break;

				case "expanded":
					expandExp();
					break;
				
				case "default":
					closeExpand();
					break;
			}
		});
	}


	this.init = function (){

		if (useMraid()){
			if (mraid.getState() === 'loading') {
			  	mraid.addEventListener('ready', showAd);
			} else {
			   	createAd();
			}
		} else {
			buildAd();
		}

	}



}

var exp_shell = new Exp_Shell();
exp_shell.init();












