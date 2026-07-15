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


// --- EXACT REPLICATION 3D TESTIMONIAL SLIDER MODULE ---

if (document.getElementById('testiTrack')) {
  var quotes = [
    { 
      t: "The energy and activities truly helped ease nerves and build a sense of community from day one. The next morning, you could tell they had found someone to connect to.", 
      w: "Megan Huston", 
      r: "Senior Coordinator for Orientation",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/UMSD.png",
      uniTextSpotlight: "University of Minnesota",
      uniTextSubtext: "School of Dentistry",
      color: "#b94487"
    },
    { 
      t: "The best part of welcome week was Playfair. It helped our students meet people they're still friends with.", 
      w: "Tayler Keitzer", 
      r: "Director of First-Year Experience",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/SC.png",
      uniTextSpotlight: "Simpson",
      uniTextSubtext: "College",
      color: "#7b4ca2"
    },
    { 
      t: "We brought Playfair back after COVID as the intentional social interaction our students needed. Years later, it's the best thing we do for them.", 
      w: "Jessica J. Gerum", 
      r: "Associate Director for Major Events & Programs",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/UCON.png",
      uniTextSpotlight: "University",
      uniTextSubtext: "of Connecticut",
      color: "#2b4689"
    },
    { 
      t: "Playfair was a wonderful foundation for our first-year students. They had a blast and were still talking about it that evening.", 
      w: "Allene Shapiro", 
      r: "Coordinator for Community Engagement",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/RC.png",
      uniTextSpotlight: "RAMAPO",
      uniTextSubtext: "College",
      color: "#cc3b4d"
    },
    { 
      t: "Everyone I talked to loved Playfair. It set the exact tone we needed for the start of the year. We can't wait to bring you back next year.", 
      w: "Julie Roberson", 
      r: "Assistant Dean for Student Engagement",
      avatar: "user icon/icon.png",
      logo: "Testimonials/univ logo/KU.jpg",
      uniTextSpotlight: "KING",
      uniTextSubtext: "University",
      color: "#dc7928"
    }
  ];

  var N = quotes.length;
  var qi = 0; 
  var containerEl = document.getElementById('testiCarouselContainer');
  var trackEl = document.getElementById('testiTrack');
  var dotsEl = document.getElementById('tqDots');
  
  var startX = 0;
  var moveX = 0;
  var isDragging = false;

  function initCarousel() {
    trackEl.innerHTML = '';
    
    quotes.forEach(function (q) {
      var card = document.createElement('div');
      card.className = 'testi-card-item';
      
      card.innerHTML = `
      <div class="top-quote-mark" style="color: ${q.color};">
        <svg viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M48.2 40.5C48.2 16.2 34.6 0 10.5 0C28.4 18.3 30.2 29.8 10.5 29.8C1.2 29.8 0 40.5 0 54.3C0 65.8 9 72 20.3 72C35.7 72 48.2 58.7 48.2 40.5Z" fill="currentColor"/>
          <path d="M107.2 40.5C107.2 16.2 93.6 0 69.5 0C87.4 18.3 89.2 29.8 69.5 29.8C60.2 29.8 59 40.5 59 54.3C59 65.8 68 72 79.3 72C94.7 72 107.2 58.7 107.2 40.5Z" fill="currentColor"/>
        </svg>
      </div>
      
      <div class="testi-card-shape">
        <div class="testi-header-row">
          <div class="avatar-double-ring">
            <div class="avatar-inner-ring" style="border-color: ${q.color};">
              <img src="${q.avatar}" alt="${q.w}" class="avatar-img">
            </div>
          </div>
          <div class="client-meta">
            <span class="client-name">${q.w}</span>
            <span class="client-designation">${q.r}</span>
            <div class="client-underline" style="background-color: ${q.color};"></div>
          </div>
        </div>
        
        <p class="q">${q.t}</p>
        
        <div class="uni-ribbon">
          <div class="uni-logo-ring">
            <img src="${q.logo}" alt="${q.uniTextSpotlight} Logo" class="logo-ring-img">
          </div>
          <div class="uni-text-block"> 
            <span class="uni-text-spotlight">${q.uniTextSpotlight}</span>
            <span class="uni-text-subtext">${q.uniTextSubtext}</span>
          </div>
        </div>
      </div>
      `;
      
      var ribbonEl = card.querySelector('.uni-ribbon');
      if (ribbonEl) {
        ribbonEl.style.background = q.color;
        
        var toggleRibbon = function(e) {
          e.stopPropagation(); 
          e.preventDefault();  
          
          if (ribbonEl.classList.contains('expanded')) {
            ribbonEl.classList.remove('expanded');
          } else {
            document.querySelectorAll('.uni-ribbon').forEach(function(r) {
              r.classList.remove('expanded');
            });
            ribbonEl.classList.add('expanded');
          }
        };

        ribbonEl.addEventListener('touchend', toggleRibbon, { passive: false });
        ribbonEl.addEventListener('click', function(e) {
          if (e.pointerType === 'touch') return; 
          toggleRibbon(e);
        });
      }
      
      trackEl.appendChild(card);
    });
    
    qi = 0; 
    renderDots();
    setupArrowButtons();
    setupDragInteractions();

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            setTimeout(function() { updateCarouselPosition(); }, 100);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(containerEl);
    } else {
      setTimeout(updateCarouselPosition, 250);
    }
  }

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    quotes.forEach(function (_, i) {
      var b = document.createElement('button');
      b.className = 'dot' + (i === qi ? ' active' : '');
      b.setAttribute('aria-label', 'Quote ' + (i + 1));
      b.onclick = function () {
        qi = i;
        updateCarouselPosition();
        updateActiveDot();
      };
      dotsEl.appendChild(b);
    });
  }

  function updateActiveDot() {
    if (!dotsEl) return;
    var dots = dotsEl.querySelectorAll('.dot');
    dots.forEach(function(dot, idx) {
      dot.classList.toggle('active', idx === qi);
    });
  }

  function setupArrowButtons() {
    var prevBtn = document.getElementById('testiPrevBtn');
    var nextBtn = document.getElementById('testiNextBtn');
    if (prevBtn) prevBtn.onclick = function(e) { e.stopPropagation(); navigateCarousel(-1); };
    if (nextBtn) nextBtn.onclick = function(e) { e.stopPropagation(); navigateCarousel(1); };
  }

  function navigateCarousel(direction) {
    qi = (qi + direction + N) % N; 
    updateCarouselPosition();
    updateActiveDot();
  }

  /* ==========================================================================
     CINEMATIC LAYER SMOOTHING ENGINE: Wagtangon ang overlay flickering
     ========================================================================== */
  function updateCarouselPosition() {
    var cards = document.querySelectorAll('.testi-card-item');
    if (!cards.length) return;

    var isMobile = window.innerWidth <= 768;
    var xOffset = isMobile ? 38 : 185; 
    var zOffset = -180; 
    var scaleFactor = 0.85;

    cards.forEach(function(card, idx) {
      var diff = idx - qi;
      
      if (diff < -N / 2) diff += N;
      if (diff > N / 2) diff -= N;

      // 1. ACTIVE CENTER CARD (Primary View Layer)
      if (diff === 0) {
        card.style.transform = 'translate3d(0, 0, 0) scale(1)';
        card.style.opacity = '1';
        card.style.zIndex = '30';
        card.style.pointerEvents = 'auto';
        card.classList.add('active');
      } 
      // 2. NEXT CARD (Right Layer Behind)
      else if (diff === 1) {
        card.style.transform = `translate3d(${xOffset}px, 0, ${zOffset}px) scale(${scaleFactor})`;
        card.style.opacity = '0.45';
        card.style.zIndex = '10'; 
        card.style.pointerEvents = 'none';
        card.classList.remove('active');
      } 
      // 3. PREV CARD (Left Layer Behind)
      else if (diff === -1) {
        card.style.transform = `translate3d(${-xOffset}px, 0, ${zOffset}px) scale(${scaleFactor})`;
        card.style.opacity = '0.45';
        card.style.zIndex = '10'; 
        card.style.pointerEvents = 'none';
        card.classList.remove('active');
      } 
      // 4. TOTALLY INACTIVE OUT-OF-BOUND CARDS
      else {
        card.style.transform = `translate3d(0, 0, ${zOffset * 1.5}px) scale(${scaleFactor * scaleFactor})`;
        card.style.opacity = '0';
        card.style.zIndex = '1';
        card.style.pointerEvents = 'none';
        card.classList.remove('active');
      }
    });
  }

  function setupDragInteractions() {
    containerEl.addEventListener('touchstart', dragStart, { passive: true });
    containerEl.addEventListener('touchmove', dragMove, { passive: true });
    containerEl.addEventListener('touchend', dragEnd);

    containerEl.addEventListener('mousedown', dragStart);
    containerEl.addEventListener('mousemove', dragMove);
    containerEl.addEventListener('mouseup', dragEnd);
    containerEl.addEventListener('mouseleave', dragEnd);
  }

  function dragStart(e) {
    if (e.target.closest('.testi-arrow') || e.target.closest('.uni-ribbon')) return;
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  function dragMove(e) {
    if (!isDragging) return;
    var currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    moveX = currentX - startX;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (moveX < -50) navigateCarousel(1);
    if (moveX > 50) navigateCarousel(-1);
    moveX = 0;
  }

  window.addEventListener('resize', updateCarouselPosition);
  initCarousel();
}

// GLOBAL OUTSIDE TOUCH/CLICK CLOSE
var closeAllRibbons = function() {
  document.querySelectorAll('.uni-ribbon.expanded').forEach(function (ribbon) {
    ribbon.classList.remove('expanded');
  });
};
document.addEventListener('click', closeAllRibbons);
document.addEventListener('touchend', function(e) {
  if (e.target.closest('.uni-ribbon')) return; 
  closeAllRibbons();
});