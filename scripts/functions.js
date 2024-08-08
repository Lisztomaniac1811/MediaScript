function openModal() {
    document.getElementById("GalleryModal").style.display = "block";
    var k = document.getElementsByTagName("BODY")[0];
    k.style.overflow = "hidden";
  }
  function closeModal() {
    document.getElementById("GalleryModal").style.display = "none";
    var k = document.getElementsByTagName("BODY")[0];
    k.style.overflow = "visible";
  }
  
  var slideIndex = 1;
  showSlides(slideIndex);
  
  function plusSlides(n) {
    showSlides(slideIndex += n);
    pauseYouTubeVideo()
  }
  
  function scrollthebar() {
    window.location.href = "#galleryitem-" + slideIndex;
  }
  
  function currentSlide(n) {
    showSlides(slideIndex = n);
    pauseYouTubeVideo();
  }
  
  function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("GallerySlides");
    var dots = document.getElementsByClassName("Gallery1Demo");
    var Gallery1CaptionText = document.getElementById("GalleryCaption");
    if (n > slides.length) {
      slideIndex = 1
    }
    if (n < 1) {
      slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    Gallery1CaptionText.innerHTML = dots[slideIndex - 1].alt;
  }
  document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
      closeModal();
      pauseYouTubeVideo();
    }
  });


  var startX;
	var startY;

		// Add touchstart event listener to element
		document.getElementById("GalleryModal").addEventListener("touchstart", function(event) {
			// Get starting coordinates
			startX = event.touches[0].clientX;
			startY = event.touches[0].clientY;
		});

		// Add touchend event listener to element
		document.getElementById("GalleryModal").addEventListener("touchend", function(event) {
			// Get ending coordinates
			var endX = event.changedTouches[0].clientX;
			var endY = event.changedTouches[0].clientY;

			// Calculate distance and direction
			var distanceX = endX - startX;
			var distanceY = endY - startY;
			var direction;

			if (Math.abs(distanceX) > Math.abs(distanceY)) {
				direction = (distanceX > 0) ? "right" : "left";
			} else {
				direction = (distanceY > 0) ? "down" : "up";
			}

			// Run appropriate function based on direction of swipe
			if (direction === "right") {
				// Run function for right swipe
				plusSlides(-1);
        scrollthebar();
			} else if (direction === "left") {
				// Run function for left swipe
				plusSlides(1);
        scrollthebar();
			}
		});


    
    // Add keydown event listener to document
    document.addEventListener("keydown", function(event) {
      // Check if pressed key is left or right arrow
      if (event.key === "ArrowLeft") {
          // Run function for left arrow press
          leftArrowFunction();
      } else if (event.key === "ArrowRight") {
          // Run function for right arrow press
          rightArrowFunction();
      }
  });
  

		// Define functions to run on left and right arrow press
		function leftArrowFunction() {
			plusSlides(-1);
        scrollthebar();
			// Add your code for left arrow press here
		}

		function rightArrowFunction() {
			plusSlides(1);
        scrollthebar();
			// Add your code for right arrow press here
		}

function pauseYouTubeVideo() {
    // Get all the iframe elements that contain YouTube videos.
    var iframes = document.querySelectorAll("iframe[src*='youtube.com/embed']");
  
    // Pause all the videos.
    for (var i = 0; i < iframes.length; i++) {
      iframes[i].contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }
  }

  document.write(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="height: 0px; width: 0px; position: absolute; overflow: hidden;" aria-hidden="true">
    <symbol id="wds-player-icon-play" viewbox="0 0 180 180">
    <g fill="none" fill-rule="evenodd">
    <!-- Add the circle behind the play button -->
    <circle cx="90" cy="90" r="60" fill="rgba(255, 255, 255, 0.9)" \/>
    <g opacity=".9" transform="rotate(90 75 90)">
    <use xlink:href="#b" fill="#000" filter="url(#a)" \/>
    <use xlink:href="#b" fill="#FFF" \/>
    <\/g>
    <path fill="#fa005a" fill-rule="nonzero" d="M80.87 58.006l34.32 25.523c3.052 2.27 3.722 6.633 1.496 9.746a6.91 6.91 0 0 1-1.497 1.527l-34.32 25.523c-3.053 2.27-7.33 1.586-9.558-1.527A7.07 7.07 0 0 1 70 114.69V63.643c0-3.854 3.063-6.977 6.84-6.977 1.45 0 2.86.47 4.03 1.34z" \/>
    <\/g>
  <\/symbol>
  <\/svg>
  `)
  