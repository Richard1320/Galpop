/**
 * Galpop Image Gallery Popup
 * http://galpop.magicmediamuse.com/
 *
 * Author
 * Richard Hung
 * http://www.magicmediamuse.com/
 *
 * Version
 * 1.0.0
 * 
 * Copyright (c) 2013 Richard Hung.
 * 
 * License
 * Galpop Image Gallery Popup by Richard Hung is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License.
 * http://creativecommons.org/licenses/by-nc/3.0/deed.en_US
 */


(function($) {
	
	
	var methods = {
		init : function(settings) {
			
			// Set default parameters
			var defaultSettings = {
				arrowKeys:  true,                // Left and right arrow keys for controls, Esc to close
				controls:   true,                // Display next / prev controls
				loop:       true,                // Loop back to the beginning
				maxWidth:   null,                // Maximum amount of pixels for width
				maxHeight:  null,                // Maximum amount of pixels for height
				maxScreen:  90,                  // Percentage of screen size (overrides maxWidth and maxHeight)
				updateRsz:  true,                // Update on window resize
				callback:   null,                // Callback function after every panel load
				lockScroll: true                 // Prevent scrolling when pop-up is open
			}; // End options
			
			// Override default options
			var settings = $.extend({}, defaultSettings, settings);
			
			return this.click(function(e) {
				
				// bind variables
				wrapper.data({
					arrowKeys:   settings.arrowKeys,
					controls:    settings.controls,
					loop:        settings.loop,
					maxWidth:    settings.maxWidth,
					maxHeight:   settings.maxHeight,
					maxScreen:   settings.maxScreen,
					updateRsz:   settings.updateRsz,
					callback:    settings.callback,
					lockScroll:  settings.lockScroll
				}); // end data
				
				$(this).galpop('openBox');
				
				e.preventDefault();
				
				
			}); // End click
	
		}, // End init
		openBox : function() {
			
			var rel        = this.data('galpop-group');
			var group      = $('[data-galpop-group="'+ rel +'"]');
			var index      = group.index(this);
			var arrowKeys  = wrapper.data('arrowKeys');
			var updateRsz  = wrapper.data('updateRsz');
			var lockScroll = wrapper.data('lockScroll');
			// alert(index);
			// alert(group.text());
			
			if (arrowKeys) {
				$(document).bind('keydown',keybind);
			}
			
			if (updateRsz) {
				$(window).resize(rsz);
			}
			
			if (lockScroll) {
				$('html, body').addClass('lock-scroll');
			}

			wrapper.fadeIn(500,'swing');
			
			wrapper.data({
				rel:    rel,
				group:  group,
				index:  index,
				status: true,
				count:  group.length
			});
			
			// load the item
			this.galpop('preload');
			
			return this;
		}, // end open box
		closeBox : function() {
			
			wrapper.fadeOut(500,'swing',function() {
				content.find('img').remove();
				info.hide().contents().remove();
				$(this).data('status',false);
				prev.hide();
				next.hide();
				
				// remove bound functions
				$(document).unbind('keydown',keybind);
				$(window).unbind('resize',rsz);
				$('html, body').removeClass('lock-scroll');
			});
			
		}, // end close box
		preload : function() {
			var url = this.attr('href');
			
			image = new Image();
			image.src = url;
			image.onload = function() {
				// alert('good');
				wrapper.galpop('display');
			}; // end onload
			image.onerror = function() {
				// alert(url +' contains a broken image!');
				console.log(url +' contains a broken image!');
			}; // end onerror
			
			
			return this;
		}, // end preload
		display : function() {
			var imageHeight  = image.height;
			var imageWidth   = image.width;
			var maxWidth     = wrapper.data('maxWidth');
			var maxHeight    = wrapper.data('maxHeight');
			var maxScreen    = wrapper.data('maxScreen');
			var screenHeight = $(window).height();
			var screenWidth  = $(window).width();
			var ratio        = 0;
			var extraWidth   = container.outerWidth() - container.width();
			var extraHeight  = container.outerHeight() - container.height();

			// set max width and height
			if (!maxWidth || maxWidth > screenWidth * maxScreen / 100) {
				maxWidth = screenWidth * maxScreen / 100;
			}
			if (!maxHeight || maxHeight > screenHeight * maxScreen / 100) {
				maxHeight = screenHeight * maxScreen / 100;
			}
						
			// Check if the current width is larger than the max
			if (imageWidth > maxWidth) {
				ratio       = maxWidth / imageWidth;
				imageHeight = imageHeight * ratio;
				imageWidth  = imageWidth * ratio;
			}
			
			// Check if current height is larger than max
			if (imageHeight > maxHeight) {
				ratio       = maxHeight / imageHeight;
				imageWidth  = imageWidth * ratio;
				imageHeight = imageHeight * ratio;
			}
			
			container.animate({
				height:     imageHeight,
				width:      imageWidth,
				marginTop:  - (imageHeight + extraHeight) / 2,
				marginLeft: - (imageWidth + extraWidth) / 2
			},500,'swing',function() {
				content.append(image).find('img').height(imageHeight).width(imageWidth).fadeIn(500,'swing',function() {
					wrapper.galpop('complete');
				});
			});
			
		}, // end display
		complete : function() {
			var controls = wrapper.data('controls');
			var callback = wrapper.data('callback');
			var index    = wrapper.data('index');
			var index    = wrapper.data('index');
			var count    = wrapper.data('count');
			var loop     = wrapper.data('loop');
			
			wrapper.galpop('infoParse');
			
			// check if on first item and hide prev
			if (!controls || (index == 0 && !loop) || count <= 1) {
				prev.hide();
			} else {
				prev.show();
			}
			
			// check if on last item and hide next
			if (!controls || (index + 1 >= count && !loop) || count <= 1) {
				next.hide();
			} else {
				next.show();
			}
			
			// initiate callback function
			if ($.isFunction(callback)) {
				callback.call(this);
			}
		}, // end display
		moveItem : function(index) {
			var group = wrapper.data('group');
			
			info.fadeOut(500,'swing',function() {
				$(this).contents().remove();
			});
			content.find('img').fadeOut(500, 'swing', function() {
				$(this).remove();
				group.eq(index).galpop('preload');
				wrapper.data('index',index);
			});
			
			return this;
		}, // end move item
		next : function() {
			var index = wrapper.data('index');
			var loop  = wrapper.data('loop');
			var group = wrapper.data('group');
			var count = wrapper.data('count');
			// alert(count + 5);
			// alert(index + 1 +' '+ count);
			// check if last item
			if (index + 1 < count) {
				// alert(index + 1 +' '+ count);
				// move to next item
				index++;
				wrapper.galpop('moveItem',index);
			} else if (loop) {
				// move to first item
				index = 0;
				wrapper.galpop('moveItem',index);
			}
			
			return this;
		}, // End next
		prev : function() { 
			var index = wrapper.data('index');
			var loop  = wrapper.data('loop');
			var group = wrapper.data('group');
			var count = wrapper.data('count');
			
			// check if first item
			if (index > 0) {
				index--;
				wrapper.galpop('moveItem',index);
			} else if (loop) {
				index = count - 1;
				wrapper.galpop('moveItem',index);
			}
			
			return this;
		}, // End prev
		infoParse : function() {
			var index     = wrapper.data('index');
			var group     = wrapper.data('group');
			var anchor    = group.eq(index);
			var title     = $.trim(anchor.attr('title'));
			var url       = $.trim(anchor.data('galpop-link'));
			var urlTitle  = $.trim(anchor.data('galpop-link-title'));
			var urlTarget = $.trim(anchor.data('galpop-link-target'));
			
			// clear info box
			info.html('');
			
			// new title
			if (title != '') {
				$('<p>'+ title +'</p>').appendTo(info);
			}
			
			// new link
			if (url != '') {
				if (urlTitle == '') {
					urlTitle = url;
				}
				
				if (urlTarget != '') {
					urlTarget = 'target="'+ urlTarget +'"';
				}

				$('<p><a href="'+ url +'" '+ urlTarget +'>'+ urlTitle +'</a></p>').appendTo(info);
			}
			
			// show info box
			if (title != '' || url != '') {
				info.fadeIn(500,'swing');
			}
		}, // end info parse
		update : function() {
			var index = wrapper.data('index');
			wrapper.galpop('moveItem',index);
			return this;
		}, // end update
		destroy : function() {
			return this.unbind('click');
		} // End destroy
	}; // End method
    
	
	$.fn.galpop = function(method) {
		
		// Create outer variables
		var wrapper, container, content, info, image, prev, next, keybind, rsz;
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.galpop' );
		}		
		
	}; // End plugin
	
	$(document).ready(function() {
		wrapper   = $('<div id="galpop-wrapper" />').prependTo('body');
		container = $('<div id="galpop-container" />').appendTo(wrapper);
		content   = $('<div id="galpop-content" />').appendTo(container);
		info      = $('<div id="galpop-info" />').appendTo(content);
		prev      = $('<a href="#" id="galpop-prev" />').appendTo(content);
		next      = $('<a href="#" id="galpop-next" />').appendTo(content);
		close     = $('<a href="#" id="galpop-close" />').appendTo(content);
		
		wrapper.click(function(e) {
			$(this).galpop('closeBox');
			
			e.preventDefault();
		});
		container.click(function(e) {
			e.stopPropagation();
		});
		prev.hide().click(function(e) {
			wrapper.galpop('prev');
			e.preventDefault();
		});
		next.hide().click(function(e) {
			wrapper.galpop('next');
			e.preventDefault();
		});
		close.click(function(e) {
			wrapper.galpop('closeBox');
			e.preventDefault();
		});
		info.on('click', 'a', function() {
			wrapper.galpop('closeBox');
		});
		keybind = function(e){
			var k = e.which;
			switch (k) {
				case 27: // esc
					wrapper.galpop('closeBox');
					break;
				case 37: // left arrow
					wrapper.galpop('prev');
					break;
				case 39: // right arrow
					wrapper.galpop('next');
					break;
			}
			e.preventDefault();
		}; // end keybind
		rsz = function() {
			wrapper.galpop('update');
		}; // end resize

	}); // end document ready
	
})(jQuery); 





