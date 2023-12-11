var sCurURL = document.location.href;
var sSelected = "selected";
var sSelectedText = "selected-text";
var iMenuOrder = -1;
var iSubmenuOrder = -1;
//

var selectDesktopMenuItem = function(){
    var $menu = jQuery(".smt-header").find(".menu-list");
    var $menuItem = $menu.find("> ul > li > a");
    if (typeof $menuItem == "undefined" || $menuItem.length == 0){
        return;
    }
    $menu.find("li").removeClass(sSelected);
    $menuItem.each(function(i, e) {
        var $this = jQuery(e)        
        var sHref = $this.attr('href');
        var $item = $this.closest("li");
        //console.log("sHref|"+sHref+"|iMenuOrder|"+iMenuOrder+"|i|"+i);
        if (iMenuOrder == i){
            $item.addClass(sSelected);
            selectDesktopSubMenuItem($item);
            return false;
        }
        if (iMenuOrder<0){
            if (sCurURL.indexOf(sHref)>-1){                           
                $item.addClass(sSelected);
            }
            selectDesktopSubMenuItem($item);
        }
    })
}
var selectDesktopSubMenuItem = function($elem){    
    if (typeof $elem == "undefined" || $elem.length == 0){
        return;
    }
    var $menu = jQuery(".smt-header").find(".menu-list");
    var $subMenu = $elem.find(".sub-menu-wrapper");
    var $subMenuItem = $subMenu.find(".link-col > ul > li > a");
    $subMenuItem.each(function(i, e) {
        var $this = jQuery(e)
        var sHref = $this.attr('href');
        var $item = $this.closest("li");
        if (iSubmenuOrder == i){
            $item.addClass(sSelected);

            return false;
        }
        if (iSubmenuOrder<0){
            if (sCurURL.indexOf(sHref)>-1){
                $menu.find("li").removeClass(sSelected);
                $elem.addClass(sSelected); 
                $item.addClass(sSelected);
                return false;
            }
        }
    });
}
var selectMobileMenuItem = function(){
    var $menu = jQuery(".drawer-wrapper");
    var $menuItem = $menu.find(".item-box .top-row > a");
    if (typeof $menuItem == "undefined" || $menuItem.length == 0){
        return;
    }
    $menu.find(".item-box").removeClass(sSelected);
    $menu.find(".item-box").removeClass(sSelectedText);    
    $menu.find(".sub-menu").find("li").removeClass(sSelected);
    $menuItem.each(function(i, e) {
        var $this = jQuery(e)        
        var sHref = $this.attr('href');
        var $item = $this.closest(".item-box");
        //console.log("sHref|"+sHref+"|iMenuOrder|"+iMenuOrder+"|i|"+i);
        if (iMenuOrder == i){
            $item.addClass(sSelectedText);
            selectMobileSubMenuItem($item);
            return false;
        }
        if (iMenuOrder<0){
            if (sCurURL.indexOf(sHref)>-1){                
                //console.log("index|"+sCurURL.indexOf(sHref));
                $item.addClass(sSelectedText);
            }
            selectMobileSubMenuItem($item);
        }
    })
}
var selectMobileSubMenuItem = function($elem){
    if (typeof $elem == "undefined" || $elem.length == 0){
        return;
    }
    var $menu = jQuery(".drawer-wrapper");
    var $subMenu = $elem.find(".sub-menu");
    var $subMenuItem = $subMenu.find(".item-content > ul > li > a"); 

    $subMenuItem.each(function(i, e) {
        var $this = jQuery(e)
        var sHref = $this.attr('href');
        var $item = $this.closest("li");
        if (iSubmenuOrder == i){
            $item.addClass(sSelected);
            return false;
        }
        if (iSubmenuOrder<0){
            if (sCurURL.indexOf(sHref)>-1){
                $menu.find(".item-box").removeClass(sSelected);
                $menu.find(".item-box").removeClass(sSelectedText);   
                $elem.addClass(sSelectedText); 
                $item.addClass(sSelected);
                return false;
            }
        }
    })

}
jQuery(document).ready(function() {
    selectDesktopMenuItem();
    selectMobileMenuItem();
});
