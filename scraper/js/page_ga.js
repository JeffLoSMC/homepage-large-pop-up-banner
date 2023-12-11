function ga_homemenu(ga_sMenuName) {	
	if (jQuery('body').hasClass('index')) {		
		ga('send', 'event', 'Home', 'Menu | Click', ga_sMenuName);
	}
}

function ga_homemenu_impression(ga_sMenuName) {	
	if (jQuery('body').hasClass('index')) {		
		ga('send', 'event', 'Home', 'Menu | View', ga_sMenuName);
	}
}

function ga_homeproduct(ga_sProductName) {	
	if (jQuery('body').hasClass('index')) {		
		ga('send', 'event', 'Home', 'Content | Click', ga_sProductName);
	}
}

function ga_iphonemenu(ga_sCategory) {
	if (jQuery('body').hasClass('iphone')) {		
		ga('send', 'event', 'Iphone', 'Menu | Click', ga_sCategory);
	}
}

function ga_accessoryfilter(ga_sFilterparamName) {
	if (jQuery('body').hasClass('accessories-list')) {		
		ga('send', 'event', 'Accessories', 'TopButton | Click', ga_sFilterparamName);
	}
}

function ga_productlivechat() {	
	ga('send', 'event', 'Product', 'Button | Click', 'LiveChat');
}

function ga_login(ga_sField) {	
	ga('send', 'event', 'SignIn', 'Field | Click', ga_sField);
}

function ga_addproduct(ga_productcode,ga_name,ga_cat,ga_brand,ga_variant,ga_price,ga_quantity,ga_hasgiftwrapping) {
	//console.log (ga_productcode + " " + ga_name + " " + ga_cat + " " + ga_brand + " " + ga_variant + " " + ga_price + " " + ga_quantity + " " + ga_hasgiftwrapping);
	try {		
		ga('set','dimension1','N');
		ga('ec:addProduct', {
			'id': ga_productcode,
			'name': ga_brand+' '+ga_name,
			'category': ga_cat,
			'brand': ga_brand,
			'variant': ga_variant,
			'price': ga_price,
			'quantity': ga_quantity,
			'dimension1':ga_hasgiftwrapping
		});
	} catch (err) {
	}
}

function ga_addproductwithposition(ga_productcode,ga_name,ga_cat,ga_brand,ga_variant,ga_price,ga_quantity,ga_hasgiftwrapping,ga_list_position) {
	try {		
		ga('set','dimension1','N');
		ga('ec:addProduct', {
			'id': ga_productcode,
			'name': ga_brand+' '+ga_name,
			'category': ga_cat,
			'brand': ga_brand,
			'variant': ga_variant,
			'price': ga_price,
			'quantity': ga_quantity,
			'position':ga_list_position,
			'dimension1':ga_hasgiftwrapping
		});
	} catch (err) {
	}
}

function FindGAPrice(ga_jsonItem) {
	/*
	discounted_price > oam_price > osa_price > online_price > retail_price
	*/
	var iPrice = ga_jsonItem.retail_price;
	try {
		if (ga_jsonItem.discounted_price != -1) {
			iPrice = ga_jsonItem.discounted_price;
		} else {
			if (ga_jsonItem.oam_price != -1) {
				iPrice = ga_jsonItem.oam_price;
			} else {
				if (ga_jsonItem.osa_price != -1) {
					iPrice = ga_jsonItem.osa_price;
				} else {
					if (ga_jsonItem.online_price != -1) {
						iPrice = ga_jsonItem.online_price;
					} else {
						iPrice = ga_jsonItem.retail_price;
					}
				}
			}
		}
	} catch (err) {
		iPrice = (ga_jsonItem.discounted_price != -1)?ga_jsonItem.discounted_price:(ga_jsonItem.online_price != -1)?ga_jsonItem.online_price:ga_jsonItem.retail_price;
	}

	return iPrice;
}

function FindGACat(ga_jsonProduct) {
	var ga_allcats = ga_jsonProduct.type;
	var ga_cat = '';
	if (ga_jsonProduct.ga_type=='accessory') {
		ga_cat = 'Accessory';
		for (var j = 0; j < ga_allcats.length; j++) {
			if (ga_cat != '') ga_cat += '_';
			ga_cat += ga_allcats[j].cat_name_eng;
		}
	} else if (ga_jsonProduct.ga_type=='handset') {
		ga_cat = 'Handset';
	} else if (ga_jsonProduct.ga_type=='prepaid') {
		ga_cat = 'Prepaid';				
	} else {
		ga_cat = ga_jsonProduct.ga_type;
	}
	return ga_cat;
}

function fb_addProduct(ga_jsonProduct, sTrackLabel) {
	try {
		var ga_jsonaryItems = ga_jsonProduct.items;
		var ga_jsonItem = ga_jsonaryItems[0];

		fbq('track', sTrackLabel, {
		  'content_name': ga_jsonItem.brand_name_eng + " " + ga_jsonItem.group_title_eng,
		  'content_category': FindGACat(ga_jsonProduct),
		  'content_ids': ga_jsonItem.product_code,
		  'content_type': 'product',
		  'value': FindGAPrice(ga_jsonItem),
		  'currency': 'HKD'
		 });
	} catch (err) {
	}
}

function ga_addtocart(ga_jsonProduct, ga_sSelectedProductCode, ga_jsonPremiums) {
	try {
		var ga_jsonaryItems = ga_jsonProduct.items;
		if (!ga_jsonProduct.ga_type) ga_jsonProduct.ga_type = '';
		for (var i = 0; i < ga_jsonaryItems.length; i++) {
			var ga_jsonItem = ga_jsonaryItems[i];
			if (ga_jsonProduct.ga_type!='prepaid' && ga_sSelectedProductCode != ga_jsonItem.product_code) continue;
			var ga_color = ga_jsonItem.color;
			var ga_price = FindGAPrice(ga_jsonItem);
			
			var ga_cat = FindGACat(ga_jsonProduct);
			
			var ga_size = ga_jsonItem.size || '';
			
			ga_addproduct(ga_jsonItem.product_code,ga_jsonItem.group_title_eng,ga_cat,ga_jsonItem.brand_name_eng,ga_color[0].color_name_eng + ((ga_size != '')?' '+ga_size:''),ga_price,1,'N');
			
			// premium
			if (ga_jsonPremiums) {
				try {
					var ga_selectedpremiums = JSON.parse(jQuery('#premium_hidden_value').val());
					var ga_offersetting = ga_jsonPremiums.offersetting;

					// screen replace
					var ga_screen = ga_selectedpremiums.screen;
					if (ga_screen != null) {
						ga_addproduct(ga_screen.code,"Screen Replace",'Screen Replace','SmarTone',ga_screen.price_list,ga_screen.price_list,1,'N');
					}
					
					// required
					var ga_required = ga_selectedpremiums.required;
					if (ga_required != null) {
						for (ga_req_key in ga_required) {
							var ga_premiumproduct = ga_required[ga_req_key];
							if (ga_premiumproduct == '') continue;
							var ga_premiumItem = ga_jsonPremiums[ga_premiumproduct];
							
							var premiumprice = "0";
							try {
								premiumprice = ga_offersetting[pprice_key];
							} catch (err) {
								premiumprice = "0";
							}
							
							ga_addproduct(ga_premiumItem.product_code,ga_premiumItem.group_title_eng,'Premium','','',premiumprice,1,'N');
						}
					}
					
					// optional
					var ga_optaional = ga_selectedpremiums.optional;
					if (ga_optaional != null) {
						for (ga_opt_key in ga_optaional) {
							var ga_premiumproduct = ga_optaional[ga_opt_key];
							if (ga_premiumproduct == '') continue;
							var ga_premiumItem = ga_jsonPremiums[ga_premiumproduct];
							
							var premiumprice = "0";
							try {
								premiumprice = ga_offersetting[ga_opt_key];
							} catch (err) {
								premiumprice = "0";
							}
							
							ga_addproduct(ga_premiumItem.product_code,ga_premiumItem.group_title_eng,'Premium','','',premiumprice,1,'N');
						}
					}
				} catch (err) {
				}
			}
			
			ga('ec:setAction', 'add');
			ga('send', 'event', 'UX', 'click', 'add to cart');			
			
			// Call FB product
			fb_addProduct(ga_jsonProduct, 'AddToCart');
		}
	} catch (err) {
	} 
}

function ga_formAddProduct_helper(ga_item, ga_giftcase, bBundle) {
	var sProductName = ga_item.ga_product_name;
	if (bBundle) {
		sProductName += " - Reservation";
	} else {
		try {
			if (ga_item.ga_pricelist == "OCC") {
				sProductName += " - Super Deal";
			} else {
				if (ga_item.ga_pricelist == "CCP") {
					sProductName += " - Existing Customer Price";
				} else {
					if (ga_item.ga_pricelist == "SP3") {
						sProductName += " - PP Price";
					} else {
						// sProductName += " - " + ga_item.ga_pricelist;
						sProductName += "";
					}
				}
			}
		} catch (err) {
		}
	}
	
	ga_addproduct(ga_item.ga_product_code,sProductName,ga_item.ga_cat,ga_item.ga_brand_name,ga_item.ga_color_name,((bBundle) ? 300 : ga_item.ga_price),1,ga_giftcase);

	if (ga_item.type == "handset") {
		try {
			// Screen Replace
			if (ga_item.ga_scrnrpl_title_eng != "") {
				ga_addproduct(ga_item.ga_scrnrpl,"Screen Replace",'Screen Replace','SmarTone',ga_item.ga_scrnrpl_price,ga_item.ga_scrnrpl_price,1,'N');
			}
		} catch (err) {
		}

		try {
			var ga_premiums = ga_item.ga_premiums;
			if (ga_premiums != null) {
				for (i=0;i<ga_premiums.length;i++) {
					ga_addproduct(ga_premiums[i].ga_code,ga_premiums[i].ga_title,'Premium','','',ga_premiums[i].ga_price,1,'N');
				}
			}
		} catch (err) {
		}
	}
}
function ga_removefromcart(ga_jsonCart, ga_selectedCaseid) {
	try {
		var ga_items = ga_jsonCart.items;
		for (var i = 0; i < ga_items.length; i++) {
			var ga_item = ga_items[i];	
			var ga_caseid = ga_item.case_id;
			if (ga_caseid != ga_selectedCaseid) continue;

			var ga_gift = jQuery('input[name="w['+ga_caseid+']"]')[0];
			var ga_giftcase = (ga_gift && ga_gift.checked)?'Y':'N';

			ga_formAddProduct_helper(ga_item, ga_giftcase, false);
			
			ga('ec:setAction', 'remove');

			ga('send', 'event', 'UX', 'click', 'remove from cart');
		}		
	} catch (err) {
	}
}

function ga_checkout(ga_jsonCart) {
	try {
		var ga_items = ga_jsonCart.items;
		for (var i = 0; i < ga_items.length; i++) {
			var ga_item = ga_items[i];	
			var ga_caseid = ga_item.case_id;
			var ga_gift = jQuery('input[name="w['+ga_caseid+']"]')[0];
			var ga_giftcase = (ga_gift && ga_gift.checked)?'Y':'N';
			
			ga_formAddProduct_helper(ga_item, ga_giftcase, false);
		}
		ga('ec:setAction','checkout', {'step': 1,});
		ga('send', 'pageview');
	} catch (err) {
	}
}


function ga_delivery(ga_sShopCode) {
	try {
		var ga_sDelivery = 'delivery';
		
		if (ga_sShopCode != 'WHS') ga_sDelivery = 'shop';

		ga('ec:setAction','checkout', {'step': 2,});
		ga('send', 'pageview');	
		
		ga('ec:setAction', 'checkout_option', {
			'step': 2,
			'option': ga_sDelivery
		});
		ga('send', 'event', 'Checkout', 'Option', {
			hitCallback: function() {
			}
		});			
	} catch (err) {
		ga_error('Checkout_Step2',ga_sShopCode);
	}
}

function ga_contact() {
	try {
		ga('ec:setAction','checkout', {'step': 3,});
		ga('send', 'pageview');
	} catch (err) {
	}
}

function ga_completeorder(ga_jsonCart) {
	try {
		var sProductCodeList = new Array();
		
		// shipping
		var ga_charges = ga_jsonCart.order_charges;
		var ga_shipping = "0";
		try {
			ga_shipping = ga_charges.delivery_charge;
			if (ga_shipping == "") ga_shipping = "0";
		} catch (err) {
			ga_shipping = "0";
		}
		
		var ga_giftwrap = "0";
		try {
			ga_giftwrap = ga_charges.gift_charge;
			if (ga_giftwrap == "") ga_giftwrap = "0";
		} catch (err) {
			ga_giftwrap = "0";
		}
		
		// credit
		var ga_credit = ga_charges.credits || 'N';
		
		// discount
		var ga_iDiscount = 0.0;
		var ga_sDiscountList = '';
		var ga_jsonaryDiscountList = ga_charges.discount_list;
		for (var i = 0; i < ga_jsonaryDiscountList.length; i++) {
			var ga_discountitem = ga_jsonaryDiscountList[i];
			ga_iDiscount += Number(ga_discountitem.discount_amt);
			ga_sDiscountList += ga_discountitem.discount_desc_eng + '|';
		}
		
		// total
		var ga_total = '';
		var ga_iTotal = 0.0;
		var ga_jsonaryCalculation = ga_jsonCart.calculation;
		for (var i = 0; i < ga_jsonaryCalculation.length; i++) {
			var ga_calculation = ga_jsonaryCalculation[i];
			ga_iTotal += ga_calculation.all_total;
		}		
		ga_total = ga_iTotal.toString();
		
		// coupon
		var ga_coupon = ga_jsonCart.promotion_codes;
		
		// reserve
		var ga_bHandsetReserve = false;
		
		var ga_iScreenReplace = 0;
		
		var ga_gift = ga_jsonCart.giftwrap;	
		var ga_items = ga_jsonCart.items;
		for (var i = 0; i < ga_items.length; i++) {
			var ga_item = ga_items[i];	
			var ga_caseid = ga_item.case_id;
			var ga_giftcase = (ga_gift != null && ga_gift[ga_caseid] == '')?'Y':'N';
			ga_bHandsetReserve = (ga_item.type == 'handset' && ga_jsonCart.isBundle);
			
			// screen replace
			if (ga_item.type == 'handset') {
				try {
					if (ga_item.ga_scrnrpl_title_eng != "") {
						ga_iScreenReplace += parseInt(ga_item.ga_scrnrpl_price);
					}
				} catch (err) {
				}
			}
			
			ga_formAddProduct_helper(ga_item, ga_giftcase, ga_bHandsetReserve);
			
			sProductCodeList[sProductCodeList.length] = ga_item.ga_product_code;
		}		
		
		var ga_orderid = ga_jsonCart.order_id + ((ga_bHandsetReserve)?"_R":"");
		
		var sRevenue = ga_total;
		if (ga_bHandsetReserve) {
			sRevenue = "300";
		} else {
			try {
				sRevenue = (parseInt(ga_total) - ga_iDiscount + parseInt(ga_shipping) + parseInt(ga_giftwrap) + ga_iScreenReplace).toString();
			} catch (err) {
				sRevenue = ga_total;
			}
		}
		
		ga('ec:setAction', 'purchase', {
			'id': ga_orderid,
			'revenue': sRevenue,
			'shipping': ga_shipping,
			'coupon': ga_coupon
		});
		ga('set','dimension4',ga_sDiscountList);
		ga('set','dimension5',ga_credit);
		
		// DA-31, check eComType
		ga('set', 'dimension8', 'OnlineStore');
		
		ga('send', 'pageview');		
		
		// reservation
		if (ga_bHandsetReserve) ga_vpv('/bookAppointment/thankyou');
		
		// FB Complete Order
		//console.log (sProductCodeList);
		var sCodeList = "[";
		for (i=0;i<sProductCodeList.length;i++) {
			if (sCodeList != "[") sCodeList += ",";
			sCodeList += "'" + sProductCodeList[i] + "'";
		}
		sCodeList += "]";
		//console.log (sCodeList);
		try {
			fbq('track', 'Purchase', {
			  'content_ids': sProductCodeList,
			  'content_type': 'product',
			  'value': sRevenue,
			  'currency': 'HKD'
			 });
		} catch (err) {
			console.log (err);
		}
	} catch (err) {
	}
}

function ga_promotion(ga_sID,ga_sName,ga_sCreative,ga_sPosition) {
	try {
		ga('ec:addPromo', {
			'id': ga_sID,
			'name': ga_sName,
			'creative': ga_sCreative || "",
			'position': ga_sPosition || ""
		});
		
		ga('ec:setAction', 'promo_click');
		ga('send', 'event', 'Internal Promotions', 'click',ga_sName);
	} catch (err) {
	}
}

function ga_addtocart_combo(ga_aryComboProduct) {
	try {
		var ga_comboVal = jQuery('input[name=comboSelectValue]');
		if (!ga_comboVal) return;
		var ga_comboSelected = ga_comboVal.val();
		var ga_aryCombo = ga_comboSelected.split('|');
		for (var i = 0; i < ga_aryCombo.length; i++) {
			if (ga_aryCombo[i] == '') continue;
			var ga_aryComboSplit = ga_aryCombo[i].split('-');
			if (ga_aryComboSplit.length != 2) continue;
			var ga_comboProductCode = ga_aryComboSplit[1];
			var ga_products = ga_aryComboProduct[i].groups;
			for (var j = 0; j < ga_products.length; j++) {
				var ga_aryItem = ga_products[j].items;
				for (var k = 0; k < ga_aryItem.length; k++) {
					var ga_productcode = ga_aryItem[k].product_code;
					if (ga_comboProductCode != ga_productcode) continue;
					else {
						ga_addtocart(ga_products[j], ga_comboProductCode, null);
						break;
					}
				}
			}
			
		}
	} catch (err) {
	}
}

function ga_error(ga_sErrorCat,ga_sErrorLabel) {
	try {
		ga('send', 'event', ga_sErrorCat, 'Error', ga_sErrorLabel);
	} catch (err) {
	}
}

function ga_vpv(ga_sPage) {
	try {
		var ga_sLang = ga_lang() || 'tc';
		var ga_url = '/' + ga_sLang + ga_sPage;
		ga('send', 'pageview', ga_url);
	} catch (err) {
	}
}

function ga_virtual(ga_sPage) {
	try {
		var ga_sLang = ga_lang() || 'tc';
		var ga_url = '/' + ga_sLang + ga_sPage;
		ga('send', 'pageview', "/virtual" + ga_url);
	} catch (err) {
	}
}

function ga_lang() {
	var ga_sLang = '';
	try {
		var sURL = window.location.href;
		if (sURL.indexOf('/en/') != -1 ||  sURL.indexOf('/en/') != -1) ga_sLang = 'en';
		else ga_sLang = 'tc';
	} catch (err) {
	}
	return ga_sLang;
}

function ga_product_view(ga_jsonProduct, ga_sSelectedProductCode) {
	try {
		var ga_jsonaryItems = ga_jsonProduct.items;
		if (!ga_jsonProduct.ga_type) ga_jsonProduct.ga_type = '';
		for (var i = 0; i < ga_jsonaryItems.length; i++) {
			var ga_jsonItem = ga_jsonaryItems[i];
			if (ga_jsonProduct.ga_type!='prepaid' && ((ga_sSelectedProductCode == '' && i != 0) || (ga_sSelectedProductCode != '' &&ga_sSelectedProductCode != ga_jsonItem.product_code))) continue;
			var ga_color = ga_jsonItem.color;
			var ga_price = FindGAPrice(ga_jsonItem);;
						
			var ga_cat = FindGACat(ga_jsonProduct);
			
			var ga_size = ga_jsonItem.size || '';
			
			ga_addproduct(ga_jsonItem.product_code,ga_jsonItem.group_title_eng,ga_cat,ga_jsonItem.brand_name_eng,ga_color[0].color_name_eng + ((ga_size != '')?' '+ga_size:''),ga_price,1,'N');
			
			ga('ec:setAction', 'detail');
			ga('send', 'pageview'); 		
		}
	} catch (err) {
	} 
}

var ga_aryAppendProductList = {};

function ga_product_list(ga_aryListProduct,ga_iStartIndex,ga_sListName) {
	try {
		if (ga_sListName == undefined) ga_sListName = 'accessory_main';
		for (var i = 0; i < ga_aryListProduct.length; i++) {
			var ga_jsonGroup = ga_aryListProduct[i];
			var ga_jsonaryitems = ga_jsonGroup.items;
			for (var j = 0; j < ga_jsonaryitems.length; j++) {
				var ga_jsonItem = ga_jsonaryitems[j];
				
				var ga_color = ga_jsonItem.color;
							
				var ga_allcats = ga_jsonGroup.type;
				var ga_cat = '';
				if (ga_sListName=='accessory_main') {
					ga_cat = 'Accessory';
					for (var k = 0; k < ga_allcats.length; k++) {
						if (ga_cat != '') ga_cat += '_';
						ga_cat += ga_allcats[k].cat_name_eng;
					}
				} else {
					ga_cat = '';
				}
			
				var ga_size = ga_jsonItem.size || '';								
				
				// send impression
				ga_addimpression(ga_jsonItem.product_code,ga_jsonItem.group_title_eng,ga_cat,ga_jsonItem.brand_name_eng,ga_color[0].color_name_eng + ((ga_size != '')?' '+ga_size:''),ga_sListName,ga_iStartIndex);				
			}
			ga_aryAppendProductList[ga_iStartIndex] = ga_jsonGroup;
			ga_iStartIndex++;
		}
		
		ga('send', 'pageview'); 
	} catch (err) {
	}
}

function ga_addimpression(ga_productcode,ga_name,ga_cat,ga_brand,ga_variant,ga_list,ga_list_position) {
	try {
		ga('ec:addImpression', {
		  'id': ga_productcode,
		  'name': ga_brand + ' ' + ga_name,
		  'category': ga_cat,
		  'brand': ga_brand,
		  'variant': ga_variant,
		  'list': ga_list,
		  'position': ga_list_position
		});
	} catch (err) {
	}	
}

function ga_productclickbylist(ga_sListName, ga_list_position, ga_callback) {
	try {
		if (ga_list_position == undefined || ga_aryAppendProductList[ga_list_position] == undefined) return;
		
		var ga_jsonProduct = ga_aryAppendProductList[ga_list_position];
		ga_productclick(ga_jsonProduct, ga_sListName, ga_list_position, ga_callback);
	} catch (err) {
	}
}

function ga_productclick(ga_jsonProduct, ga_sListName, ga_list_position, ga_callback) {
	try {
		var ga_jsonaryItems = ga_jsonProduct.items;
		if (!ga_jsonProduct.ga_type) ga_jsonProduct.ga_type = '';
		for (var i = 0; i < ga_jsonaryItems.length; i++) {
			var ga_jsonItem = ga_jsonaryItems[i];
			var ga_color = ga_jsonItem.color;
			var ga_price = FindGAPrice(ga_jsonItem);
						
			var ga_cat = FindGACat(ga_jsonProduct);
			
			var ga_size = ga_jsonItem.size || '';
			
			ga_addproductwithposition(ga_jsonItem.product_code,ga_jsonItem.group_title_eng,ga_cat,ga_jsonItem.brand_name_eng,ga_color[0].color_name_eng + ((ga_size != '')?' '+ga_size:''),ga_price,1,'N',ga_list_position);
		}
		ga('ec:setAction', 'click', {list: ga_sListName});

		ga('send', 'event', 'UX', 'click', 'Results', {
			hitCallback: ga_callback
		});
	} catch (err) {
	}
}

function ga_event(ga_sEventCat,ga_sEventAction,ga_sEventLabel) {
	ga('send', 'event', ga_sEventCat, ga_sEventAction, ga_sEventLabel);
}