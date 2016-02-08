// JavaScript Document
window.onload = function() {
	
	var galleryWithPagination = new Gallery({// первая
		images: document.getElementById("gallery-1"),
		effect: 'slide',
		pagination: true,
		controls: false
	});
		
	var galleryWithControls = new Gallery({// вторая
		images: document.getElementById("gallery-2"),
		effect: 'fade',
		pagination: false,
		controls: true
	});
		
	function Gallery(galleryInfoObj) {
		
		if (!!document.getElementsByTagName("DIV")[0] &&
			 (document.getElementsByTagName("DIV")[0] === document.body.firstElementChild)) {
			var wrapper = document.getElementsByTagName("DIV")[0];
		} else {
			var wrapper = document.createElement("DIV");
			wrapper.setAttribute("id", "wrapper");
			document.body.appendChild(wrapper);
		}
	
		if (!!galleryInfoObj.images && (galleryInfoObj.images.nodeName == "UL")) {
			var containerUL = galleryInfoObj.images;
		} else {
				alert("Список изображений не найден");
		}
	
		var holdGallery = document.createElement("DIV");
		var galleryElementsArray = [];
		var count = 0;
		var leftMargin = 0;
		var changeNow = false;
			
		this.create = function() {
			var holdList = document.createElement("DIV");
		
			wrapper.insertBefore(holdGallery, containerUL);
			holdList.appendChild(containerUL);
			holdGallery.appendChild(holdList);
			holdGallery.setAttribute("class", "gallery-holder");
			
			if (galleryInfoObj.effect == 'fade') {
				holdList.setAttribute("class", "gallery fade");
			} else {
				holdList.setAttribute("class", "gallery slide");
			}
		
			var galleryElements = containerUL.getElementsByTagName("LI");
			for (var i = 0; i < galleryElements.length; i++) {
				galleryElementsArray.push(galleryElements[i]);
			}
			
			if (galleryInfoObj.effect == 'fade') {
				galleryElementsArray[count].setAttribute("class", "active");
			}
		};
				
		this.prevNext = function() {
			var prevButton = document.createElement("DIV");
			var nextButton = document.createElement("DIV");
		
			holdGallery.style.width = holdGallery.offsetWidth + 120 + "px";
		
			prevButton.setAttribute("class", "prev");
			prevButton.innerHTML = '<a href="#" title="Previous">Previous</a>';
			holdGallery.appendChild(prevButton);
		
			nextButton.setAttribute("class", "next");
			nextButton.innerHTML = '<a href="#" title="Next">Next</a>';
			holdGallery.appendChild(nextButton);
					
			if (galleryInfoObj.effect == 'fade') {
				prevButton.addEventListener("click", previousFade, false);
				nextButton.addEventListener("click", nextFade, false);
			} else {
				prevButton.firstElementChild.addEventListener("click", previousSlide, false);
				nextButton.firstElementChild.addEventListener("click", nextSlide, false);
			}
		
			function previousSlide(e) {
				e.preventDefault();
				
				if (count == 0) {
					for (var i = 0; i < galleryElementsArray.length - 1; i++) {
						leftMargin += galleryElementsArray[i].offsetWidth;
						++count;
					}
					containerUL.style.marginLeft = "-" + leftMargin + "px";
				} else {
					leftMargin -= galleryElementsArray[count].offsetWidth;
					containerUL.style.marginLeft = "-" + leftMargin + "px";
					--count;
				}
			};
		
			function nextSlide(e) {
				e.preventDefault();
				
				if (count < galleryElementsArray.length - 1) {
					leftMargin += galleryElementsArray[count].offsetWidth;
					containerUL.style.marginLeft = "-" + leftMargin + "px";
					++count;
				} else {
					leftMargin = 0;
					containerUL.style.marginLeft = leftMargin;
					count = 0;
				}
			};
			
			function previousFade(e) {
				e.preventDefault();
			
				if (!changeNow) {
					var nextCount = ((count - 1) < 0) ? (galleryElementsArray.length - 1) : (count - 1);
					changing(count, nextCount, e);
				}
			};
			
			function nextFade(e) {
				e.preventDefault();
			
				if (!changeNow) {
					var nextCount = ((count + 1) > (galleryElementsArray.length - 1)) ? 0 : (count + 1);
					changing(count, nextCount, e);
				}
			};
		};
	
		this.pagination = function() {
			var pagingContainer = document.createElement("DIV");
			var pagingList = document.createElement("UL");
			var pagingLinksArray = [];
		
			pagingContainer.setAttribute("class", "paging");
			pagingContainer.appendChild(pagingList);
			holdGallery.appendChild(pagingContainer);
		
			for (var i = 0; i < galleryElementsArray.length; i++) {
				pagingLinksArray[i] = document.createElement("LI");
				pagingLinksArray[i].innerHTML += '<a href="#" title="' + (i+1) + '">' + (i+1) + '</a>';
				pagingList.appendChild(pagingLinksArray[i]);
				pagingLinksArray[i].addEventListener("click", paging, false);
			}
		
			pagingList.firstElementChild.setAttribute("class", "active");
		
		
			function paging(e) {
				e.preventDefault();
								
				if (galleryInfoObj.effect == 'fade') {
					pagingFade();
				} else {
					pagingSlide();
				}
				
				function pagingSlide() {
					leftMargin = 0;
					count = (pagingLinksArray.indexOf(e.target.parentNode) > -1) ?
						pagingLinksArray.indexOf(e.target.parentNode) : count;
					
					for (var i = 0; i < count; i++) {
						leftMargin += galleryElementsArray[i].offsetWidth;
					}
					if (leftMargin == 0) {
						containerUL.style.marginLeft = leftMargin;
					} else {
						containerUL.style.marginLeft = "-" + leftMargin + "px";
					}
				};
				
				function pagingFade() {
					current = count;
					next = (pagingLinksArray.indexOf(e.target.parentNode) > -1) ?
						pagingLinksArray.indexOf(e.target.parentNode) : count;
						
					changing(current, next, e);
				}								
			};
			
			holdGallery.addEventListener("click", changePaging, false);
				
			function changePaging() {
				if ((galleryInfoObj.effect == 'fade') && changeNow) {
					galleryElementsArray[count].addEventListener("transitionend", changeAttrib, false);
									
				} else {
					for (var i = 0; i < pagingLinksArray.length; i++) {
						pagingLinksArray[i].removeAttribute("class");
					}
					pagingLinksArray[count].setAttribute("class", "active");
				}
				
				function  changeAttrib() {
					var previous = count;
					setTimeout(
						function() {
							pagingLinksArray[previous].removeAttribute("class");
							pagingLinksArray[count].setAttribute("class", "active");
							galleryElementsArray[previous].removeEventListener("transitionend", changeAttrib, false);
						},
					0);
				};
			};
		};
		
		function changing(current, next, events) {
			
			if (current == next) {
				return;
			}
			
			var changed = false;
			changeNow = true;
			galleryElementsArray[current].style.zIndex = "3";
			galleryElementsArray[current].removeAttribute("class");
			if (events.target.parentNode.className == "prev") {
				galleryElementsArray[current].style.left = "-" + galleryElementsArray[current].offsetWidth + "px";
			} else if (events.target.parentNode.className == "next") {
				galleryElementsArray[current].style.left = galleryElementsArray[current].offsetWidth + "px";
			} else {
				if (current > next) {
					galleryElementsArray[current].style.left = "-" + galleryElementsArray[current].offsetWidth + "px";
				} else if (current < next) {
					galleryElementsArray[current].style.left = galleryElementsArray[current].offsetWidth + "px";
				}
			}
			
			galleryElementsArray[next].style.zIndex = "2";
						
			galleryElementsArray[current].addEventListener("transitionend", changeStyle, false);
			
			function changeStyle() {
				if (!changed) {
					galleryElementsArray[next].setAttribute("class", "active");
					
					galleryElementsArray[current].style.transition = "none";
					galleryElementsArray[current].style.zIndex = "1";
					galleryElementsArray[current].style.left = "0";
					
					setTimeout(
						function() {
							galleryElementsArray[current].removeAttribute("style");
							galleryElementsArray[next].removeAttribute("style");
							galleryElementsArray[current].removeEventListener("transitionend", changeStyle, false);
							count = next;
							changed = true;
							changeNow = false;
						},
					0);
				}
			};
		};
		
		this.create();

		if (!!galleryInfoObj.controls && (galleryInfoObj.controls == true)) {
			this.prevNext();
		}
		
		if (!!galleryInfoObj.pagination && (galleryInfoObj.pagination == true)) {
			this.pagination();
		}
					
	};

};

