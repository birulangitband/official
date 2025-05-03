// Toggle class menu
$(function () {
    $('.menu').on('click', function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('.ss-menu1').addClass('visible1');
            $('.ss-menu2').addClass('visible2');
            $('.ss-menu3').addClass('visible3');
            $('.ss-menu4').addClass('visible4');
            $('.ss-menu5').addClass('visible5');
            $('.ss-menu6').addClass('visible6');
        } else {
            $('.ss-menu1').removeClass('visible1');
            $('.ss-menu2').removeClass('visible2');
            $('.ss-menu3').removeClass('visible3');
            $('.ss-menu4').removeClass('visible4');
            $('.ss-menu5').removeClass('visible5');
            $('.ss-menu6').removeClass('visible6');
        }
    })
})
$(function () {
    $('.ss-menu').on('click', function () {
      $('.menu').removeClass('active');
      $('.ss-menu1').removeClass('visible1');
      $('.ss-menu2').removeClass('visible2');
      $('.ss-menu3').removeClass('visible3');
      $('.ss-menu4').removeClass('visible4');
      $('.ss-menu5').removeClass('visible5');
      $('.ss-menu6').removeClass('visible6');
    })
})
$(function () {
    $(window).on('scroll', function () {
        if ($('.menu').hasClass('active')) {
          $('.menu').removeClass('active');
          $('.ss-menu1').removeClass('visible1');
          $('.ss-menu2').removeClass('visible2');
          $('.ss-menu3').removeClass('visible3');
          $('.ss-menu4').removeClass('visible4');
          $('.ss-menu5').removeClass('visible5');
          $('.ss-menu6').removeClass('visible6');
        }
    })
})

document.addEventListener('DOMContentLoaded', function() {
  const shareContainer = document.getElementById('shareContainer');
  const shareBtn = document.getElementById('shareBtn');
  
  // Toggle social icons on button click
  shareBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      shareContainer.classList.toggle('active');
  });
  
  // Close social icons when clicking anywhere else
  document.addEventListener('click', function() {
      shareContainer.classList.remove('active');
  });
  
  // Close social icons when scrolling
  window.addEventListener('scroll', function() {
      shareContainer.classList.remove('active');
  });
  
  // Prevent closing when clicking on social icons
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
      icon.addEventListener('click', function(e) {
          e.stopPropagation();
      });
  });
});

function getUpcomingEvent() {
  const calendarId = "birulangitband.official@gmail.com"; // Ganti dengan ID kalender Anda
  const now = new Date();
  const events = CalendarApp.getEvents(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)); // Cari event 30 hari ke depan
  if (events.length > 0) {
    const nextEvent = events[0];
    return {
      title: nextEvent.getTitle(),
      date: nextEvent.getStartTime().toLocaleString(),
      location: nextEvent.getLocation(),
      description: nextEvent.getDescription()
    };
  } else {
    return { error: "Tidak ada event yang akan datang" };
  }
}

// Untuk diakses via URL
function doGet() {
  const event = getUpcomingEvent();
  return ContentService.createTextOutput(JSON.stringify(event))
    .setMimeType(ContentService.MimeType.JSON);
}

// Tambah Kalender ke halaman HTML
document.addEventListener('DOMContentLoaded', function() {
  const API_KEY = 'AIzaSyCFzpAZ61Q6QON5bqhnQSRGeKfDqgiwJvQ';
  const CALENDAR_ID = 'birulangitband.official@gmail.com';
  const CALENDAR_URL = 'https://calendar.google.com/calendar/u/0/r?cid=birulangitband.official@gmail.com';

  fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${new Date().toISOString()}&maxResults=1&orderBy=startTime&singleEvents=true`)
      .then(response => response.json())
      .then(data => {
          const event = data.items[0];
          const eventElement = document.getElementById('next-event');
          
          if (event) {
              // Format date in Indonesian
              const monthNames = [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
              ];
              
              const dayNames = [
                  'Minggu', 'Senin', 'Selasa', 'Rabu', 
                  'Kamis', 'Jumat', 'Sabtu'
              ];

              let eventDate, eventTime;
              if (event.start.dateTime) {
                  const dateObj = new Date(event.start.dateTime);
                  const dayName = dayNames[dateObj.getDay()];
                  const date = dateObj.getDate();
                  const month = monthNames[dateObj.getMonth()];
                  const year = dateObj.getFullYear();
                  const hours = dateObj.getHours().toString().padStart(2, '0');
                  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                  
                  eventDate = `${dayName}, ${date} ${month} ${year}`;
                  eventTime = `${hours}:${minutes}`;
              } else {
                  const dateObj = new Date(event.start.date);
                  const dayName = dayNames[dateObj.getDay()];
                  const date = dateObj.getDate();
                  const month = monthNames[dateObj.getMonth()];
                  const year = dateObj.getFullYear();
                  
                  eventDate = `${dayName}, ${date} ${month} ${year}`;
                  eventTime = null;
              }

              // Create location element
              let locationElement;
              if (event.location) {
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                  locationElement = `<a href="${mapsUrl}" target="_blank" class="location-link">${event.location}</a>`;
              } else {
                  locationElement = 'Online/TBA';
              }

              eventElement.innerHTML = `
                  <div class="animatableY" style="text-align: center;">
                      <h3>${event.summary}</h3>
                      <p>🗓️ ${eventDate}${eventTime ? ` • ${eventTime}` : ''}</p>
                      <p>📍 ${locationElement}</p>
                      <p>"${event.description || 'Tidak ada deskripsi'}"</p>
                      <p>🔝📍 -Maps Google (click location)-🔝</p>
                      <a href="${CALENDAR_URL}" target="_blank" class="calendar-link">📅+ Add Biru Langit Show</a>
                  </div>
              `;
          } else {
              eventElement.innerHTML = `
                  <div class="animatableX" style="text-align: center;">
                      <p>Tidak ada event yang akan datang</p>
                      <a href="${CALENDAR_URL}" target="_blank" class="calendar-link">📅+ Add Biru Langit Show</a>
                  </div>
              `;
          }
      })
      .catch(error => {
          console.error('Error fetching calendar data:', error);
          document.getElementById('next-event').innerHTML = `
              <div class="error" style="text-align: center;">
                  <p>Gagal memuat data event. Silakan coba lagi nanti.</p>
                  <a href="${CALENDAR_URL}" target="_blank" class="calendar-link">📅+ Add Biru Langit Show</a>
              </div>
          `;
      });
});


// Parallax effect and gsap
$(function () {
  if (!window.location.pathname.match("mentions")) {
    $('.rellax').css('transform', 'translateX(-50%)');
    var rellax = new Rellax('.rellax');
  }
})

// Script adresse Email
// Listener pour chargement adresse mailto
window.addEventListener("load", function () {
  if (document.getElementById('insertMail')) {
    let name = "contact" ; // Update yours informations here
    let domain = "yourbandname.com" ; // Update yours informations here
    //let subject = "subject=Formulaire Tuco" ;
    let divMail = document.getElementById('insertMail');
    let newAhref = document.createElement('a');
    newAhref.href = "mailto:" + name + '@' + domain;
    newAhref.innerHTML = name + '@' + domain;
    divMail.appendChild(newAhref);
  }
})

document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;
    let autoPlayInterval;
    const autoPlayDelay = 3000; // 3 seconds
    
    // Initialize the gallery
    initGallery();
    
    function initGallery() {
        // Set up event listeners
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => changePhoto(index));
        });
        
        prevButton.addEventListener('click', prevPhoto);
        nextButton.addEventListener('click', nextPhoto);
        
        // Start auto-play
        startAutoPlay();
        
        // Pause auto-play when hovering over gallery
        const gallery = document.querySelector('.gallery-container');
        gallery.addEventListener('mouseenter', pauseAutoPlay);
        gallery.addEventListener('mouseleave', startAutoPlay);
    }
    
    function changePhoto(index) {
        currentIndex = index;
        updateMainImage();
        updateThumbnails();
        resetAutoPlay();
    }
    
    function prevPhoto() {
        currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateMainImage();
        updateThumbnails();
        resetAutoPlay();
    }
    
    function nextPhoto() {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        updateMainImage();
        updateThumbnails();
        resetAutoPlay();
    }
    
    function updateMainImage() {
        // Add fade effect
        mainImage.style.opacity = 0;
        
        setTimeout(() => {
            mainImage.src = thumbnails[currentIndex].src;
            mainImage.alt = thumbnails[currentIndex].alt;
            mainImage.style.opacity = 1;
        }, 300); // Match this with CSS transition time
    }
    
    function updateThumbnails() {
        thumbnails.forEach((thumb, index) => {
            if (index === currentIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    function startAutoPlay() {
        if (!autoPlayInterval) {
            autoPlayInterval = setInterval(nextPhoto, autoPlayDelay);
        }
    }
    
    function pauseAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    function resetAutoPlay() {
        pauseAutoPlay();
        startAutoPlay();
    }
    
    // Start auto-play initially
    startAutoPlay();
});




// Manage vidéo
$(function () {
    $('video').on('click', function(event) {
      event.preventDefault();
      document.getElementById('tucoVideo').play();
    });
})
document.getElementById('whatsappForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();
  
  // Validate phone number (simple validation)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone)) {
      alert('Nomor HP tidak valid. Harap masukkan nomor yang benar (10-15 digit angka).');
      return;
  }
  
  // Format phone number (remove leading 0 if any and add country code)
  let formattedPhone = phone;
  if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
  } else if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone;
  }
  
  // Create the WhatsApp URL
  const encodedMessage = encodeURIComponent(`Halo, saya ${name}.\n${message}`);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  // For demo purposes, we'll show the URL in console
  console.log('WhatsApp URL:', whatsappUrl);
  
  // In this specific case, we'll send to the fixed number +6285703271346
  const targetUrl = `https://wa.me/6285703271346?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(targetUrl, '_blank');
  
  // Optional: Reset the form after submission
  // this.reset();
});


// Animations on scroll
$(function () {
    $(window).on('scroll', function () {
        let sizePage = $(window).height();
        let trigger = 100;
        // Animation en Y
        let element = document.getElementsByClassName('animatableY');
        for (var unit of element) {
          if (unit.getBoundingClientRect().top + trigger <= sizePage) {
            unit.classList.add('showed');
          }
        }

        // Animation en X
        let elementh2 = document.getElementsByClassName('animatableX');
        for (var unit of elementh2) {
          if (unit.getBoundingClientRect().top + trigger <= sizePage) {
            unit.classList.add('showed');
          }
        }

        // Animation opacity
        let elementOpacity = document.getElementsByClassName('animatableOpacity');
        for (var unit of elementOpacity) {
          if (unit.getBoundingClientRect().top + trigger <= sizePage) {
            unit.classList.add('showed');
          }
        }
    })
})

//Lazyload
$(function () {
  if (!window.location.pathname.match("mentions")) {
    lazyload();
  }
})

// resize reload
$(function () {
  let initialWidth = $(window).innerWidth();
  $(window).on('resize', function () {
    let newWidth = $(window).innerWidth();
    if (initialWidth != newWidth) {
      document.location.reload(true);
    }
  })
})

// Manage scroll up button
$(function () {
    let ecran = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      $(window).on('scroll', function () {
        let scrollNow = $(window).scrollTop();
        $(window).on('scroll', function functionName() {
          if (scrollNow > 600 && scrollNow > $(window).scrollTop()) {
            if ($('#upArrow').is(":hidden")) {
              $('#upArrow').show();
            }
          } else {
            $('#upArrow').hide();
          }
        })
        $('#upArrow').on('click', function () {
            $(window).scrollTop(0);
        })
      })
})

// Delete scroll tag on scroll down
$(function () {
    $(window).on('scroll', function () {
        let topPage = $(window).scrollTop();
        if (topPage >= 150) {
          $('#scrollDown').hide();
        } else {
          $('#scrollDown').show();
        }
    })
})
// Manage tag scroll down
$(function () {
    $('#scrollDown').on('click', function() {
      window.location.href = "#nextShow";
    });
})

