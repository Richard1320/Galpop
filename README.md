# Galpop Image Gallery

Description: Galpop is an content pop-up that can display images, HTML and iframes. It can be controlled with the left and right arrow keys and automatically resizes with your browser.

Author: Richard Hung

More documentation and examples: http://richard1320.github.io/Galpop/

## Key Features

- Resizes with your browser
- Can use arrow keys for controls
- Callbacks after every image is loaded
- Backgrounds and borders can be easily changed with CSS

## How to Use

Galpop has a CSS and JS file in addition to the jQuery library.

```
<link type="text/css" href="css/jquery.galpop.css" rel="stylesheet" media="screen" />

<script src="http://code.jquery.com/jquery-latest.js"></script>

<script type="text/javascript" src="js/jquery.galpop.min.js"></script>
```

Create anchors that link to the pop-up image. You should add a "data-galpop-group" attribute to the anchor which will group all your images so you can use next and previous buttons.

```
<a href="images/image-1-large.jpg" class="galpop" data-galpop-group="gallery" title="first image">
	<img src="images/image-1-tb.jpg" alt="first image thumbnail" />
</a>
<a href="images/image-2-large.jpg" class="galpop" data-galpop-group="gallery" title="second image">
	<img src="images/image-2-tb.jpg" alt="second image thumbnail" />
</a>
<a href="images/image-3-large.jpg" class="galpop" data-galpop-group="gallery" title="third image">
	<img src="images/image-3-tb.jpg" alt="third image thumbnail" />
</a>
```

Initiate the plugin after the HTML markup.

```
$('.galpop').galpop();
```
