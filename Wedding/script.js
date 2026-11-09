
document.addEventListener('DOMContentLoaded', () => {
    // 1. URL එකෙන් නම ලබාගෙන ආරාධිත නම සහ Guestbook form එක වෙනස් කිරීම (උදා: index.html?to=John+Doe)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('name');
    const guestDisplay = document.getElementById('guest-name-display');
    const guestNameInput = document.getElementById('guest-name');

    if (guestParam) {
        const decodedName = decodeURIComponent(guestParam);
        
        if (guestDisplay) {
            guestDisplay.textContent = decodedName;
        }
        
        if (guestNameInput) {
            guestNameInput.value = decodedName;
        }
    }

    let isPlaying = false;
    let autoScrollInterval = null;

    const audio = document.getElementById('bg-audio');
    const audioToggle = document.getElementById('audio-toggle');
    const openBtn = document.getElementById('open-btn');
    const cover = document.getElementById('cover-screen');
    const main = document.getElementById('main-invitation');

    // Start continuous falling hearts on load
    startContinuousHearts();

    // Open Invitation Event (Sound Effect + Massive Hearts Burst + Main Song + Card Reveal)
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 1. Opening Sound effect
            const openSound = new Audio('Audio/open-button.mp3');
            openSound.play().catch(err => console.log("Sound effect blocked:", err));

            // 2. Massive Heart Burst
            triggerMassiveHeartBurst();

            // 3. Background Audio play වීම
            setTimeout(() => {
                if (audio) {
                    audio.play().then(() => {
                        isPlaying = true;
                        if (audioToggle) audioToggle.innerHTML = "❚❚";
                    }).catch(err => {
                        console.log("Main audio autoplay restricted:", err);
                        isPlaying = false;
                        if (audioToggle) audioToggle.innerHTML = "▶";
                    });
                }
            }, 1200);

            // 4. ප්‍රධාන වෙඩින් කාඩ් එක මතුවීම
            setTimeout(() => {
                if (cover) cover.classList.add('hidden');
                if (main) main.classList.add('visible');

                // Start slow vertical page auto-scroll after card appears
                setTimeout(startAutoScroll, 500);
            }, 200); 
        });
    }

    // Audio Toggle Control
    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!audio) return;
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                audioToggle.innerHTML = "▶";
            } else {
                audio.play().then(() => {
                    isPlaying = true;
                    audioToggle.innerHTML = "❚❚";
                });
            }
        });
    }

    // Continuous Falling Hearts Generator
    function startContinuousHearts() {
        const container = document.getElementById('hearts-container');
        if (!container) return;
        // const icons = ['❤️', '💖', '💕', '💗'];
        //  const icons = ['🤍', '♡', '☆', '🤍'];

        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'falling-heart';
            heart.innerText = icons[Math.floor(Math.random() * icons.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
            heart.style.fontSize = (Math.random() * 16 + 14) + 'px';
            
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 6000);
        }, 250);
    }

    // // Massive Burst
    // function triggerMassiveHeartBurst() {
    //     const container = document.getElementById('hearts-container');
    //     if (!container) return;
    //    // const icons = ['💕', '💕', '💕', '💕', '💕', '💕', '💕'];
    //     const icons = ['🤍', '♡', '☆', '🤍','🤍', '♡', '☆', '🤍'];

    //     for (let i = 0; i < 70; i++) {
    //         setTimeout(() => {
    //             const heart = document.createElement('div');
    //             heart.className = 'falling-heart';
    //             heart.innerText = icons[Math.floor(Math.random() * icons.length)];
    //             heart.style.left = Math.random() * 100 + 'vw';
    //             heart.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    //             heart.style.fontSize = (Math.random() * 22 + 16) + 'px';
                
    //             container.appendChild(heart);
    //             setTimeout(() => heart.remove(), 4000);
    //         }, i * 25);
    //     }
    // }

    // මල් දෙකේ ස්ථාන වලින් හාට්ස් විසිවන ෆੰක්සන් එක
function triggerMassiveHeartBurst() {
    const topFlower = document.querySelector('.flower-top');
    const bottomFlower = document.querySelector('.flower-bottom');
    
    // මල් දෙකේ තිරයේ ඇති පිහිටීම (Coordinates) ලබා ගැනීම
    const topRect = topFlower ? topFlower.getBoundingClientRect() : { left: 50, top: 50 };
    const bottomRect = bottomFlower ? bottomFlower.getBoundingClientRect() : { left: window.innerWidth - 100, top: window.innerHeight - 100 };

    // උඩ මලෙන් හාට්ස් විසිරීම (Left-Top flower burst)
   createFlowerHeartBurst(topRect.left + 50, topRect.top + 50, -10, 100);

    // යට මලෙන් හාට්ස් විසිරීම (Bottom-Right flower burst)
   createFlowerHeartBurst(bottomRect.left + 50, bottomRect.top + 50, -170, -80);
}

function createFlowerHeartBurst(originX, originY, minAngle, maxAngle) {
    const heartSymbols = ['🤍', '♡', '☆', '🤍','🤍', '♡', '☆', '🤍','🤍', '♡', '☆', '🤍','🤍', '♡', '☆', '🤍'];
    const count = 25; // විසිවන හාට් සංඛ්‍යාව

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        // මල පිහිටි තැනින් ආරම්භ වීම
        heart.style.left = `${originX}px`;
        heart.style.top = `${originY}px`;

        // විවිධ දිශාවලට ගමන් කිරීමට අහඹු අගයන් ලබා දීම
        // const angle = (Math.random() * (maxAngle - minAngle) + minAngle) * (Math.PI / 180);
        // const distance = Math.random() * 180 + 80; // විසිවී යන දුර
        const angle = (Math.random() * (maxAngle - minAngle) + minAngle) * (Math.PI / 180);
        const distance = Math.random() * 200 + 70; // විසිවී යන දුර
        const destX = Math.cos(angle) * distance;
        const destY = Math.sin(angle) * distance;

        heart.style.setProperty('--dest-x', `${destX}px`);
        heart.style.setProperty('--dest-y', `${destY}px`);
        
        document.body.appendChild(heart);

        // Animation එක අවසන් වූ පසු ඊට අදාළ HTML element එක ඉවත් කිරීම
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
}



//     // Smooth Vertical Auto-Scroll Function for Page
//     function startAutoScroll() {
//         if (autoScrollInterval) return;

//         autoScrollInterval = setInterval(() => {
//             const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
//             if (window.scrollY < maxScroll) {
//                 window.scrollBy({ top: 3, behavior: 'smooth' });
//             } else {
//                 clearInterval(autoScrollInterval);
//             }
//         }, 35);
//     }

//     // Stop auto-scroll when clicking or typing in message box

// const guestMessage = document.getElementById('rsvp-guest-message');

// guestMessage.addEventListener('focus', function () {

//     clearInterval(autoScrollInterval);
//     autoScrollInterval = null;

// });







function startAutoScroll() {
    // Prevent multiple auto-scroll intervals
    if (autoScrollInterval !== null) return;

    autoScrollInterval = setInterval(() => {
        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        if (window.scrollY < maxScroll) {
            // Scroll without smooth animation
            window.scrollBy(0, 2);
        } else {
            stopAutoScroll();
        }
    }, 30);
}

function stopAutoScroll() {
    if (autoScrollInterval !== null) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}



document.addEventListener('DOMContentLoaded', function () {

    const guestMessage = document.getElementById('rsvp-guest-message');

    if (guestMessage) {
        guestMessage.addEventListener('click', stopAutoScroll);
        guestMessage.addEventListener('focus', stopAutoScroll);
        guestMessage.addEventListener('input', stopAutoScroll);
    }

});

    // window.addEventListener('wheel', () => clearInterval(autoScrollInterval), { passive: true });
    // window.addEventListener('touchstart', () => clearInterval(autoScrollInterval), { passive: true });

    // // Initialize 3D Swiper Coverflow Gallery with Navigation Arrows
    // // Initialize 3D Swiper Coverflow Gallery with Navigation Arrows
    // const swiper = new Swiper('.mySwiper', {
    //     effect: 'coverflow',
    //     grabCursor: true,
    //     centeredSlides: true,
    //     slidesPerView: 'auto',
    //     // loop: true, <--- මෙම පේළිය ඉවත් කරන්න (Remove this line)
    //     autoplay: {
    //         delay: 3000,
    //         disableOnInteraction: false,
    //     },
    //     coverflowEffect: {
    //         rotate: 30,
    //         stretch: 0,
    //         depth: 100,
    //         modifier: 1,
    //         slideShadows: true,
    //     },
    //     pagination: {
    //         el: '.swiper-pagination',
    //         clickable: true,
    //     },
    //     navigation: {
    //         nextEl: '#next-photo-btn',
    //         prevEl: '#prev-photo-btn',
    //     },
    // });

    // // POPUP MODAL LOGIC FOR GALLERY IMAGES
    // const modal = document.getElementById('photo-modal');
    // const modalImg = document.getElementById('modal-img');
    // const modalClose = document.querySelector('.modal-close');

    // document.querySelectorAll('.swiper-slide img').forEach(img => {
    //     img.addEventListener('click', (e) => {
    //         e.stopPropagation();
    //         if (modal && modalImg) {
    //             modal.classList.add('show');
    //             modalImg.src = img.src;
    //         }
    //     });
    // });

    // if (modalClose && modal) {
    //     modalClose.addEventListener('click', () => modal.classList.remove('show'));
    //     modal.addEventListener('click', () => modal.classList.remove('show'));
    // }

    // INITIALIZE WEDDING PHOTO GALLERY

const swiper = new Swiper('.mySwiper', {

    effect: 'coverflow',

    grabCursor: true,

    centeredSlides: true,

    slidesPerView: 'auto',

    loop: true,

    speed: 1000,

    autoplay: {
        delay: 2500,
         disableOnInteraction: false,
        pauseOnMouseEnter: false,
    },

    coverflowEffect: {
           rotate: 25,
        stretch: 0,
        depth: 250,
        modifier: 1.5,
        slideShadows: false
    },

    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },

    navigation: {
        nextEl: '#next-photo-btn',
        prevEl: '#prev-photo-btn'
    },

    on: {

        init: function () {
            updateGalleryCounter(this);
            animateActivePhoto(this);
        },

        slideChangeTransitionStart: function () {
            updateGalleryCounter(this);
            animateActivePhoto(this);
        }

    }

});


// UPDATE PHOTO COUNTER

function updateGalleryCounter(swiper) {

    const current = document.getElementById('current-photo');

    const total = document.getElementById('total-photos');

    if (current && total) {

        current.textContent = swiper.realIndex + 1;

        total.textContent = swiper.slides.length - swiper.loopedSlides * 2;

    }

}


// POP UP ANIMATION FOR ACTIVE PHOTO

function animateActivePhoto(swiper) {

    const images = swiper.el.querySelectorAll('.swiper-slide img');

    images.forEach(img => {
        img.classList.remove('gallery-pop');
    });

    const activeImage = swiper.slides[swiper.activeIndex]
        ?.querySelector('img');

    if (activeImage) {

        void activeImage.offsetWidth;

        activeImage.classList.add('gallery-pop');

    }

}


// PHOTO MODAL

const modal = document.getElementById('photo-modal');

const modalImg = document.getElementById('modal-img');

const modalClose = document.querySelector('.modal-close');


// OPEN PHOTO

document.querySelectorAll('.swiper-slide img').forEach(img => {

    img.addEventListener('click', function (e) {

        e.stopPropagation();

        if (modal && modalImg) {

            swiper.autoplay.stop();

            modalImg.src = this.src;

            modal.classList.add('show');

        }

    });

});


// CLOSE MODAL

function closePhotoModal() {

    if (modal) {

        modal.classList.remove('show');

        swiper.autoplay.start();

    }

}

if (modalClose) {

    modalClose.addEventListener('click', closePhotoModal);

}

if (modal) {

    modal.addEventListener('click', function (e) {

        if (e.target === modal) {

            closePhotoModal();

        }

    });

}


// CLOSE USING ESCAPE KEY

document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape') {

        closePhotoModal();

    }

});

    // --- ADD TO CALENDAR FUNCTIONALITY ---
    const calendarBtn = document.getElementById('calendar-btn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            const title = encodeURIComponent("Himasha & Hiruni's Wedding Reception");
            const details = encodeURIComponent("Join us in celebrating the wedding reception of Himasha & Hiruni at Lavenro Garden Hotel, Kosgama.");
            const location = encodeURIComponent("Lavenro Garden Hotel, Kosgama, Sri Lanka");
            
            const startTime = "20261212T163000"; 
            const endTime = "20261212T210000";

            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;

            window.open(googleCalendarUrl, '_blank');
        });
    }

    // --- RSVP MODAL & GOOGLE SHEET INTEGRATION ---
    const rsvpOpenBtn = document.getElementById('rsvp-btn');
    const rsvpModal = document.getElementById('rsvp-modal');
    const rsvpCloseBtn = document.getElementById('rsvp-close-btn');
    const rsvpConfirmBtn = document.getElementById('rsvp-confirm-btn');
    const rsvpGuestNameInput = document.getElementById('rsvp-guest-name');
    const mainGuestInput = document.getElementById('guest-name');
    const leaveMessageGroup = document.getElementById('leave-message-group');
    const rsvpMessageInput = document.getElementById('rsvp-guest-message');

    // 1. Open Modal
    if (rsvpOpenBtn && rsvpModal) {
        rsvpOpenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainGuestInput && rsvpGuestNameInput) {
                rsvpGuestNameInput.value = mainGuestInput.value;
            }
            rsvpModal.classList.add('show');
        });
    }

    // 2. Close Modal
    if (rsvpCloseBtn && rsvpModal) {
        rsvpCloseBtn.addEventListener('click', () => {
            rsvpModal.classList.remove('show');
        });
    }

    if (rsvpModal) {
        rsvpModal.addEventListener('click', (e) => {
            if (e.target === rsvpModal) {
                rsvpModal.classList.remove('show');
            }
        });
    }

    // 3. Radio Card Selection & Toggle Leave a Message Section
    const radioCards = document.querySelectorAll('.rsvp-radio-card');
    radioCards.forEach(card => {
        card.addEventListener('click', () => {
            radioCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const radioInput = card.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.checked = true;
                
                if (radioInput.value === "Sorry, I can't make it") {
                    if (leaveMessageGroup) leaveMessageGroup.style.display = "block";
                } else {
                    if (leaveMessageGroup) leaveMessageGroup.style.display = "none";
                    if (rsvpMessageInput) rsvpMessageInput.value = "";
                }
            }
        });
    });

    // 4. Submit RSVP to Google Sheet
    if (rsvpConfirmBtn) {
        rsvpConfirmBtn.addEventListener('click', () => {
            const guestName = rsvpGuestNameInput ? rsvpGuestNameInput.value.trim() : "Guest";
            const selectedRadio = document.querySelector('input[name="attendance"]:checked');
            const attendanceStatus = selectedRadio ? selectedRadio.value : "I will attend";
            const guestMessage = rsvpMessageInput ? rsvpMessageInput.value.trim() : "";

            const scriptURL = "https://script.google.com/macros/s/AKfycbx29zu3BX2cJjlJW6DdVktkIt6SV3t4NXqODKGomSAC519NKos2K4nsXqD_z48lXbEf/exec";

            const formData = new FormData();
            formData.append("Name", guestName);
            formData.append("Status", attendanceStatus);
            formData.append("Message", guestMessage);

            rsvpConfirmBtn.textContent = "Submitting...";
            rsvpConfirmBtn.disabled = true;

            fetch(scriptURL, { 
                method: 'POST', 
                mode: 'no-cors',
                body: formData 
            })
            .then(response => {
                alert("Thank you! Your response has been saved successfully.");
                if (rsvpModal) rsvpModal.classList.remove('show');
                rsvpConfirmBtn.textContent = "Confirm";
                rsvpConfirmBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("Something went wrong. Please try again.");
                rsvpConfirmBtn.textContent = "Confirm";
                rsvpConfirmBtn.disabled = false;
            });
        });
    }

    // --- WISHES / GUESTBOOK INTEGRATION ---
    const WISHES_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTiHrKxIo0vlDo_WZz0RfFAbHbC5tTyyCkUpaomB0-89XtW68993sBTMwe8fTrNn5uFg/exec';
    
    // Initial fetch of wishes
    fetchWishes();

    function submitWish() {
        const nameInput = document.getElementById('guest-name');
        const wishInput = document.getElementById('guest-wish');
        const submitBtn = document.getElementById('submit-wish-btn');
        
        const name = nameInput ? nameInput.value : 'Guest';
        const message = wishInput ? wishInput.value.trim() : '';
        
        if (!message) {
            alert('Please enter your wish before sending!');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
        
        document.getElementById('form-name').value = name;
        document.getElementById('form-message').value = message;
        document.getElementById('hidden-wish-form').submit();
        
        setTimeout(() => {
            alert('Thank you for your wonderful wish!');
            wishInput.value = '';
            submitBtn.disabled = false;
            submitBtn.innerText = 'Send Wishes';
            fetchWishes();
        }, 2000);
    }

    function fetchWishes() {
        const container = document.getElementById('wishes-container');
        if (!container) return;
        
        fetch(WISHES_SCRIPT_URL)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';
                
                if (data.result === 'success' && data.wishes && data.wishes.length > 0) {
                    data.wishes.forEach(wish => {
                        const wishElement = document.createElement('div');
                        wishElement.className = 'wish-item';
                        wishElement.innerHTML = `
                            <div class="wish-header">
                                <span class="wish-author">${escapeHtml(wish.name)}</span>
                                <span>${wish.date}</span>
                            </div>
                            <div class="wish-body">${escapeHtml(wish.message)}</div>
                        `;
                        container.appendChild(wishElement);
                    });
                } else {
                    container.innerHTML = `
                        <div class="no-wishes-message" style="text-align: center; padding: 20px; color: #d4af37;">
                            No message yet. Be the first to send message! ❤️
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error loading wishes:', error);
                container.innerHTML = `
                    <div class="no-wishes-message" style="text-align: center; padding: 20px; color: #d4af37;">
                        No message yet. Be the first to send message! ❤️
                    </div>
                `;
            });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.innerText = text;
        return div.innerHTML;
    }

    // Make functions accessible to HTML onclick attributes
    window.submitWish = submitWish;
    window.fetchWishes = fetchWishes;
});


// Count Down Code
//========================

function updateCountdown() {
    // December 12, 2026 at 11:00 AM
    const receptionDate = new Date(
        "2026-12-12T11:00:00+05:30"
    ).getTime();

    const now = new Date().getTime();
    const distance = receptionDate - now;

    if (distance <= 0) {
        document.querySelector(".countdown-timer").innerHTML =
            "<h3>Our Special Day Has Arrived! ❤️</h3>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
    );

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// document.addEventListener('DOMContentLoaded', () => {
//     // 1. URL එකෙන් නම ලබාගෙන ආරාධිත නම සහ Guestbook form එක වෙනස් කිරීම (උදා: index.html?to=John+Doe)
//     const urlParams = new URLSearchParams(window.location.search);
//     const guestParam = urlParams.get('to') || urlParams.get('name');
//     const guestDisplay = document.getElementById('guest-name-display');
//     const guestNameInput = document.getElementById('guest-name');

//     if (guestParam) {
//         const decodedName = decodeURIComponent(guestParam);
        
//         if (guestDisplay) {
//             guestDisplay.textContent = decodedName;
//         }
        
//         if (guestNameInput) {
//             guestNameInput.value = decodedName;
//         }
//     }

//     let isPlaying = false;
//     let autoScrollInterval = null;
//     let galleryInterval = null;

//     const audio = document.getElementById('bg-audio');
//     const audioToggle = document.getElementById('audio-toggle');
//     const openBtn = document.getElementById('open-btn');
//     const submitWishBtn = document.getElementById('submit-wish-btn');
//     const cover = document.getElementById('cover-screen');
//     const main = document.getElementById('main-invitation');

//     // Start continuous falling hearts on load
//     startContinuousHearts();

//     // Start auto-scrolling the photo gallery
//     startGalleryAutoScroll();

//     // Open Invitation Event (Sound Effect + Massive Hearts Burst + Main Song + Card Reveal)
//     if (openBtn) {
//         openBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             e.stopPropagation();

//             // 1. Opening Sound effect (Audio ෆෝල්ඩරයෙන් play වේ)
//             const openSound = new Audio('Audio/open-button.mp3');
//             openSound.play().catch(err => console.log("Sound effect blocked:", err));

//             // 2. Massive Heart Burst
//             triggerMassiveHeartBurst();

//             // 3. Sound effect එකට පසු ප්‍රධාන සිංදුව (Background Audio) play වීම
//             setTimeout(() => {
//                 if (audio) {
//                     audio.play().then(() => {
//                         isPlaying = true;
//                         if (audioToggle) audioToggle.innerHTML = "❚❚";
//                     }).catch(err => {
//                         console.log("Main audio autoplay restricted:", err);
//                         isPlaying = false;
//                         if (audioToggle) audioToggle.innerHTML = "▶";
//                     });
//                 }
//             }, 1200); // Sound එක පටන්ගෙන තත්පර 1.2 කින් ප්‍රධාන සිංදුව ආරම්භ වේ

//             // 4. ටික වේලාවකින් ප්‍රධාන වෙඩින් කාඩ් එක මතුවීම
//             setTimeout(() => {
//                 if (cover) cover.classList.add('hidden');
//                 if (main) main.classList.add('visible');

//                 // Start slow vertical page auto-scroll after card appears
//                 setTimeout(startAutoScroll, 500);
//             }, 1800); 
//         });
//     }

//     // Audio Toggle Control
//     if (audioToggle) {
//         audioToggle.addEventListener('click', (e) => {
//             e.stopPropagation();
//             if (!audio) return;
//             if (isPlaying) {
//                 audio.pause();
//                 isPlaying = false;
//                 audioToggle.innerHTML = "▶";
//             } else {
//                 audio.play().then(() => {
//                     isPlaying = true;
//                     audioToggle.innerHTML = "❚❚";
//                 });
//             }
//         });
//     }

//     // Continuous Falling Hearts Generator (සාමාන්‍ය වැටෙන hearts)
//     function startContinuousHearts() {
//         const container = document.getElementById('hearts-container');
//         if (!container) return;
//         const icons = ['❤️', '💖', '💕', '💗'];

//         setInterval(() => {
//             const heart = document.createElement('div');
//             heart.className = 'falling-heart';
//             heart.innerText = icons[Math.floor(Math.random() * icons.length)];
//             heart.style.left = Math.random() * 100 + 'vw';
//             heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
//             heart.style.fontSize = (Math.random() * 16 + 14) + 'px';
            
//             container.appendChild(heart);
//             setTimeout(() => heart.remove(), 6000);
//         }, 250);
//     }

//     // Massive Burst
//     function triggerMassiveHeartBurst() {
//         const container = document.getElementById('hearts-container');
//         if (!container) return;
//         const icons = ['💕', '💕', '💕', '💕', '💕', '💕', '💕'];

//         for (let i = 0; i < 70; i++) { // එකවර hearts 70ක් විසි වේ
//             setTimeout(() => {
//                 const heart = document.createElement('div');
//                 heart.className = 'falling-heart';
//                 heart.innerText = icons[Math.floor(Math.random() * icons.length)];
//                 heart.style.left = Math.random() * 100 + 'vw';
//                 heart.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
//                 heart.style.fontSize = (Math.random() * 22 + 16) + 'px';
                
//                 container.appendChild(heart);
//                 setTimeout(() => heart.remove(), 4000);
//             }, i * 25);
//         }
//     }

//     // // Photo Gallery Auto-Scroll Function
//     // function startGalleryAutoScroll() {
//     //     const slider = document.querySelector('.gallery-slider');
//     //     if (!slider) return;

//     //     galleryInterval = setInterval(() => {
//     //         if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
//     //             slider.scrollTo({ left: 0, behavior: 'smooth' });
//     //         } else {
//     //             slider.scrollBy({ left: 300, behavior: 'smooth' });
//     //         }
//     //     }, 3000);

//     //     slider.addEventListener('mouseenter', () => clearInterval(galleryInterval));
//     //     slider.addEventListener('mouseleave', () => startGalleryAutoScroll());
//     //     slider.addEventListener('touchstart', () => clearInterval(galleryInterval), { passive: true });
//     // }

//     // // Smooth Vertical Auto-Scroll Function for Page
//     // function startAutoScroll() {
//     //     if (autoScrollInterval) return;

//     //     autoScrollInterval = setInterval(() => {
//     //         const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
//     //         if (window.scrollY < maxScroll) {
//     //             window.scrollBy({ top: 1, behavior: 'smooth' });
//     //         } else {
//     //             clearInterval(autoScrollInterval);
//     //         }
//     //     }, 35);
//     // }

//     // window.addEventListener('wheel', () => clearInterval(autoScrollInterval), { passive: true });
//     // window.addEventListener('touchstart', () => clearInterval(autoScrollInterval), { passive: true });

//     // // Guestbook Wish Submission
//     // // if (submitWishBtn) {
//     // //     submitWishBtn.addEventListener('click', (e) => {
//     // //         e.stopPropagation();
//     // //         const nameInput = document.getElementById('guest-name');
//     // //         const wishInput = document.getElementById('guest-wish');
//     // //         const wishText = wishInput ? wishInput.value.trim() : '';

//     // //         if (!wishText) {
//     // //             alert('Please enter your wishes before submitting.');
//     // //             return;
//     // //         }

//     // //         const container = document.getElementById('wishes-container');
//     // //         const now = new Date();
//     // //         const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

//     // //         const newWish = document.createElement('div');
//     // //         newWish.className = 'wish-item';
//     // //         newWish.innerHTML = `
//     // //             <div class="wish-header">
//     // //                 <span class="wish-author">${nameInput ? nameInput.value : 'Guest'}</span>
//     // //                 <span>${dateStr}</span>
//     // //             </div>
//     // //             <div class="wish-body">${wishText}</div>
//     // //         `;

//     // //         if (container) container.prepend(newWish);
//     // //         if (wishInput) wishInput.value = '';
//     // //         alert('Thank you! Your wish has been posted successfully.');
//     // //     });
//     // // }

//     // // GALLERY ARROWS & POPUP MODAL LOGIC
//     // const slider = document.querySelector('.gallery-slider');
//     // const prevBtn = document.getElementById('prev-photo-btn');
//     // const nextBtn = document.getElementById('next-photo-btn');
//     // const modal = document.getElementById('photo-modal');
//     // const modalImg = document.getElementById('modal-img');
//     // const modalClose = document.querySelector('.modal-close');

//     // if (prevBtn && slider) {
//     //     prevBtn.addEventListener('click', (e) => {
//     //         e.stopPropagation();
//     //         slider.scrollBy({ left: -300, behavior: 'smooth' });
//     //     });
//     // }

//     // if (nextBtn && slider) {
//     //     nextBtn.addEventListener('click', (e) => {
//     //         e.stopPropagation();
//     //         slider.scrollBy({ left: 300, behavior: 'smooth' });
//     //     });
//     // }

//     // const galleryImages = document.querySelectorAll('.gallery-slide img');
//     // galleryImages.forEach(img => {
//     //     img.addEventListener('click', (e) => {
//     //         e.stopPropagation();
//     //         if (modal && modalImg) {
//     //             modal.classList.add('show');
//     //             modalImg.src = img.src;
//     //         }
//     //     });
//     // });

//     // if (modalClose && modal) {
//     //     modalClose.addEventListener('click', () => modal.classList.remove('show'));
//     //     modal.addEventListener('click', () => modal.classList.remove('show'));
//     // }


//     // Initialize 3D Swiper Coverflow Gallery with Navigation Arrows
// const swiper = new Swiper('.mySwiper', {
//     effect: 'coverflow',
//     grabCursor: true,
//     centeredSlides: true,
//     slidesPerView: 'auto',
//     loop: true,
//     autoplay: {
//         delay: 3000,
//         disableOnInteraction: false,
//     },
//     coverflowEffect: {
//         rotate: 30,
//         stretch: 0,
//         depth: 100,
//         modifier: 1,
//         slideShadows: true,
//     },
//     pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//     },
//     navigation: {
//         nextEl: '#next-photo-btn',
//         prevEl: '#prev-photo-btn',
//     },
// });

// // POPUP MODAL LOGIC FOR GALLERY IMAGES
// const modal = document.getElementById('photo-modal');
// const modalImg = document.getElementById('modal-img');
// const modalClose = document.querySelector('.modal-close');

// document.querySelectorAll('.swiper-slide img').forEach(img => {
//     img.addEventListener('click', (e) => {
//         e.stopPropagation();
//         if (modal && modalImg) {
//             modal.classList.add('show');
//             modalImg.src = img.src;
//         }
//     });
// });

// if (modalClose && modal) {
//     modalClose.addEventListener('click', () => modal.classList.remove('show'));
//     modal.addEventListener('click', () => modal.classList.remove('show'));
// }





//     // --- ADD TO CALENDAR FUNCTIONALITY ---
// const calendarBtn = document.getElementById('calendar-btn');
// if (calendarBtn) {
//     calendarBtn.addEventListener('click', (e) => {
//         e.stopPropagation();

//         // ඊවන්ට් එකේ විස්තර
//         const title = encodeURIComponent("Himasha & Hiruni's Wedding Reception");
//         const details = encodeURIComponent("Join us in celebrating the wedding reception of Himasha & Hiruni at Lavenro Garden Hotel, Kosgama.");
//         const location = encodeURIComponent("Lavenro Garden Hotel, Kosgama, Sri Lanka");
        
//         // දිනය සහ වේලාව (දෙසැම්බර් 12, 2026 - පස්වරු 4:30 සිට රාත්‍රී 9:00 දක්වා)
//         const startTime = "20261212T163000"; 
//         const endTime = "20261212T210000";

//         // Google Calendar වෙත ඊවන්ට් එක එකතු කරන ලින්ක් එක සකස් කිරීම
//         const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;

//         // අලුත් ටැබ් එකකින් විවෘත වීම
//         window.open(googleCalendarUrl, '_blank');
//     });
// }




// // --- RSVP MODAL & GOOGLE SHEET INTEGRATION ---
// const rsvpOpenBtn = document.getElementById('rsvp-btn');
// const rsvpModal = document.getElementById('rsvp-modal');
// const rsvpCloseBtn = document.getElementById('rsvp-close-btn');
// const rsvpConfirmBtn = document.getElementById('rsvp-confirm-btn');
// const rsvpGuestNameInput = document.getElementById('rsvp-guest-name');
// const mainGuestInput = document.getElementById('guest-name');
// const leaveMessageGroup = document.getElementById('leave-message-group');
// const rsvpMessageInput = document.getElementById('rsvp-guest-message');

// // 1. Open Modal
// if (rsvpOpenBtn && rsvpModal) {
//     rsvpOpenBtn.addEventListener('click', (e) => {
//         e.stopPropagation();
//         if (mainGuestInput && rsvpGuestNameInput) {
//             rsvpGuestNameInput.value = mainGuestInput.value;
//         }
//         rsvpModal.classList.add('show');
//     });
// }

// // 2. Close Modal
// if (rsvpCloseBtn && rsvpModal) {
//     rsvpCloseBtn.addEventListener('click', () => {
//         rsvpModal.classList.remove('show');
//     });
// }

// if (rsvpModal) {
//     rsvpModal.addEventListener('click', (e) => {
//         if (e.target === rsvpModal) {
//             rsvpModal.classList.remove('show');
//         }
//     });
// }

// // 3. Radio Card Selection & Toggle Leave a Message Section
// const radioCards = document.querySelectorAll('.rsvp-radio-card');
// radioCards.forEach(card => {
//     card.addEventListener('click', () => {
//         radioCards.forEach(c => c.classList.remove('selected'));
//         card.classList.add('selected');
//         const radioInput = card.querySelector('input[type="radio"]');
//         if (radioInput) {
//             radioInput.checked = true;
            
//             // "Sorry, I can't make it" තේරුවොත් message box එක පෙන්වන්න, නැත්නම් වසන්න
//             if (radioInput.value === "Sorry, I can't make it") {
//                 if (leaveMessageGroup) leaveMessageGroup.style.display = "block";
//             } else {
//                 if (leaveMessageGroup) leaveMessageGroup.style.display = "none";
//                 if (rsvpMessageInput) rsvpMessageInput.value = "";
//             }
//         }
//     });
// });

// // 4. Submit to Google Sheet
// if (rsvpConfirmBtn) {
//     rsvpConfirmBtn.addEventListener('click', () => {
//         const guestName = rsvpGuestNameInput ? rsvpGuestNameInput.value.trim() : "Guest";
//         const selectedRadio = document.querySelector('input[name="attendance"]:checked');
//         const attendanceStatus = selectedRadio ? selectedRadio.value : "I will attend";
//         const guestMessage = rsvpMessageInput ? rsvpMessageInput.value.trim() : "";

//         // ඔබ සකස් කරගත් Google Apps Script Web App URL එක
//         const scriptURL = "https://script.google.com/macros/s/AKfycbx29zu3BX2cJjlJW6DdVktkIt6SV3t4NXqODKGomSAC519NKos2K4nsXqD_z48lXbEf/exec";
        

//         const formData = new FormData();
//         formData.append("Name", guestName);
//         formData.append("Status", attendanceStatus);
//         formData.append("Message", guestMessage);

//         rsvpConfirmBtn.textContent = "Submitting...";
//         rsvpConfirmBtn.disabled = true;
//                     fetch(scriptURL, { 
//                         method: 'POST', 
//                         mode: 'no-cors', // CORS බ්ලොක් වීම වළක්වයි
//                         body: formData 
//                     })
//                     .then(response => {
//                         alert("Thank you! Your response has been saved successfully.");
//                         if (rsvpModal) rsvpModal.classList.remove('show');
//                         rsvpConfirmBtn.textContent = "Confirm";
//                         rsvpConfirmBtn.disabled = false;
//                     })
//                     .catch(error => {
//                         console.error('Error!', error.message);
//                         alert("Something went wrong. Please try again.");
//                         rsvpConfirmBtn.textContent = "Confirm";
//                         rsvpConfirmBtn.disabled = false;
//                     });
//     });
// }

// // ඔබගේ අලුත් Wishes Google Sheet එකේ Web App URL එක මෙතැනට දෙන්න
// const WISHES_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTiHrKxIo0vlDo_WZz0RfFAbHbC5tTyyCkUpaomB0-89XtW68993sBTMwe8fTrNn5uFg/exec';
// fetch(WISHES_SCRIPT_URL)
//     .then(response => response.json())

//     fetchWishes();


// // Hidden Form එක හරහා දත්ත යැවීමේ Global Function එක
// function submitWish() {
//     const nameInput = document.getElementById('guest-name');
//     const wishInput = document.getElementById('guest-wish');
//     const submitBtn = document.getElementById('submit-wish-btn');
    
//     const name = nameInput ? nameInput.value : 'Guest';
//     const message = wishInput ? wishInput.value.trim() : '';
    
//     if (!message) {
//         alert('Please enter your wish before sending!');
//         return;
//     }
    
//     submitBtn.disabled = true;
//     submitBtn.innerText = 'Sending...';
    
//     // Hidden form එකට දත්ත ඇතුළත් කර Submit කිරීම
//     document.getElementById('form-name').value = name;
//     document.getElementById('form-message').value = message;
//     document.getElementById('hidden-wish-form').submit();
    
//     setTimeout(() => {
//         alert('Thank you for your wonderful wish!');
//         wishInput.value = '';
//         submitBtn.disabled = false;
//         submitBtn.innerText = 'Send Wishes';
//         fetchWishes();
//     }, 2000);
// }

// function fetchWishes() {
//     const container = document.getElementById('wishes-container');
//     if (!container) return;
    
//     fetch(WISHES_SCRIPT_URL)
//         .then(response => response.json())
//         .then(data => {
//             container.innerHTML = '';
            
//             if (data.result === 'success' && data.wishes && data.wishes.length > 0) {
//                 data.wishes.forEach(wish => {
//                     const wishElement = document.createElement('div');
//                     wishElement.className = 'wish-item';
//                     wishElement.innerHTML = `
//                         <div class="wish-header">
//                             <span class="wish-author">${escapeHtml(wish.name)}</span>
//                             <span>${wish.date}</span>
//                         </div>
//                         <div class="wish-body">${escapeHtml(wish.message)}</div>
//                     `;
//                     container.appendChild(wishElement);
//                 });
//             } else {
//                 container.innerHTML = `
//                     <div class="no-wishes-message" style="text-align: center; padding: 20px; color: #d4af37;">
//                         No message yet. Be the first to send message! ❤️
//                     </div>
//                 `;
//             }
//         })
//         .catch(error => {
//             console.error('Error loading wishes:', error);
//             container.innerHTML = `
//                 <div class="no-wishes-message" style="text-align: center; padding: 20px; color: #d4af37;">
//                     No message yet. Be the first to send message! ❤️
//                 </div>
//             `;
//         });
// }

// function escapeHtml(text) {
//     const div = document.createElement('div');
//     div.innerText = text;
//     return div.innerHTML;
// }

// // Make functions accessible to HTML buttons
// window.submitWish = submitWish;
// window.fetchWishes = fetchWishes;

// });