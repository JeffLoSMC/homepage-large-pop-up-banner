### 1. Git checkout new branch

### 2. Set SMS task number for building workflow:

    /gulpfile.js:36
    (SMS_ID = '45984');
    ('M:\\' + SMS_ID + '\\'));

### 3. Run _npm run dev_

### 4. Access http://localhost:3000/?env=45984/ (for example dev under SMS#45984)

### 5. Create campaign id:

    \src\working_files\JS_V3\corpweb_script\constant\index.js

### 6. Create banner with template

    e.g ****\src\working_files\JS_V3\corpweb_script\components\banner\cmhk0.js

    Useful reusable functions:
    \src\working_files\JS_V3\corpweb_script\util\index.js
    \src\working_files\JS_V3\corpweb_script\modal\index.js

    Image folder:
    \src\working_files\IMG_V4\popup_banner

    Config CSS with "campaign id":
    \src\working_files\CSS_V3\corpweb_script\overlay_banner.sass

    Register event listener:
    \src\working_files\JS_V3\corpweb_script\components\banner\index.js

### 7. Create _relay42Callbacks_ for initialize banners:

    \src\working_files\JS_V3\corpweb_script\overlay_banner.js

### 8. Run _npm run deploy_ to deploy files 7a

### 9. Git merge branch
