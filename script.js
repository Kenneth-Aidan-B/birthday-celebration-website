// Configuration
const friendName = "HARISH"; // Change this to your friend's name

// DOM Elements
const landingScreen = document.getElementById('landing-screen');
const celebrationScreen = document.getElementById('celebration-screen');
const startBtn = document.getElementById('start-btn');
const birthdayMessage = document.getElementById('birthday-message');
const slideshow = document.getElementById('slideshow');
const confettiContainer = document.getElementById('confetti-container');
const birthdayAudio = document.getElementById('birthday-song');

// State
let currentSlide = 0;
let slideInterval;
let availableImages = [];
let totalImages = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    detectAvailableImages();
});

// Event Listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startCelebration);
}

// Detect available images in the images folder
async function detectAvailableImages() {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const maxImages = 50; // Check up to 50 images
    
    // Common naming patterns to check
    const namingPatterns = [
        (i) => `${i}`, // 1, 2, 3...
        (i) => `image${i}`, // image1, image2...
        (i) => `photo${i}`, // photo1, photo2...
        (i) => `pic${i}`, // pic1, pic2...
        (i) => `img${i}`, // img1, img2...
        (i) => `${i.toString().padStart(2, '0')}`, // 01, 02, 03...
        (i) => `image${i.toString().padStart(2, '0')}`, // image01, image02...
        (i) => `photo${i.toString().padStart(2, '0')}`, // photo01, photo02...
    ];
    
    for (let i = 1; i <= maxImages; i++) {
        for (const pattern of namingPatterns) {
            for (const ext of imageExtensions) {
                const filename = `${pattern(i)}.${ext}`;
                const imagePath = `images/${filename}`;
                
                if (await imageExists(imagePath)) {
                    availableImages.push(imagePath);
                    break; // Found image for this number, move to next
                }
            }
            if (availableImages.length >= i) break; // Found image for this number
        }
    }
    
    totalImages = availableImages.length;
    
    if (totalImages > 0) {
        createImageSlides();
    } else {
        createPlaceholderImages();
    }
}

// Check if image exists
function imageExists(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

// Create slides with actual images
function createImageSlides() {
    availableImages.forEach((imagePath, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        `;
        img.alt = `Birthday photo ${index + 1}`;
        
        // Add loading placeholder
        img.onload = () => {
            slide.style.background = 'none';
        };
        
        img.onerror = () => {
            // Fallback to placeholder if image fails to load
            slide.style.background = `linear-gradient(45deg, 
                hsl(${(index * 25) % 360}, 70%, 60%), 
                hsl(${(index * 25 + 60) % 360}, 70%, 70%))`;
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2rem;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                font-weight: bold;
                text-align: center;
            `;
            overlay.textContent = `Photo ${index + 1}`;
            slide.appendChild(overlay);
        };
        
        slide.appendChild(img);
        
        if (index === 0) slide.classList.add('active');
        slideshow.appendChild(slide);
    });
}

// Create placeholder images for demo (fallback)
function createPlaceholderImages() {
    totalImages = 15; // Default fallback
    
    for (let i = 1; i <= totalImages; i++) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.background = `linear-gradient(45deg, 
            hsl(${(i * 25) % 360}, 70%, 60%), 
            hsl(${(i * 25 + 60) % 360}, 70%, 70%))`;
        
        // Add a number overlay for demo
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            font-weight: bold;
        `;
        overlay.textContent = `Photo ${i}`;
        slide.appendChild(overlay);
        
        if (i === 1) slide.classList.add('active');
        slideshow.appendChild(slide);
    }
}

// Start Celebration
function startCelebration() {
    // Update birthday message with friend's name
    birthdayMessage.textContent = `HAPPY BIRTHDAY TO YOU, ${friendName.toUpperCase()}! 🎂`;
    
    // Switch screens
    landingScreen.classList.remove('active');
    setTimeout(() => {
        celebrationScreen.classList.add('active');
        startSlideshow();
        createConfetti();
        playAudio();
    }, 800);
}

// Slideshow Functions
function startSlideshow() {
    if (totalImages > 1) {
        slideInterval = setInterval(nextSlide, 3000); // 3 seconds per slide
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % totalImages;
    slides[currentSlide].classList.add('active');
}

// Audio Functions
async function playAudio() {
    // Check if custom song exists
    const songExists = await checkAudioFile();
    
    if (songExists) {
        // Try to play audio (may be blocked by browser autoplay policy)
        birthdayAudio.play().catch(error => {
            console.log('Audio autoplay was prevented:', error);
            // Create a user interaction to enable audio
            createAudioButton();
        });
    } else {
        console.log('No song file found. Upload song.mp3 to the root directory to enable music.');
    }
}

// Check if audio file exists
function checkAudioFile() {
    return new Promise((resolve) => {
        const audio = new Audio();
        audio.oncanplaythrough = () => resolve(true);
        audio.onerror = () => resolve(false);
        audio.src = 'song.mp3';
    });
}

function createAudioButton() {
    const audioBtn = document.createElement('button');
    audioBtn.textContent = '🎵 Play Music';
    audioBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
        z-index: 20;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    audioBtn.addEventListener('click', () => {
        birthdayAudio.play();
        audioBtn.remove();
    });
    
    audioBtn.addEventListener('mouseenter', () => {
        audioBtn.style.transform = 'scale(1.05)';
    });
    
    audioBtn.addEventListener('mouseleave', () => {
        audioBtn.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(audioBtn);
}

// Confetti Animation
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 100);
    }
}

// Utility Functions
function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopSlideshow();
});