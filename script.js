function toggleNav(btn){var l=document.getElementById('navlinks');var o=l.classList.toggle('open');btn.setAttribute('aria-expanded',o);}
(function(){var l=document.getElementById('navlinks');if(l)l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open');});});})();
var gw=document.getElementById('greetWord');
if(gw){var greetings=["Kia ora","G'day","Hello","Talofa","Bula","Namaste"],gi=0;setInterval(function(){gi=(gi+1)%greetings.length;gw.textContent=greetings[gi];},2400);}

function playVideo(el,id){
  el.innerHTML='<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1" title="Playfair video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
}
if(document.getElementById('tqText')){
  var quotes=[{t:"The energy and activities truly helped ease nerves and build a sense of community from day one. The next morning, you could tell they had found someone to connect to.",w:"Megan Huston",r:"Senior Coordinator for Orientation \u00b7 CSU San Bernardino"},{t:"The best part of welcome week was Playfair. It helped our students meet people they're still friends with.",w:"Tayler Keitzer",r:"Director of First-Year Experience \u00b7 Simpson College"},{t:"We brought Playfair back after COVID as the intentional social interaction our students needed. Years later, it's the best thing we do for them.",w:"Jessica J. Gerum",r:"Associate Director, Major Events \u00b7 University of Connecticut"},{t:"Playfair was a wonderful foundation for our first-year students. They had a blast and were still talking about it that evening.",w:"Allene Shapiro",r:"Coordinator for Community Engagement \u00b7 Ramapo College"},{t:"Everyone I talked to loved Playfair. It set the exact tone we needed for the start of the year. We can't wait to bring you back next year.",w:"Julie Roberson",r:"Assistant Dean for Student Engagement \u00b7 King University"}];
  var qi=0,dotsEl=document.getElementById('tqDots');
  function renderDots(){dotsEl.innerHTML='';quotes.forEach(function(_,i){var b=document.createElement('button');b.className='dot'+(i===qi?' active':'');b.setAttribute('aria-label','Quote '+(i+1));b.onclick=function(){qi=i;showQuote();};dotsEl.appendChild(b);});}
  function showQuote(){var q=quotes[qi];document.getElementById('tqText').innerHTML=q.t;document.getElementById('tqWho').textContent=q.w;document.getElementById('tqRole').textContent=q.r;renderDots();}
  showQuote();setInterval(function(){qi=(qi+1)%quotes.length;showQuote();},6000);
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