# Birthday Celebration Website

A beautiful, responsive birthday celebration website with animations, slideshow, and music.

## How to Use

### 1. Upload Your Images
- Create an `images` folder in the root directory (if it doesn't exist)
- Upload your birthday photos to the `images` folder
- Supported formats: JPG, JPEG, PNG, GIF, WEBP
- Supported naming patterns:
  - `1.jpg`, `2.jpg`, `3.jpg`, etc.
  - `image1.jpg`, `image2.jpg`, etc.
  - `photo1.jpg`, `photo2.jpg`, etc.
  - `01.jpg`, `02.jpg`, `03.jpg`, etc.
  - `image01.jpg`, `image02.jpg`, etc.

### 2. Upload Your Song (Optional)
- Upload your birthday song as `song.mp3` in the root directory
- If no song is uploaded, the website will work without music

### 3. Customize the Name
- Open `script.js`
- Change the `friendName` variable at the top to your friend's name
- Example: `const friendName = "SARAH";`

### 4. Deploy
- The website is ready to deploy to any static hosting service
- Recommended: Netlify, Vercel, GitHub Pages

## File Structure
```
project/
├── index.html
├── style.css
├── script.js
├── package.json
├── song.mp3 (your uploaded song)
└── images/
    ├── 1.jpg (your uploaded photos)
    ├── 2.jpg
    ├── 3.jpg
    └── ...
```

## Features
- ✨ Responsive design for all screen sizes
- 🎈 Animated balloons and confetti
- 🖼️ Automatic slideshow of your photos
- 🎵 Background music support
- 📱 Mobile-friendly interface
- 🎨 Beautiful gradient animations

## Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes
- The website automatically detects your uploaded images
- If no images are found, it will show placeholder slides
- Music autoplay may be blocked by browsers - users can click the music button
- All animations are optimized for performance