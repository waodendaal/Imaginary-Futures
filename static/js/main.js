// $('.js').find('.cd-h-timeline__event-content ').hide()
(function() {
	// Horizontal Timeline - by CodyHouse.co
	$('#timeline_list li:first-child').find('a').addClass('cd-h-timeline__date--selected');
	var HorizontalTimeline = function(element) {
		this.element = element;
		this.datesContainer = this.element.getElementsByClassName('cd-h-timeline__dates')[0];
		this.line = this.datesContainer.getElementsByClassName('cd-h-timeline__line')[0]; // grey line in the top timeline section
		this.fillingLine = this.datesContainer.getElementsByClassName('cd-h-timeline__filling-line')[0]; // green filling line in the top timeline section  
		this.date = this.line.getElementsByClassName('cd-h-timeline__date');
		this.selectedDate = this.line.getElementsByClassName('cd-h-timeline__date--selected')[0];
		this.dateValues = parseDate(this);
		this.minLapse = calcMinLapse(this);
		this.navigation = this.element.getElementsByClassName('cd-h-timeline__navigation');
		this.contentWrapper = this.element.getElementsByClassName('cd-h-timeline__events')[0];
		this.content = this.contentWrapper.getElementsByClassName('cd-h-timeline__event');
		this.eventsMinDistance = 60; // min distance between two consecutive events (in px)
		this.eventsMaxDistance = 200; // max distance between two consecutive events (in px)
		this.translate = 0; // this will be used to store the translate value of this.line
		this.lineLength = 0; //total length of this.line
		// store index of selected and previous selected dates
		this.oldDateIndex = Util.getIndexInArray(this.date, this.selectedDate);
		this.newDateIndex = this.oldDateIndex;
		initTimeline(this);
		initEvents(this);
	};

	function initTimeline(timeline) {
		// set dates left position
		var left = 30;
		for (var i = 0; i < timeline.dateValues.length; i++) {
			var j = (i == 0) ? 0 : i - 1;
			var distance = daydiff(timeline.dateValues[j], timeline.dateValues[i]),
				distanceNorm = (Math.round(distance / timeline.minLapse) + 2) * timeline.eventsMinDistance;
			if (distanceNorm < timeline.eventsMinDistance) {
				distanceNorm = timeline.eventsMinDistance;
			} else if (distanceNorm > timeline.eventsMaxDistance) {
				distanceNorm = timeline.eventsMaxDistance;
			}
			left = left + distanceNorm;
			timeline.date[i].setAttribute('style', 'left:' + left + 'px');
		}
		// set line/filling line dimensions
		timeline.line.style.width = (left + timeline.eventsMinDistance) + 'px';
		timeline.lineLength = left + timeline.eventsMinDistance;
		// reveal timeline
		Util.addClass(timeline.element, 'cd-h-timeline--loaded');
		selectNewDate(timeline, timeline.selectedDate);
		resetTimelinePosition(timeline, 'next');
	};

	function initEvents(timeline) {
		var self = timeline;
		// click on arrow navigation
		self.navigation[0].addEventListener('click', function(event) {
			event.preventDefault();
			translateTimeline(self, 'prev');
		});
		self.navigation[1].addEventListener('click', function(event) {
			event.preventDefault();
			translateTimeline(self, 'next');
		});
		//swipe on timeline
		new SwipeContent(self.datesContainer);
		self.datesContainer.addEventListener('swipeLeft', function(event) {
			translateTimeline(self, 'next');
		});
		self.datesContainer.addEventListener('swipeRight', function(event) {
			translateTimeline(self, 'prev');
		});
		//select a new event
		// console.log('self.date.length: ', self.date.length)
		for (var i = 0; i < self.date.length; i++) {
			(function(i) {
				// console.log('self.date[i]', self.date[i]);
				self.date[i].addEventListener('click', function(event) {
					event.preventDefault();
					selectNewDate(self, event.target);
				});
				if (i < 2) {
					self.content[i].addEventListener('animationend', function(event) {
						if (timeline.newDateIndex > timeline.oldDateIndex) {
							var domSelection_newDate = 1;
							var domSelection_oldDate = 0;
						} else if (timeline.newDateIndex < timeline.oldDateIndex) {
							var domSelection_newDate = 0;
							var domSelection_oldDate = 1;
						} else {
							var domSelection_newDate = 0;
						}
						if (i == domSelection_newDate && domSelection_newDate != domSelection_oldDate) resetAnimation(self);
					});
				}
			})(i);
		}
	};

	function updateFilling(timeline) { // update fillingLine scale value
		var dateStyle = window.getComputedStyle(timeline.selectedDate, null),
			left = dateStyle.getPropertyValue("left"),
			width = dateStyle.getPropertyValue("width");
		left = Number(left.replace('px', '')) + Number(width.replace('px', '')) / 2;
		timeline.fillingLine.style.transform = 'scaleX(' + (left / timeline.lineLength) + ')';
	};

	function translateTimeline(timeline, direction) { // translate timeline (and date elements)
		var containerWidth = timeline.datesContainer.offsetWidth;
		if (direction) {
			timeline.translate = (direction == 'next') ? timeline.translate - containerWidth + timeline.eventsMinDistance : timeline.translate + containerWidth - timeline.eventsMinDistance;
		}
		if (0 - timeline.translate > timeline.lineLength - containerWidth) timeline.translate = containerWidth - timeline.lineLength;
		if (timeline.translate > 0) {
			timeline.translate = 0;
		} else {
			stripAnimation(1)
		}
		timeline.line.style.transform = 'translateX(' + timeline.translate + 'px)';
		// update the navigation items status (toggle inactive class)
		(timeline.translate == 0) ? Util.addClass(timeline.navigation[0], 'cd-h-timeline__navigation--inactive'): Util.removeClass(timeline.navigation[0], 'cd-h-timeline__navigation--inactive');
		(timeline.translate == containerWidth - timeline.lineLength) ? Util.addClass(timeline.navigation[1], 'cd-h-timeline__navigation--inactive'): Util.removeClass(timeline.navigation[1], 'cd-h-timeline__navigation--inactive');
	};

	function selectNewDate(timeline, target) { // new date has been selected -> update timeline
		timeline.newDateIndex = Util.getIndexInArray(timeline.date, target);
		timeline.oldDateIndex = Util.getIndexInArray(timeline.date, timeline.selectedDate);
		// console.log('target ', target.attributes['data-date'].textContent)
		targetDate = target.attributes['data-date'].textContent.split('/', 3)[2]
		// See which direction
		direction = ""
		if (timeline.newDateIndex < timeline.oldDateIndex) {
			direction = 'left'
		} else {
			direction = 'right'
		}
		//Post new date and direction to Flask
		//  console.log('Datedata Clicked')
		// $.post("/dateClicked", {dateData:date})
		postDataToFlask(targetDate, direction)
		Util.removeClass(timeline.selectedDate, 'cd-h-timeline__date--selected');
		Util.addClass(timeline.date[timeline.newDateIndex], 'cd-h-timeline__date--selected');
		timeline.selectedDate = timeline.date[timeline.newDateIndex];
		updateOlderEvents(timeline);
		updateVisibleContent(timeline);
		updateFilling(timeline);
	};

	function updateOlderEvents(timeline) { // update older events style
		for (var i = 0; i < timeline.date.length; i++) {
			(i < timeline.newDateIndex) ? Util.addClass(timeline.date[i], 'cd-h-timeline__date--older-event'): Util.removeClass(timeline.date[i], 'cd-h-timeline__date--older-event');
		}
	};

	function updateVisibleContent(timeline) { // show content of new selected date
		// console.log('timeline: ', timeline)
		if (timeline.newDateIndex > timeline.oldDateIndex) {
			var domSelection_newDate = 1;
			var domSelection_oldDate = 0;
			var classEntering = 'cd-h-timeline__event--selected cd-h-timeline__event--enter-right',
				classLeaving = 'cd-h-timeline__event--leave-left';
		} else if (timeline.newDateIndex < timeline.oldDateIndex) {
			var domSelection_newDate = 0;
			var domSelection_oldDate = 1;
			var classEntering = 'cd-h-timeline__event--selected cd-h-timeline__event--enter-left',
				classLeaving = 'cd-h-timeline__event--leave-right';
		} else {
			var classEntering = 'cd-h-timeline__event--selected',
				classLeaving = '';
			var domSelection_newDate = 0;
		}
		Util.addClass(timeline.content[domSelection_newDate], classEntering);
		if (timeline.newDateIndex != timeline.oldDateIndex) {
			Util.removeClass(timeline.content[domSelection_oldDate], 'cd-h-timeline__event--selected');
			Util.addClass(timeline.content[domSelection_oldDate], classLeaving);
			timeline.contentWrapper.style.height = timeline.content[domSelection_newDate].offsetHeight + 'px';
		}
	};

	function resetAnimation(timeline) {
		if ($('.text_entry').css("display") == "none") {
			$('.text_entry').fadeIn(1500);
			$('.text_entry').css({
				'display': 'grid'
			})
		}
		// reset content classes when entering animation is over
		timeline.contentWrapper.style.height = null;
		if (timeline.newDateIndex > timeline.oldDateIndex) {
			var domSelection_newDate = 1;
			var domSelection_oldDate = 0;
		} else if (timeline.newDateIndex < timeline.oldDateIndex) {
			var domSelection_newDate = 0;
			var domSelection_oldDate = 1;
		} else {
			var domSelection_newDate = 0;
		}
		console.log("domSelection_newDate: ", domSelection_newDate, " ", timeline.newDateIndex)
		console.log("domSelection_oldDate: ", domSelection_oldDate, " ", timeline.oldDateIndex)
		//Fix transition of first next date
		// console.log((timeline.newDateIndex - timeline.newDateIndex))
		if ((timeline.newDateIndex - timeline.oldDateIndex) == 1) {
			console.log("Special Animation Right")
			// Right div - move out, then move in (class)
		}
		Util.removeClass(timeline.content[domSelection_oldDate], 'cd-h-timeline__event--enter-right cd-h-timeline__event--enter-left cd-h-timeline__event--leave-right cd-h-timeline__event--leave-left');
		Util.removeClass(timeline.content[domSelection_newDate], 'cd-h-timeline__event--enter-right cd-h-timeline__event--enter-left cd-h-timeline__event--leave-right cd-h-timeline__event--leave-left');
	};

	function keyNavigateTimeline(timeline, direction) { // navigate the timeline using the keyboard
		var newIndex = (direction == 'next') ? timeline.newDateIndex + 1 : timeline.newDateIndex - 1;
		if (newIndex < 0 || newIndex >= timeline.date.length) return;
		selectNewDate(timeline, timeline.date[newIndex]);
		resetTimelinePosition(timeline, direction);
	};

	function resetTimelinePosition(timeline, direction) { //translate timeline according to new selected event position
		var eventStyle = window.getComputedStyle(timeline.selectedDate, null),
			eventLeft = Number(eventStyle.getPropertyValue('left').replace('px', '')),
			timelineWidth = timeline.datesContainer.offsetWidth;
		if ((direction == 'next' && eventLeft >= timelineWidth - timeline.translate) || (direction == 'prev' && eventLeft <= -timeline.translate)) {
			timeline.translate = timelineWidth / 2 - eventLeft;
			translateTimeline(timeline, false);
		}
	};

	function parseDate(timeline) { // get timestamp value for each date
		var dateArrays = [];
		for (var i = 0; i < timeline.date.length; i++) {
			var singleDate = timeline.date[i].getAttribute('data-date'),
				dateComp = singleDate.split('T');
			if (dateComp.length > 1) { //both DD/MM/YEAR and time are provided
				var dayComp = dateComp[0].split('/'),
					timeComp = dateComp[1].split(':');
			} else if (dateComp[0].indexOf(':') >= 0) { //only time is provide
				var dayComp = ["2000", "0", "0"],
					timeComp = dateComp[0].split(':');
			} else { //only DD/MM/YEAR
				var dayComp = dateComp[0].split('/'),
					timeComp = ["0", "0"];
			}
			var newDate = new Date(dayComp[2], dayComp[1] - 1, dayComp[0], timeComp[0], timeComp[1]);
			dateArrays.push(newDate);
		}
		return dateArrays;
	};

	function calcMinLapse(timeline) { // determine the minimum distance among events
		var dateDistances = [];
		for (var i = 1; i < timeline.dateValues.length; i++) {
			var distance = daydiff(timeline.dateValues[i - 1], timeline.dateValues[i]);
			if (distance > 0) dateDistances.push(distance);
		}
		return (dateDistances.length > 0) ? Math.min.apply(null, dateDistances) : 86400000;
	};

	function daydiff(first, second) { // time distance between events
		return Math.round((second - first));
	};
	window.HorizontalTimeline = HorizontalTimeline;
	var horizontalTimeline = document.getElementsByClassName('js-cd-h-timeline'),
		horizontalTimelineTimelineArray = [];
	if (horizontalTimeline.length > 0) {
		for (var i = 0; i < horizontalTimeline.length; i++) {
			let horizontalTimelineObject = new HorizontalTimeline(horizontalTimeline[i])
			horizontalTimelineTimelineArray.push(horizontalTimelineObject);
		}
		// navigate the timeline when inside the viewport using the keyboard
		document.addEventListener('keydown', function(event) {
			if ((event.keyCode && event.keyCode == 39) || (event.key && event.key.toLowerCase() == 'arrowright')) {
				updateHorizontalTimeline('next'); // move to next event
			} else if ((event.keyCode && event.keyCode == 37) || (event.key && event.key.toLowerCase() == 'arrowleft')) {
				updateHorizontalTimeline('prev'); // move to prev event
			}
		});
	};

	function updateHorizontalTimeline(direction) {
		for (var i = 0; i < horizontalTimelineTimelineArray.length; i++) {
			if (elementInViewport(horizontalTimeline[i])) keyNavigateTimeline(horizontalTimelineTimelineArray[i], direction);
		}
	};
	/*
		How to tell if a DOM element is visible in the current viewport?
		http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
	*/
	function elementInViewport(el) {
		var top = el.offsetTop;
		var left = el.offsetLeft;
		var width = el.offsetWidth;
		var height = el.offsetHeight;
		while (el.offsetParent) {
			el = el.offsetParent;
			top += el.offsetTop;
			left += el.offsetLeft;
		}
		return (top < (window.pageYOffset + window.innerHeight) && left < (window.pageXOffset + window.innerWidth) && (top + height) > window.pageYOffset && (left + width) > window.pageXOffset);
	}
}());
// Popup
$('.popup_background').on('click', function() {
	$('.popup').hide()
})
var counter = 0
$('.cd-h-timeline__date').on('click', function() {
	if (counter == 1) {
		$("[data-date='01/01/1888']").removeClass('cd-h-timeline__date--selected')
	}
	if (counter == 5) {
		// select random prompt
		let prompts = ['...if all goes according to plan.', '... if everything goes awry.', '...if disaster strikes.', '... if we save ourselves.', '...if nothing changes.', '...if everything changes.', '...if our worst fears are realized.', '...if we create a better world.', '...if we destroy our world.']
		let picker = Math.floor((Math.random() * prompts.length) + 0);
		console.log(prompts[picker])
		$('#popup_prompt').text(prompts[picker])
		$('.popup').show()
		// Position the number picker
		let newTop = $('#picker-buttons').position().top - 20
		$('#picker-buttons').css({
			'top': newTop
		})
		let newLeft = $('#picker-buttons').position().left + 42
		$('#picker-buttons').css({
			'left': newLeft
		})
	}
	console.log('Counter', counter)
	// firstClick = true
	counter = counter + 1
})
$("#usrform").submit(function(e) {
	// alert('submit 1')
	e.preventDefault();
	let answer = $('#answer').val()
	if (answer == '' || answer == ' ' || answer == null) {
		alert('Please enter a description of the future')
	} else {
		// alert('submit')
		$('.popup').hide()
		$("usrform").submit();
	}
})

function postDataToFlask(date, direction) {
	console.log('DATA:', date, " ", direction)
	// console.log('Datedata Clicked')
	// // $.post("/dateClicked", {dateData:date})
	// $.get("/dateClicked", { "dateData" : String(date)} ).done( function(html) {
	//   console.log('Success: ' + html)
	// });
	$.get("/dateClicked", {
		"dateData": String(date),
		"direction": direction
	}).done(function(html) {
		// console.log('HTML', html)
		if (direction == "right") {
			$('#modal_right').html(html)
		} else {
			$('#modal_left').html(html)
		}
	});
}
//   let test = jQuery.data( $('.cd-h-timeline__date'), "01/01/1971" ).first 
//   console.log(test)
$("[data-date='01/01/1888']").trigger('click')
$("[data-date='01/01/1888']").addClass('cd-h-timeline__date--selected')
$("[data-date='01/01/1733']").removeClass('cd-h-timeline__date--selected')
//   postDataToFlask('1888')
// Strip animation
function stripAnimation(i) {
	if (i > 4) return;
	$('.strip_gradient').text('-||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
	setTimeout(function() {
		$('.strip_gradient').text('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
		setTimeout(function() {
			stripAnimation(i + 1);
		}, 50);
	}, 50)
}