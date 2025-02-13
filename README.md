# SMT POPUP BANNER

## Setup for new task
- Create SMS task
- Create new branch from gitlab when new development is involved, not just regular updates
- Set SMS_ID in gulpfile.js:36
    - (e.g. SMS_ID = '53095')
- Rename/restructure files inside working_files to what you need (optional)
- Copy designer image to src/working_files/ (optional, if you want to access image from local)

## Getting start
- npm install
- npm run dev
- access http://localhost:3000/?env=53095/ (for example dev under SMS#53095)

## Deployment
- Create new campaign in ../JS_V3/storefront/constant/index.js
- Create GA tracking in ../JS_V3/storefront/components/banner/index.js
    - Impression event: triggers when banner is displayed
    - Click event: triggers when banner is clicked
- Update banner js files with new banner images and urls
    - defaultPopup.js for banner with ONLY ONE version
    - campaignPopupFirst.js and campaignPopupSecond.js for banner with TWO versions
- Update overlay_banner.js in ../JS_V3/storefront/overlay_banner.js
    - OVERLAYBANNER.initBanner() is used to render the banner
- *dist/<SMS ID>* contains all files for deployment
- Merge branch to master when complete the task

## Extra
- SASS styles for popup banner in ../CSS_V3/storefront/overlay_banner.sass
    - Used when needed to update any styles
- Images are saved in folder ../IMG_V4/popup_banner