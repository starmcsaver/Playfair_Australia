function toggleNav(btn){var l=document.getElementById('navlinks');var o=l.classList.toggle('open');btn.setAttribute('aria-expanded',o);}
(function(){var l=document.getElementById('navlinks');if(l)l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open');});});})();
var gw=document.getElementById('greetWord');
if(gw){var greetings=["Kia ora","G'day","Hello","Talofa","Bula","Namaste"],gi=0;setInterval(function(){gi=(gi+1)%greetings.length;gw.textContent=greetings[gi];},2400);}

function playVideo(el,id){
  el.innerHTML='<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1" title="Playfair video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}

if(document.getElementById('cal')){
  var calDate=new Date();calDate.setDate(1);var today=new Date();today.setHours(0,0,0,0);
  var selDay=null,selTime=null;
  var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DOW=["S","M","T","W","T","F","S"],TIMES=["9:00am","10:30am","1:00pm","2:30pm","4:00pm"];
  function fmt(d){return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]+" "+d.getDate()+" "+MONTHS[d.getMonth()].slice(0,3)+" "+d.getFullYear();}
  function renderCal(){
    var y=calDate.getFullYear(),m=calDate.getMonth();
    document.getElementById('calTitle').textContent=MONTHS[m]+" "+y;
    var grid=document.getElementById('calGrid');grid.innerHTML='';
    DOW.forEach(function(d){var c=document.createElement('div');c.className='cal-dow';c.textContent=d;grid.appendChild(c);});
    var first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
    for(var i=0;i<first;i++){var e=document.createElement('div');e.className='cal-day empty';grid.appendChild(e);}
    for(var d=1;d<=days;d++){
      var cell=document.createElement('button');cell.className='cal-day';cell.textContent=d;
      var dd=new Date(y,m,d),dow=dd.getDay(),past=dd<today,weekend=(dow===0||dow===6);
      if(past||weekend){cell.disabled=true;}else{(function(dd){cell.onclick=function(){selDay=dd;selTime=null;renderCal();renderTimes();updateConfirm();};})(dd);}
      if(selDay&&dd.getTime()===selDay.getTime())cell.classList.add('sel');
      grid.appendChild(cell);
    }
  }
function renderTimes(){
    var wrap=document.getElementById('calTimes');wrap.innerHTML='';if(!selDay)return;
    TIMES.forEach(function(t){
      var b=document.createElement('button');
      b.className='cal-time'+(selTime===t?' sel':'');
      b.textContent=t;
      b.onclick=function(){
        selTime=t;
        renderTimes();
        updateConfirm();
        
        var calendlyLink = "https://calendly.com/laine-playfair"; 
        
        window.open(calendlyLink, '_blank');
      };
      wrap.appendChild(b);
    });
  }
  function updateConfirm(){var c=document.getElementById('calConfirm');if(selDay&&selTime){c.innerHTML="You\u2019re booking <b>"+fmt(selDay)+"</b> at <b>"+selTime+"</b>. We\u2019ll email to confirm.";}else if(selDay){c.textContent="Now pick a time on "+fmt(selDay)+".";}else{c.textContent="Pick a date to see available times.";}}
  window.calMove=function(n){calDate.setMonth(calDate.getMonth()+n);renderCal();};
  renderCal();
}
function submitEnquiry(){var m=document.getElementById('formMsg');if(m)m.style.display='block';}
function openModal(){document.getElementById('modalBg').classList.add('open');}
function closeModal(){document.getElementById('modalBg').classList.remove('open');}
(function(){var mb=document.getElementById('modalBg');if(mb){mb.addEventListener('click',function(e){if(e.target===this)closeModal();});document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});}})();

// --- NEW BOOKING DETAILS MODAL LOGIC ---
function openBookingModal(dateString, timeString) {
  document.getElementById('hiddenDate').value = dateString;
  document.getElementById('hiddenTime').value = timeString;
  document.getElementById('selectedDateTimeText').innerText = dateString + " at " + timeString;
  var bm = document.getElementById('bookingModalBg');
  if (bm) bm.classList.add('open');
}

function closeBookingModal() {
  var bm = document.getElementById('bookingModalBg');
  if (bm) bm.classList.remove('open');
  document.getElementById('bookingDetailsForm').reset();
  document.getElementById('bookingFormMsg').innerText = '';
}

// Global dismiss setup for the booking modal overlay background
(function(){
  var bm = document.getElementById('bookingModalBg');
  if (bm) {
    bm.addEventListener('click', function(e) { if(e.target === this) closeBookingModal(); });
    document.addEventListener('keydown', function(e) { if(e.key === 'Escape') closeBookingModal(); });
  }
})();

// Handle form dispatch to Google Apps Script
document.getElementById('bookingDetailsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const btn = document.getElementById('scheduleBtn');
  const msg = document.getElementById('bookingFormMsg');
  const originalBtnText = btn.innerText;
  
  btn.innerText = 'Scheduling...';
  btn.disabled = true;
  
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzM5_vXVR4KFGTOrKFWxQXUMuCVlC9XQmEKeOLNDFVv8qaPFuDvH6NXZLl32M-Fz0Z0/exec'; 
  
  fetch(scriptURL, { method: 'POST', body: new FormData(this) })
    .then(response => {
      btn.innerText = originalBtnText;
      btn.disabled = false;
      msg.style.color = 'green';
      msg.innerText = 'Event Scheduled Successfully!';
      
      // Clear calendar selection states after submission
      selDay = null;
      selTime = null;
      if(typeof renderCal === 'function') { renderCal(); renderTimes(); updateConfirm(); }
      
      setTimeout(function() {
        closeBookingModal();
      }, 2000);
    })
    .catch(error => {
      console.error('Error!', error.message);
      btn.innerText = originalBtnText;
      btn.disabled = false;
      msg.style.color = 'red';
      msg.innerText = 'Something went wrong. Please try again.';
    });
});
// ----------------------------------------

var ROUTES=["home","story","on-campus","online","corporate","gallery","testimonials","contact"];
function showPage(id){
  if(ROUTES.indexOf(id)<0)id="home";
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  var pg=document.getElementById('page-'+id); if(pg)pg.classList.add('active');
  document.querySelectorAll('nav a[data-page]').forEach(function(a){a.classList.toggle('active',a.getAttribute('data-page')===id);});
  if(pg){var rev=pg.querySelectorAll('.reveal');rev.forEach(function(e){e.classList.remove('in');});requestAnimationFrame(function(){requestAnimationFrame(function(){rev.forEach(function(e){e.classList.add('in');});});});}
  var nl=document.getElementById('navlinks');if(nl)nl.classList.remove('open');
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',function(){showPage((location.hash||'').replace('#','')||'home');});
showPage((location.hash||'').replace('#','')||'home');

document.getElementById('enquiryForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('formMsg');
    btn.innerText = 'Sending...';
    
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzM5_vXVR4KFGTOrKFWxQXUMuCVlC9XQmEKeOLNDFVv8qaPFuDvH6NXZLl32M-Fz0Z0/exec'; 
    
    fetch(scriptURL, { method: 'POST', body: new FormData(this)})
      .then(response => {
        btn.innerText = 'Send enquiry ❯';
        msg.style.display = 'block'; 
        document.getElementById('enquiryForm').reset(); 
      })
      .catch(error => {
        console.error('Error!', error.message);
        btn.innerText = 'Send enquiry ❯';
        alert('Oops, something went wrong. Please try again.');
      });
  });

  document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".logos-slide") || document.querySelector(".marquee-track");
  const marquee = document.querySelector(".logos") || document.querySelector(".marquee");
  
  if (!track) return;

  const clone = track.innerHTML;
  track.innerHTML += clone; 

  let currentX = 0;
  let speed = -1; 
  let isDragging = false;
  let startX = 0;
  let dragX = 0;

  function animateMarquee() {
    if (!isDragging) {
      currentX += speed;
      
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(currentX) >= halfWidth) {
        currentX = 0;
      }
      
      track.style.transform = `translateX(${currentX}px)`;
    }
    requestAnimationFrame(animateMarquee);
  }

  requestAnimationFrame(animateMarquee);

  track.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    dragX = currentX; 
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    
    const diffX = e.touches[0].clientX - startX;
    currentX = dragX + diffX; 
    
    const halfWidth = track.scrollWidth / 2;
    if (currentX > 0) {
      currentX = -halfWidth;
    } else if (Math.abs(currentX) >= halfWidth) {
      currentX = 0;
    }

    track.style.transform = `translateX(${currentX}px)`;
  }, { passive: true });

  track.addEventListener("touchend", () => {
    isDragging = false;
  });
});


// --- TESTIMONIALS CAROUSEL ---

if (document.getElementById('testiTrack')) {
  // 1. Gi-update ang array aron masudlan sa gikinahanglan nga image ug university text structures
  var quotes = [
    { 
      t: "The energy and activities truly helped ease nerves and build a sense of community from day one. The next morning, you could tell they had found someone to connect to.", 
      w: "Megan Huston", 
      r: "Senior Coordinator for Orientation",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/UMSD.png",
      uniSpotlight: "University",
      uniSubtext: "of Minnesota School of Dentistry"
    },
    { 
      t: "The best part of welcome week was Playfair. It helped our students meet people they're still friends with.", 
      w: "Tayler Keitzer", 
      r: "Director of First-Year Experience",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/SC.png",
      uniSpotlight: "Simpson",
      uniSubtext: "College"
    },
    { 
      t: "We brought Playfair back after COVID as the intentional social interaction our students needed. Years later, it's the best thing we do for them.", 
      w: "Jessica J. Gerum", 
      r: "Associate Director for Major Events & Programs",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/UCON.png",
      uniSpotlight: "University",
      uniSubtext: "of Connecticut"
    },
    { 
      t: "Playfair was a wonderful foundation for our first-year students. They had a blast and were still talking about it that evening.", 
      w: "Allene Shapiro", 
      r: "Coordinator for Community Engagement",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/RC.png",
      uniSpotlight: "Ramapo",
      uniSubtext: "College"
    },
    { 
      t: "Everyone I talked to loved Playfair. It set the exact tone we needed for the start of the year. We can't wait to bring you back next year.", 
      w: "Julie Roberson", 
      r: "Assistant Dean for Student Engagement",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/KU.jpg",
      uniSpotlight: "King",
      uniSubtext: "University"
    }
  ];

  var N = quotes.length;
  var qi = 3; 
  var containerEl = document.getElementById('testiCarouselContainer');
  var trackEl = document.getElementById('testiTrack');
  var dotsEl = document.getElementById('tqDots');
  
  var isDragging = false;
  var startX = 0;
  var currentTranslate = 0;
  var prevTranslate = 0;
  var animationID = 0;
  var startY = 0;
  var isScrollingVertical = false;

  function initCarousel() {
    trackEl.innerHTML = '';
    
    var extendedQuotes = [];
    
    // Ang cloning functionality para sa infinite layout
    extendedQuotes.push(quotes[N - 3]);
    extendedQuotes.push(quotes[N - 2]);
    extendedQuotes.push(quotes[N - 1]);
    
    quotes.forEach(function(q) { extendedQuotes.push(q); });
    
    extendedQuotes.push(quotes[0]);
    extendedQuotes.push(quotes[1]);
    extendedQuotes.push(quotes[2]);

    // 2. Gi-update ang HTML structure dinhi aron ma-visible ang tanan nimong gipangayo nga classes
    extendedQuotes.forEach(function (q) {
      var card = document.createElement('div');
      card.className = 'testi-card-item';
      card.innerHTML = `
        <div class="testi-profile-header">
          <div class="profile-top-row">
            <div class="user-container">
              <img src="${q.avatar}" alt="${q.w}" class="user-avatar-img">
            </div>
            <div class="user-details">
              <span class="user-name">${q.w}</span>
              <span class="title">${q.r}</span>
            </div>
          </div>
          <div class="logo-wrapper">
            <img src="${q.logo}" alt="${q.uniSubtext} Logo" class="logo-img">
            <div class="uni-text-block">
              <span class="uni-spotlight">${q.uniSpotlight}</span>
              <span class="uni-subtext">${q.uniSubtext}</span>
            </div>
          </div>
        </div>
        <div class="bigmark">“</div>
        <p class="q">${q.t}</p>
      `;
      trackEl.appendChild(card);
    });
    
    qi = 3; 
    
    renderDots();
    trackEl.style.transition = 'none';
    updateCarouselPosition(); 
    setupArrowButtons();
  }

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    quotes.forEach(function (_, i) {
      var b = document.createElement('button');
      b.className = 'dot' + ((i + 3) === qi ? ' active' : '');
      b.setAttribute('aria-label', 'Quote ' + (i + 1));
      b.onclick = function () {
        qi = i + 3;
        trackEl.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        updateCarouselPosition();
        updateActiveDot();
      };
      dotsEl.appendChild(b);
    });
  }

  function updateActiveDot() {
    if (!dotsEl) return;
    var dots = dotsEl.querySelectorAll('.dot');
    var realIndex = (qi - 3 + N) % N;

    dots.forEach(function(dot, idx) {
      dot.classList.toggle('active', idx === realIndex);
    });
  }

  function setupArrowButtons() {
    var prevBtn = document.getElementById('testiPrevBtn');
    var nextBtn = document.getElementById('testiNextBtn');

    if (prevBtn) {
      prevBtn.onclick = function(e) {
        e.stopPropagation(); 
        navigateCarousel(-1);
      };
    }

    if (nextBtn) {
      nextBtn.onclick = function(e) {
        e.stopPropagation();
        navigateCarousel(1);
      };
    }
  }

  function navigateCarousel(direction) {
    qi += direction;
    trackEl.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    updateCarouselPosition();
    updateActiveDot();
  }

  function updateCarouselPosition() {
    var cards = document.querySelectorAll('.testi-card-item');
    if (!cards.length) return;

    cards.forEach(function(card, idx) {
      card.classList.toggle('active', idx === qi);
    });

    var containerWidth = containerEl.offsetWidth;
    var activeCard = cards[qi];
    if (!activeCard) return;
    
    var cardWidth = activeCard.offsetWidth;
    var cardLeft = activeCard.offsetLeft;

    currentTranslate = (containerWidth / 2) - (cardLeft + (cardWidth / 2));
    prevTranslate = currentTranslate;

    trackEl.style.transform = 'translateX(' + currentTranslate + 'px)';
  }

  trackEl.addEventListener('transitionend', function() {
    var cards = document.querySelectorAll('.testi-card-item');
    
    if (qi >= cards.length - 3) {
      trackEl.style.transition = 'none';
      qi = qi - N; 
      void trackEl.offsetWidth; 
      updateCarouselPosition();
    } 
    
    else if (qi <= 2) {
      trackEl.style.transition = 'none';
      qi = qi + N; 
      void trackEl.offsetWidth; 
      updateCarouselPosition();
    }
  });

  // --- MOUSE & TOUCH DRAG INTERACTION ---
  containerEl.addEventListener('touchstart', dragStart, { passive: false });
  containerEl.addEventListener('touchend', dragEnd);
  containerEl.addEventListener('touchmove', dragMove, { passive: false });

  containerEl.addEventListener('mousedown', dragStart);
  containerEl.addEventListener('mouseup', dragEnd);
  containerEl.addEventListener('mouseleave', dragEnd);
  containerEl.addEventListener('mousemove', dragMove);

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function getPositionY(event) {
    return event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
  }

  function dragStart(event) {
    if (event.target.closest('.testi-arrow')) return; 
    isDragging = true;
    isScrollingVertical = false;
    startX = getPositionX(event);
    startY = getPositionY(event);
    trackEl.style.transition = 'none'; 
    animationID = requestAnimationFrame(animation);
  }

  function dragMove(event) {
    if (!isDragging) return;
    
    var currentX = getPositionX(event);
    var currentY = getPositionY(event);
    var diffX = currentX - startX;
    var diffY = currentY - startY;

    if (!isScrollingVertical && Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
      isScrollingVertical = true;
      isDragging = false;
      cancelAnimationFrame(animationID);
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }
    
    currentTranslate = prevTranslate + diffX;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    var movedBy = currentTranslate - prevTranslate;

    trackEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';

    if (movedBy < -40) {
      qi++;
    } else if (movedBy > 40) {
      qi--;
    }
    
    updateCarouselPosition();
    updateActiveDot();
  }

  function animation() {
    if (isDragging) {
      trackEl.style.transform = 'translateX(' + currentTranslate + 'px)';
      requestAnimationFrame(animation);
    }
  }

  window.addEventListener('resize', function() {
    trackEl.style.transition = 'none';
    updateCarouselPosition();
  });
  
  initCarousel();
}