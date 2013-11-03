(function($) {
    $.fn.MachineGunText=function(options) {
		var defauts= {
			width: '100%',
			height: '50px',
			bgcolor: '#000',
			bgimage: '',
			bgrepeat: 'no-repeat',
			bgposition: 'top center',
			bgattachment: 'fixed',
			bgsize: 'cover',
			text: "don't forget to set text",
			maxlenght: 12,
			fontcolor: '#fff',
			fontsize: '50px',
			fontfamily: "Arial",
			fontweight: '400',
			animsentencemaxduration: 0.5,
			animdelay: 0.6,
			animrepeat: -1,
			animrepeatdelay: 2,
			animdramaticpause: true,
			animdramaticpauseduration: 0.6,
			animmaxscale: 1.2,
			callback: null,
			callbacksentence: null
		}; 
		var params=$.extend(defauts, options);
		var texttop=(parseInt(params.height)-parseInt(params.fontsize))/2+'px';
		this.each(function() {
			var element=$(this);
			element.css({
				position:'relative',
				marginLeft:'auto',
				marginRight:'auto',
				overflow:'hidden',
				width: params.width,
				height: params.height,
				background: params.bgcolor
			});
			if (params.bgimage!='') {
				element.css({
					'background': 'url('+params.bgimage+')',
					'background-repeat': params.bgrepeat,
					'background-position': params.bgposition,
					'background-attachment': params.bgattachment,
					'-webkit-background-size': params.bgsize,
					'-moz-background-size': params.bgsize,
					'-o-background-size': params.bgsize,
					'background-size': params.bgsize
				});
			}
			element.addClass('MachineGunTextContainer');
			var container = element, sentenceEndExp = /(\.|\?|!)$/g;
			function buildChunks(text, maxLength) {
			  if (maxLength === undefined) {return text.split(" ");}
			  var words = text.split(" "), wordCount = words.length, chunk = [], chunks = [], cpt;
			  for (cpt = 0; cpt < wordCount; cpt++) {
				chunk.push(words[cpt]);
				if (sentenceEndExp.test(words[cpt]) || cpt === wordCount - 1 || chunk.join(" ").length + words[cpt+1].length > maxLength) {
				  chunks.push(chunk.join(" "));
				  chunk = [];
				}
			  }
			  return chunks;
			}
			function machineGun(chunks, maxLength) {
				if (!(chunks instanceof Array)) {chunks = buildChunks(chunks, maxLength);}
				var tl = new TimelineMax({
					delay:params.animdelay,
					onComplete:function() {
						if(params.callback)	{
							params.callback();
						}
					},
					repeat:params.animrepeat,
					repeatDelay:params.animrepeatdelay
				}),
				time = 0, chunk, element, duration, isSentenceEnd, cpt;
				for (cpt = 0; cpt < chunks.length; cpt++) {
					chunk = chunks[cpt];
					isSentenceEnd = sentenceEndExp.test(chunk) || (cpt === chunks.length - 1);
					element = $('<div>' + chunk + '</div>').css({
						'position': 'absolute',
						'margin': '0',
						'padding': '0',
						'top': texttop,
						'text-align': 'center',
						'visibility': 'hidden', 
						'width': params.width,
						'color': params.fontcolor,
						'fontFamily': params.fontfamily,
						'fontWeight': params.fontweight,
						'fontSize': params.fontsize
					}).addClass('MachineGunTextSentence').appendTo(container);
					duration = Math.max(params.animsentencemaxduration, chunk.length * 0.08);
					if (isSentenceEnd) {duration += params.animdramaticpause==true ? params.animdramaticpauseduration : 0;}
					TweenLite.set(element, {autoAlpha:0, scale:0, z:0.01});
					tl.to(element, duration, {scale:params.animmaxscale,  ease:SlowMo.ease.config(0.25, 0.9)}, time)
					  .to(element, duration, {
					  		autoAlpha:1,
							ease:SlowMo.ease.config(0.25, 0.9, true),
							onComplete:function() {
								if(params.callbacksentence)	{
									params.callbacksentence();
								}
							}
					}, time);
					time += duration - 0.05;
					if (isSentenceEnd) {time += params.animdramaticpause==true ? params.animdramaticpauseduration : 0;}
				}
			}
			machineGun(params.text, params.maxlenght);
		});
		return this;
	};	
})(jQuery);
