document.addEventListener('mousemove', function(event){
  let card_x = getTransformValue(event.clientX,window.innerWidth,56);
  let card_y = getTransformValue(event.clientY,window.innerHeight,56);
  let shadow_x = getTransformValue(event.clientX,window.innerWidth,20);
  let shadow_y = getTransformValue(event.clientY,window.innerHeight,20);
  let text_shadow_x = getTransformValue(event.clientX,window.innerWidth,28);
  let text_shadow_y = getTransformValue(event.clientY,window.innerHeight,28);
  $(".floating").css("transform","rotateX("+card_y/1+"deg) rotateY("+card_x+"deg)");
  $(".floating").css("box-shadow",-card_x+"px "+card_y/1+"px 20px rgba(0, 0, 0, .3)");
  $(".svg").css("filter","drop-shadow("+-shadow_x+"px "+shadow_y/1+"px 4px rgba(0, 0, 0, .6))");
  $(".text").css("text-shadow",-text_shadow_x+"px "+text_shadow_y/1+"px 6px rgba(0, 0, 0, .8)");
});
function getTransformValue(v1,v2,value){
  return ((v1/v2*value-value/2)*1).toFixed(1);                        
}
$(function(){
  setTimeout(function(){
    $("body").removeClass("active");
  }, 2200);
});

// ------------------------------
// Conference travel table helpers
// ------------------------------

function markPastConferenceTravelRows() {
  const table = document.querySelector('.travel-table');
  if (!table) return;

  const monthIndex = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const now = new Date();
  const currentKey = now.getFullYear() * 12 + now.getMonth();

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((row) => {
    const dateCell = row.querySelector('td.travel-date');
    if (!dateCell) return;

    const text = (dateCell.textContent || '').trim();
    const match = text.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/);
    if (!match) return;

    const month = monthIndex[match[1]];
    const year = Number(match[2]);
    if (!Number.isFinite(year) || month == null) return;

    const rowKey = year * 12 + month;

    if (rowKey < currentKey) {
      row.classList.add('travel-past');
    }
  });
}

document.addEventListener('DOMContentLoaded', markPastConferenceTravelRows);


// async function loadProjects() {
//   const res = await fetch('projects.json');
//   const projects = await res.json();
//   const container = document.getElementById('projects-container');

//   projects.forEach(p => {
//     const links = [
//         p.pdf && `<a href="${p.pdf}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<i class="fa fa-file"></i>&nbsp;&nbsp;PDF&nbsp;&nbsp;&nbsp;</a>`,
//         p.arxiv && `<a href="${p.arxiv}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<img src="assets/images/arxiv-logo.svg" style="height: 1rem; filter: brightness(0%);">&nbsp;&nbsp;arXiv&nbsp;&nbsp;&nbsp;</a>`,
//         p.video && `<a href="${p.video}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<i class="fa fa-play" aria-hidden="true"></i>&nbsp;&nbsp;Video&nbsp;&nbsp;&nbsp;</a>`,
//         p.tweetorial && `<a href="${p.tweetorial}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<i class="fa fa-twitter" aria-hidden="true"></i>&nbsp;&nbsp;Tweetorial&nbsp;&nbsp;&nbsp;</a>`,
//         p.code && `<a href="${p.code}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<i class="fa fa-github" aria-hidden="true"></i>&nbsp;&nbsp;Code&nbsp;&nbsp;&nbsp;</a>`,
//         p.demo && `<a href="${p.demo}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<i class="fa fa-gamepad" aria-hidden="true" style="font-size:1.1rem"></i>&nbsp;&nbsp;Demo&nbsp;&nbsp;&nbsp;</a>`,
//         p.project && `<a href="${p.project}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<i class="fa fa-external-link" aria-hidden="true"></i>&nbsp;&nbsp;Project&nbsp;&nbsp;&nbsp;</a>`,
//         p.press && `<a href="${p.press}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<i class="fa fa-newspaper-o" aria-hidden="true"></i>&nbsp;&nbsp;Press&nbsp;&nbsp;&nbsp;</a>`,
//         p.bibtex && `<a href="${p.bibtex}" target="_blank" rel="noopener noreferrer">&nbsp;&nbsp;&nbsp;<i class="fa fa-quote-right"></i>&nbsp;&nbsp;BibTeX&nbsp;&nbsp;&nbsp;</a>`
//       ].filter(Boolean).join('&nbsp;&nbsp;&nbsp;&nbsp;');

//       const html = `
//       <div class="row">
//         <div class="col-12 col-md-2 align-self-center mb-4 mb-md-0">
//           ${p.image ? `
//             <img
//               src="${p.image}"
//               width="100%"
//               style="vertical-align: middle; cursor: pointer;"
//               onclick="openImageModal('${p.image}')"
//               class="clickable-image"
//               alt="${p.title || ''}" title="${p.title || ''}">
//             <br><br>` : ''}
//         </div>
    
//         <div class="col-12 col-md-10 align-self-center mb-4 mb-md-0">
//           <p class="mb-1" style="font-size: 1rem; font-weight: 500 !important;">
//             ${p.icon ? `<img src="${p.icon}" style="min-width:1rem; max-width:1.2rem; vertical-align: bottom; margin-bottom:0.15rem">` : ""}
//             &nbsp;${p.title || '[Untitled Project]'}
//           </p>
//           <p class="mb-1" style="font-size: .9rem; font-weight: 200 !important;">
//             <strong>${p.authors || ''}</strong>
//           </p>
//           <p class="mb-1" style="font-size: .9rem; padding-bottom: .1rem; font-weight: 200 !important;">
//             ${p.status ? `<span style="font-weight: 400;font-size:.9rem;background-color:rgba(255, 255, 255, 0.25);">${p.status}&nbsp;</span> //` : ''}
//             ${p.description || ''}
//           </p>
//           <p style="font-size: .9rem; padding-bottom: .2rem; font-weight: 300 !important;" class="nonselectable">
//             ${links}
//           </p>
//           <br>
//         </div>
//       </div>
//     `;

//     container.insertAdjacentHTML('beforeend', html);
//   });
// }

// loadProjects();



function openImageModal(src) {
  if (window.innerWidth <= 768) {
    // Do nothing on small screens
    return;
  }

  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");
  img.src = src;
  modal.classList.add("active");
}

function closeImageModal(event) {
  const modal = document.getElementById("imageModal");
  if (
    event.target.id === "imageModal" || 
    event.target.classList.contains("image-modal-close")
  ) {
    modal.classList.remove("active");
    document.getElementById("modalImage").src = "";
  }
}




// JavaScript for showing the "back to top" button and smooth scrolling
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) { // Show the button after scrolling 300px
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});

function scrollToTop() {
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
}

$(document).ready(function() {
  $("[rel='tooltip'], .tooltip").tooltip();
});


window.smartlook||(function(d) {
  var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
  var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
  c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
  })(document);
  smartlook('init', 'ad2ef059293128382c78093ca27675dd7fcaeb5a', { region: 'eu' });
  window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MESR77KXNS');

function renderUpdates(updates) {
  const container = document.getElementById("updates-container");
  if (!container) return;

  const details = document.createElement("details");
  details.setAttribute("open", true); // remove if you want it collapsed by default
  details.style.display = "inline-block";
  details.style.fontSize = "16px";

  const summary = document.createElement("summary");
  summary.innerHTML = `<span style="font-size: 14px; padding-left: 5px;">📌 See More</span>`;
  summary.style.marginTop = "5px";
  summary.style.marginBottom = "-10px";
  summary.style.fontSize = "16px";
  details.appendChild(summary);

  // Build the table
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "10px";

  updates.forEach(update => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.innerHTML = `<span style="font-size: .8rem; font-weight: 300;">${update.date}</span>`;
    dateCell.style.verticalAlign = "top";
    dateCell.style.padding = "6px 10px 6px 0";
    dateCell.style.whiteSpace = "nowrap";
    dateCell.style.width = "100px";

    const contentCell = document.createElement("td");
    contentCell.innerHTML = `<p style="font-size: 0.9rem; font-weight: 400; margin: 0;">${update.content}</p>`;
    contentCell.style.padding = "6px 0";

    row.appendChild(dateCell);
    row.appendChild(contentCell);
    table.appendChild(row);
  });

  details.appendChild(table);
  container.appendChild(details);
}

// News section is optional; only fetch if the container exists.
if (document.getElementById('updates-container')) {
  fetch('news.json')
  .then(res => res.json())
  .then(data => renderUpdates(data))
  .catch(err => {
    console.error("Failed to load news.json:", err);
    const container = document.getElementById("updates-container");
    if (container) {
      container.innerHTML = "<p style='color:red;'>Failed to load updates.</p>";
    }
  });
}

