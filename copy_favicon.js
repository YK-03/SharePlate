const fs = require('fs');
const path = require('path');

const src = 'C:/Users/Asus/.gemini/antigravity/brain/40e6ceb7-3ca9-461a-b7cd-6ac58a1752df/uploaded_image_1766741526884.png';
const destDir = 'd:/SharePlate_Final/shareplate_final/shareplate_frontend/public';
const dest = path.join(destDir, 'favicon.png');
const old = path.join(destDir, 'favicon.ico');

try {
    console.log('Copying from', src, 'to', dest);
    fs.copyFileSync(src, dest);
    console.log('Copy success!');

    if (fs.existsSync(old)) {
        console.log('Removing old favicon');
        fs.unlinkSync(old);
        console.log('Remove success!');
    }
} catch (e) {
    console.error('Error:', e);
}
