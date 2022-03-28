// JavaScript Document


$(document).ready(function() {
	SyntaxHighlighter.all();
	SyntaxHighlighter.defaults['tab-size'] = 2;

	$('.galpop-home').galpop();

	$('.galpop-single').galpop();

	$('.galpop-multiple').galpop();

	$('.galpop-info').galpop();


	var callback = function() {
		var wrapper = $('#galpop-wrapper');
		var info    = $('#galpop-info');
		var count   = wrapper.data('count');
		var index   = wrapper.data('index');
		var current = index + 1;
		var string  = 'Image '+ current +' of '+ count;

		info.append('<p>'+ string +'</p>').fadeIn();

	};
	$('.galpop-callback').galpop({
		callback: callback
	});

	$('.manual-open').change(function(e) {
		var image = $(this).val();
		if (image) {
			var settings = {};
			$.fn.galpop('openBox',settings,image);
		}
	});

	$('.manual-open-group').change(function(e) {
		var v = $(this).val();
		var images = [
			'images/gallery/large/apocalypse.jpg',
			'images/gallery/large/vintage.jpg',
			'images/gallery/large/magicLake.jpg',
			'images/gallery/large/underwater.jpg',
			'images/gallery/large/goodBoy.jpg',
			'images/gallery/large/darkroad.jpg',
			'images/gallery/large/roadkill.jpg',
			'images/gallery/large/wolfMarine.jpg',
			'images/gallery/large/alice.jpg',
			'images/gallery/large/reflection.jpg',
		];
		var settings = {};
		$.fn.galpop('openBox',settings,images,v);
	});
	
	$('.click-open-iframe').galpop({
		contentType: 'iframe',
	});

	$('.click-open-ajax').galpop({
		contentType: 'AJAX',
	});


});
