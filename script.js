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
    // Direct list of available images - simpler and more reliable
    const imageFiles = [
        'images/1.jpeg',
        'images/2.jpeg', 
        'images/3.jpeg',
        'images/4.png',
        'images/5.jpeg',
        'images/6.jpeg',
        'images/7.jpeg'
    ];
    
    // Verify each image exists and add to available images
    for (const imagePath of imageFiles) {
        if (await imageExists(imagePath)) {
            availableImages.push(imagePath);
        }
    }
    
    totalImages = availableImages.length;
    console.log(`Found ${totalImages} images:`, availableImages);
    
    if (totalImages > 0) {
        createImageSlides();
    } else {
        console.log('No images found, using placeholders');
        createPlaceholderImages();
    }
}

// Check if image exists
function imageExists(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            console.log(`Image exists: ${src}`);
            resolve(true);
        };
        img.onerror = () => {
            console.log(`Image not found: ${src}`);
            resolve(false);
        };
        // Add a timeout to prevent hanging
        setTimeout(() => {
            console.log(`Image check timeout: ${src}`);
            resolve(false);
        }, 5000);
        img.src = src;
    });
}

// Create slides with actual images
function createImageSlides() {
    console.log('Creating slides for images:', availableImages);
    
    availableImages.forEach((imagePath, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
            background: #f0f0f0;
        `;
        img.alt = `Birthday photo ${index + 1}`;
        
        // Add loading placeholder
        img.onload = () => {
            console.log(`Successfully loaded image: ${imagePath}`);
            slide.style.background = 'none';
        };
        
        img.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
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
    
    console.log(`Created ${availableImages.length} image slides`);
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
    console.log('Starting celebration...');
    console.log(`Total images available: ${totalImages}`);
    
    // Update birthday message with friend's name and special highlighting
    const nameHighlighted = `<span class="highlight-name">${friendName.toUpperCase()}</span>`;
    birthdayMessage.innerHTML = `HAPPY BIRTHDAY TO YOU, ${nameHighlighted}! 🎂`;
    
    // Switch screens
    landingScreen.classList.remove('active');
    setTimeout(() => {
        celebrationScreen.classList.add('active');
        startSlideshow();
        createConfetti();
        createBirthdayDecorations();
        playAudio();
    }, 800);
}

// Slideshow Functions
function startSlideshow() {
    console.log(`Starting slideshow with ${totalImages} images`);
    if (totalImages > 1) {
        slideInterval = setInterval(nextSlide, 3000); // 3 seconds per slide
    } else if (totalImages === 1) {
        console.log('Only one image available, no slideshow needed');
    } else {
        console.log('No images available for slideshow');
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) {
        console.log('No slides found');
        return;
    }
    
    console.log(`Moving from slide ${currentSlide} to next slide`);
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % totalImages;
    slides[currentSlide].classList.add('active');
    console.log(`Now showing slide ${currentSlide}`);
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

// Birthday Decorations
function createBirthdayDecorations() {
    createSparkles();
    createFireworks();
    createFloatingHearts();
    createBirthdayCakes();
    createPartyHats();
}

function createSparkles() {
    const sparkleCount = 15;
    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            confettiContainer.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 4000);
        }, i * 200);
    }
}

function createFireworks() {
    const fireworkCount = 20;
    for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.animationDelay = Math.random() * 3 + 's';
            firework.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            confettiContainer.appendChild(firework);
            
            setTimeout(() => {
                if (firework.parentNode) {
                    firework.parentNode.removeChild(firework);
                }
            }, 6000);
        }, i * 300);
    }
}

function createFloatingHearts() {
    const heartCount = 10;
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '💖';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.bottom = '0px';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            
            confettiContainer.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 8000);
        }, i * 600);
    }
}

function createBirthdayCakes() {
    const cakeCount = 5;
    for (let i = 0; i < cakeCount; i++) {
        setTimeout(() => {
            const cake = document.createElement('div');
            cake.className = 'birthday-cake';
            cake.textContent = '🎂';
            cake.style.left = Math.random() * 90 + '%';
            cake.style.top = Math.random() * 80 + '%';
            cake.style.animationDelay = Math.random() * 2 + 's';
            
            confettiContainer.appendChild(cake);
            
            setTimeout(() => {
                if (cake.parentNode) {
                    cake.parentNode.removeChild(cake);
                }
            }, 10000);
        }, i * 1000);
    }
}

function createPartyHats() {
    const hatCount = 3;
    for (let i = 0; i < hatCount; i++) {
        setTimeout(() => {
            const hat = document.createElement('div');
            hat.className = 'party-hat';
            hat.style.left = (20 + i * 30) + '%';
            hat.style.top = (10 + Math.random() * 20) + '%';
            hat.style.animationDelay = Math.random() * 2 + 's';
            
            confettiContainer.appendChild(hat);
            
            setTimeout(() => {
                if (hat.parentNode) {
                    hat.parentNode.removeChild(hat);
                }
            }, 12000);
        }, i * 1500);
    }
}

// Enhanced Confetti Animation
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#ff9800', '#9c27b0'];
    
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            // Random shapes
            const shapes = ['rect', 'circle', 'triangle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.borderLeft = '5px solid transparent';
                confetti.style.borderRight = '5px solid transparent';
                confetti.style.borderBottom = `10px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
                confetti.style.background = 'transparent';
            }
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 6000);
        }, i * 80);
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