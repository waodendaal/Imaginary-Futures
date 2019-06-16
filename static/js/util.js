function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
 	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.setAttribute("style", "height:"+val+"px;");
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.setAttribute("style", "height:"+start+"px;");
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb) {
  var start = window.scrollY || document.documentElement.scrollTop,
      currentTime = null;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    window.scrollTo(0, val);
    if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

//Rivets on Timeline

$(document).ready(function() {
  //Get coordinates
  let timelineDots = $('.cd-h-timeline__date');
  for (let i = 0; i < timelineDots.length; i ++){
    let dot = timelineDots[i]
    let rect = dot.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);

    //Get position
    let position = Math.floor( Math.random() * 4 )
    if (position == 0)
    {
      //Bracket right
      // let bracket = '<div class="bracket_right"><img src="/static/imgs/bracket_right.svg"><p>12/20/20</p></div>'

      let newDomL1 = '<div class="timeline_rivets" style="opacity: 0.25;; width: 25px; height: 20px; left: 6; border-right: 30px solid transparent; border-bottom: 20px solid black;"></div>'
      let newDomL2 = '<div class="timeline_rivets" style="opacity: 0.50; width: 25px; height: 20px; left: 39px;"></div>'
      let newDomL3 = '<div class="timeline_rivets" style="opacity: 0.75; width: 25px; height: 20px; left: 68px;"></div>' + '<div class="timeline_rivets" style="opacity: 0.75; top:20px; width: 20px; height: 10px; left: 68px; border-right: 25px solid transparent; border-bottom: 10px solid black;"></div>'
      let newDomCenter = '<div class="timeline_rivets" style="width: 25px; height: 30px; left: 97px;"></div>';
      let newDomR1 = '<div class="timeline_rivets" style="right: 12; opacity: 0.25;; width: 25px; height: 20px; border-left: 25px solid transparent; border-bottom: 20px solid black;"></div>'
      let newDomR2 = '<div class="timeline_rivets" style="opacity: 0.50; width: 30px; height: 20px; right: 40px;"></div>'
      let newDomR3 = '<div class="timeline_rivets" style="opacity: 0.75; width: 25px; height: 20px; right: 74px;"></div>' + '<div class="timeline_rivets" style="opacity: 0.75; top:20px; width: 25px; height: 10px; right: 74px; border-left: 25px solid transparent; border-bottom: 10px solid black;"></div>'
      let shell = '<div style="bottom:8px; width: 225px; height: 40px;position: absolute; transform: scaleY(-1)">' + newDomL1 + newDomL2 + newDomL3 + newDomCenter + newDomR1 + newDomR2 + newDomR3 + '</div>';
      $(shell).appendTo(dot);  
      // $(bracket).appendTo(dot);  

    } 
    if (position == 2)
        {

        //Bracket left
        // let bracket = '<div class="bracket_left"><p>12/20/20</p><img src="/static/imgs/bracket_left.svg"></div>'

        let newDomL1 = '<div class="timeline_rivets rivets_bottom" style="opacity: 0.25;; width: 25px; height: 20px; left: 6; border-right: 30px solid transparent; border-bottom: 20px solid black;"></div>'
        let newDomL2 = '<div class="timeline_rivets rivets_bottom" style="opacity: 0.50; width: 25px; height: 20px; left: 39px;"></div>'
        let newDomL3 = '<div class="timeline_rivets rivets_bottom" style="opacity: 0.75; width: 25px; height: 20px; left: 68px;"></div>' + '<div class="timeline_rivets rivets_bottom" style="opacity: 0.75; top:20px; width: 20px; height: 10px; left: 68px; border-right: 25px solid transparent; border-bottom: 10px solid black;"></div>'
        let newDomCenter = '<div class="timeline_rivets rivets_bottom" style="width: 25px; height: 30px; left: 97px;"></div>';
        let newDomR1 = '<div class="timeline_rivets rivets_bottom" style="right: 12; opacity: 0.25;; width: 25px; height: 20px; border-left: 25px solid transparent; border-bottom: 20px solid black;"></div>'
        let newDomR2 = '<div class="timeline_rivets rivets_bottom" style="opacity: 0.50; width: 30px; height: 20px; right: 40px;"></div>'
        let newDomR3 = '<div class="timeline_rivets rivets_bottom" style="opacity: 0.75; width: 25px; height: 20px; right: 74px;"></div>' + '<div class="timeline_rivets rivets_bottom" style="opacity: 0.75; top:20px; width: 25px; height: 10px; right: 74px; border-left: 25px solid transparent; border-bottom: 10px solid black;"></div>'
        let shell = '<div style="top:15px; width: 225px; height: 40px;position: absolute;">' + newDomL1 + newDomL2 + newDomL3 + newDomCenter + newDomR1 + newDomR2 + newDomR3 + '</div>';
        $(shell).appendTo(dot);  
        // $(bracket).appendTo(dot);  

    } 
  }

});