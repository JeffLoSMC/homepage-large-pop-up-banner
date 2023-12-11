// implement JSON.stringify serialization
/**
 * @function
 */
JSON.stringify = JSON.stringify || function(obj) {
	var t = typeof(obj);
	if (t != "object" || obj === null) {
		// simple data type
		if (t == "string") obj = '"' + obj + '"';
		return String(obj);
	} else {
		// recurse array or object
		var n, v, json = [],
			arr = (obj && obj.constructor == Array);
		for (n in obj) {
			v = obj[n];
			t = typeof(v);
			if (t == "string") v = '"' + v + '"';
			else if (t == "object" && v !== null) v = JSON.stringify(v);
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

/** @namespace */
var ordering = ordering || {};
(function() {
	ordering.handset = {};
	ordering.selected = {};
	ordering.loaded = null;
	ordering.mode = 'add';
	ordering.isLoaded = false;
	ordering.isValidate = false;
	//ordering.loaded = null;
	ordering.isUpdating = false;
	ordering.validateCount = 0;
	
	ordering.procress = null;
	ordering.bShowSP = false;
	ordering.needRefresh = false;
	ordering.procStep = function(key) {
		return ordering.procress.indexOf(key);
	}
	
	/** Current ordering step idx
	 * @memberOf ordering
	 * @namespace
	 */
	ordering.step = {
		/** @type {ordering.step.idx} 
		 * @default
		 */
		idx: -1,
		/** @type {ordering.stepBox?} 
		 * @default
		 */
		current: null,
		/** @type {ordering.step.idx} 
		 * @default
		 */
		last: null,
		next: null,
		completed: [],
		procress: [],
		data: {}
	};
	
	/** Order state
	 * @this ordering
	 * @enum {number}
	 */
	ordering.state = {
		INIT: -1,
		PENDING: 0,
		ACTIVE: 1,
		VALIDATED: 2,
		EDIT: 3,
		COMPLETE: 4,
		ENDED: 5
	};
	ordering.setState = function(state,message) {
		try {
			var orderCont = $$('.orderCont'), orderState = $('orderState');
			if (orderCont && orderCont.length === 1) {
				if (state)
					for (var k in ordering.state) 
						orderCont[0].toggleClassName(k.toLowerCase(),ordering.state[k] == state);
			}
			orderState && orderState.hide();
		
		//console.log('order_mess?',message);
			//if (orderState && typeof message === 'string')
			//	orderState.show().down('.state-wordings').update(message);
			
			var competeButton = $$('.complete-button');
			if (competeButton && competeButton.length == 1) {
				competeButton[0]
					.toggleClassName('validated',false)
					.toggleClassName('step_next',false)
					.toggleClassName('step_next_dimm',true)
				if (state == ordering.state.ENDED) {
					competeButton[0]
						.toggleClassName('step_next_dimm',message===true ? false : true)
						.toggleClassName('step_next',message===true ? true : false)
						.show();
				}
				if (typeof message === 'boolean' && message===true)
					competeButton[0].toggleClassName('validated',true);
			}
		} catch (err) {
		//console.log('order_state_err:',err);
		}
	}

	ordering.isEmailValid = function(sEmail){
		var sEmailCheA	=	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return sEmailCheA.test(sEmail);
	};
	ordering.isStoreCodeValid = function(sCode){
		return sCode.match(/^([a-zA-Z0-9_-]){3}$/);
	};
	ordering.isStaffCodeValid = function(sCode){
		return sCode.match(/^(?=[sS]\w*$)(?:.{6,7})$/);
	};
	
	ordering.timelimit = {
		timestamp: 0
		,duration: 0
		,timeoutTS: null
		,timeoutInt: 60*1000 // 60sec*1000msec
		,start: function(params) {
			try {
				if (params.duration)
					this.duration = params.duration;
				var now = new Date();
				this.timestamp = now.getTime();
				var self = this;
				var run_process = function() {
					if (self.duration > 0)
						self.duration--;
					if (self.duration == 2) {
						var resp = confirm("Your session will expire soon. Please click to continue.");
						if (resp == true) {
							self.duration += 22;
							ordering.api.fetch({
								method: "post"
								,url: "?a=e"
							});
						}
					}
					if (self.duration > 0) {
						ordering.setTS(run_process,self.timeoutInt,self.timeoutTS);
					} else {
						clearTimeout(self.timeoutTS);
						alert("Sorry. Your order session has expired. You will have to start again.");
					}
				}
				ordering.setTS(run_process,this.timeoutInt,this.timeoutTS);
			} catch (state) {
			//console.log("timelimit_err:",state);
			}
		}
		,end: function() {
			
		}
		,extend: function() {
			
		}
	};
	
	/*
	ordering.selected = {
		hsid: null
		,premium: {}
		,productCode: null
		,type: null
		,plan: null
		,plan_addon: []
		,plan_addon_opts: {}
		,vaslist: {}
		,vastotal: 0
		,numtype: null
	};
	*/
	ordering.tmp = {};
	ordering.getCurrCont = function() {
		return ordering.step.current ? ordering.step.current._container() : null;
	}
	ordering._click = function(key,child,event) {
		return ordering.step.current._click(key,child,event);
	}
	
	
	/**
	 * @memberOf ordering
	 */
	ordering.setTS = function(callback,idle,tsID) {
		var idTS = tsID || ordering.ts;
		if (idTS) clearTimeout(idTS);
		idTS = null;
		ordering.ts = setTimeout(function() {
			clearTimeout(idTS);
			ordering.ts = null;
			if (idTS) idTS = null;
			callback && callback();
		},idle||700);
		if (typeof tsID !== 'undefined')
			tsID = ordering.ts;
		return ordering.ts;
	}
	

	/** Ordering API
	 * @memberOf ordering
	 * @namespace 
	 */
	ordering.api = {
		/**
		 * @this ordering.api
		 * @type {number}
		 * @default 0
		 */
		retry: 0
		/**
		 * @this ordering.api
		 * @type {number|null}
		 */
		,timeout: null
		/**
		 * @this ordering.api
		 * @type {number|null}
		 */
		,conn: null
		/**
		 * @this ordering.api
		 * @type {number|null}
		 */
		,sample: {
			2:
				{"err_msg":"","status":"ok","price_options":[{"deducted_fee":80,"err_msg":"","prepaid_price":3980,"thereafter_charge":"HK$100/GB","prepaid_price_display":"HK$3,980","std_monthly_fee_display":"HK$638","plan_description":"","admin_fee":18,"is_price_deducted":true,"plan_label":"638","vas_fee":36,"monthly_fee":558,"contract_bonus_month":24,"std_monthly_fee":638,"mktg_code":"SS6MC04","local_data_display":"10GB","included_services":["intra SMS","voicemail","call forwarding","caller number display","call waiting","conference call"],"contract_month_display":"24 months","is_offer":false,"monthly_fee_display":"HK$558","handset_price_display":"FREE","contract_month":24,"status":"ok","voice_intra":0,"voice_intra_display":"0","plan_code":"SS6PC04","ld_code":"SS6LC04","vas_group":"A","install_month":24,"voice_basic":5000,"voice_basic_display":"5,000","contract_bonus_amt":80,"local_data":10000,"has_contract_bonus":true,"plan_name":"HK$638 SuperCare Smartphone Plans","handset_price":0},{"deducted_fee":70,"err_msg":"","prepaid_price":3980,"thereafter_charge":"HK$100/GB","prepaid_price_display":"HK$3,980","std_monthly_fee_display":"HK$518","plan_description":"","admin_fee":18,"is_price_deducted":true,"plan_label":"518","vas_fee":36,"monthly_fee":448,"contract_bonus_month":24,"std_monthly_fee":518,"mktg_code":"SS6MC03","local_data_display":"6GB","included_services":["intra SMS","voicemail","call forwarding","caller number display","call waiting","conference call"],"contract_month_display":"24 months","is_offer":false,"monthly_fee_display":"HK$448","handset_price_display":"FREE","contract_month":24,"status":"ok","voice_intra":0,"voice_intra_display":"0","plan_code":"SS6PC03","ld_code":"SS6LC03","vas_group":"A","install_month":24,"voice_basic":4000,"voice_basic_display":"4,000","contract_bonus_amt":70,"local_data":6000,"has_contract_bonus":true,"plan_name":"HK$518 SuperCare Smartphone Plans","handset_price":0},{"deducted_fee":40,"err_msg":"","prepaid_price":3980,"thereafter_charge":"HK$40/200MB","prepaid_price_display":"HK$3,980","std_monthly_fee_display":"HK$408","plan_description":"","admin_fee":18,"is_price_deducted":true,"plan_label":"408","vas_fee":36,"monthly_fee":368,"contract_bonus_month":24,"std_monthly_fee":408,"mktg_code":"SS6MC02","local_data_display":"2.5GB","included_services":["intra SMS","voicemail","call forwarding","caller number display","call waiting","conference call"],"contract_month_display":"24 months","is_offer":false,"monthly_fee_display":"HK$368","handset_price_display":"FREE","contract_month":24,"status":"ok","voice_intra":0,"voice_intra_display":"0","plan_code":"SS6PC02","ld_code":"SS6LC02","vas_group":"A","install_month":24,"voice_basic":3000,"voice_basic_display":"3,000","contract_bonus_amt":40,"local_data":2500,"has_contract_bonus":true,"plan_name":"HK$408 SuperCare Smartphone Plans","handset_price":0},{"deducted_fee":20,"err_msg":"","prepaid_price":3100,"thereafter_charge":"HK$40/200MB","prepaid_price_display":"HK$3,100","std_monthly_fee_display":"HK$298","plan_description":"","admin_fee":18,"is_price_deducted":true,"plan_label":"298","vas_fee":36,"monthly_fee":278,"contract_bonus_month":24,"std_monthly_fee":298,"mktg_code":"SS6MC01","local_data_display":"1GB","included_services":["intra SMS","voicemail","call forwarding","caller number display","call waiting","conference call"],"contract_month_display":"24 months","is_offer":false,"monthly_fee_display":"HK$278","handset_price_display":"HK$880","contract_month":24,"status":"ok","voice_intra":0,"voice_intra_display":"0","plan_code":"SS6PC01","ld_code":"SS6LC01","vas_group":"A","install_month":24,"voice_basic":2500,"voice_basic_display":"2,500","contract_bonus_amt":20,"local_data":1000,"has_contract_bonus":true,"plan_name":"HK$298 SuperCare Smartphone Plans","handset_price":880}]}
		}
	};
	/** Ordering API fetching
	 * @memberOf ordering.api
	 * @param {object} params
	 * @param {Function} callback
	 */
	ordering.api.fetch = function(params,callback) {
		//prevent double click
		if(ordering.isUpdating){
			//console.log("second click abort:" + params.url);
			return;
		}
		//console.log("after click");
		
		try {
		var params = params || {};
		if (params && !params.url && typeof params.sample !== 'undefined') {
			var	response = params.sample.data;
			params.callback && params.callback(response,callback);
			return;
		}
		
		var currStep = ordering.step.current;
		//console.log('curr?',currStep)
		if (!currStep) {
			ordering.init();
			currStep = ordering.step.current;
		} 
		//console.log('curr_2?',currStep)
		
		// Will retry on failure
		if (params && params.retry)
			ordering.api.retry = params.retry;
		// Will have loading message box
		var loadingBox = null;
		if (typeof params.loading !== 'undefined') {
			var currCont = currStep._container();
			loadingBox = params.loading || null;
			if (loadingBox === true) {
				loadingBox = currCont.select('.apiLoading');
				if (loadingBox.length < 1)
					loadingBox = currCont.select('.apiContent');
			}
			if (loadingBox && loadingBox.length === 1) {
				//ordering.step.current._active();
				loadingBox = loadingBox[0];
				loadingBox
					.update('<div class="loadingImg" align="center"><img src="/common/loading.gif"/></div>')
					.show();
			} else if (currStep)
				currStep._state("loading",true);
		} else if (currStep) {
			currStep._state("loading",true);
		}
		
		var retryAgain = function(response) {
			try {
				if (ordering.api.retry++ >= 3)
					throw 'api_retry_stop';
				ordering.api.conn && ordering.api.conn.transport.abort && ordering.api.conn.transport.abort();
				ordering.setTS(function() {
					ordering.api.fetch(params,callback);
				},1000,ordering.tmp.apifetch);
			} catch(state) {
				if (loadingBox)
					loadingBox.update('');
				if (ordering.api.conn)
					ordering.api.conn.abort();
				ordering.api.conn = null;
				currStep._state("loading",false);
				callback && callback(response || false);
			}
		}
		
		if (!params.url || params.url == '') {
			if (ordering.step.current)
				params.url = '?a=step'+(ordering.step.current.id+1);
		}
		if (typeof params.args !== 'undefined' && params.data) {
			for (var k in params.args) {
				var value = params.args[k];
				var fields = value.split('.'), paramVal = params.args.data || ordering.tmp;
				if (typeof fields !== 'string')
					for (var f=0; f<fields.length; f++) {
						paramVal = paramVal[fields[f]] || null;
					}
				if (typeof paramVal === 'string')
					params.url += '&'+k+'='+paramVal;
			}
		}
		if (params.reset && ordering.api.conn) {
			ordering.api.conn.transport && ordering.api.conn.transport.abort();
			delete params.reset;
		}
		
		ordering.isUpdating = true;
		ordering.api.conn = new Ajax.Request(params.url, {
			method: params.method || 'POST'
			,parameters: params.params || null
			,onSuccess: function(transport) {
				transport.headerJSON;
			}
			,onComplete: function(response) {
				ordering.isUpdating = false;
				var isRetry = false;
				var data = response.responseJSON;
				if (response.status == 200) {
					var indexChk = window.location.href.match(/storefront\/(index.jsp|#|\?)$/ig);
				//console.log('fetch_check?',data.login,window.location.href,indexChk,data);
					if (indexChk == null && data.login === false && typeof data.message === 'undefined') {
						ordering.timeout(data);
						return;
					}
					if (data.status && data.status === 'ok') {
						ordering.api.conn = null;
						if (loadingBox)
							loadingBox.update('');
						if ((!params.redirectLate) && data.redirect) {
							document.location.href = data.redirect;
							return;
						}
					}
				}
				clearTimeout(ordering.tmp.apifetch);
				
				if (typeof params.retry !== 'undefined')
					isRetry = params.retry ? true : false;
				if (isRetry)
					retryAgain(response.responseJSON);
				else {
					if (currStep)
						currStep._state("loading",false);
					callback && callback(data);
				}
			}
			,onAbort: function(response) {
				ordering.isUpdating = false;
				if (currStep)
					currStep._state("loading",false);
				callback && callback(false);
			}
			,onFailure: function(response) {
				ordering.isUpdating = false;
				retryAgain(response.responseJSON);
			}
		});
		} catch(err) {
		//console.log('api_conn_err:',err);
			ordering.isUpdating = false;
			if (currStep && currStep._state)
				currStep._state("loading",false);
			callback && callback(false);
		}
	}
		
	/** Ordering stepBox class
	 * @memberOf ordering
	 * @class
	 */
	ordering.stepBox = function(stepID) {
		/** @lends ordering.stepBox.prototype  */
		var self = this;
		this.inialized = false;
		
		/** Get stepBox main Container
		 * @this ordering.stepBox
		 */
		self._nextButton = function(isEnable,idx) {
			var isEnable = isEnable || false;
			if (!self._container()) return;
			var nextDimm = self._container().select('.nextButton')[idx || 0];
			if (nextDimm) {
				nextDimm.toggleClassName('step_next_dimm',!isEnable);
				nextDimm.toggleClassName('step_next',isEnable);
			}
		}
		/** Get stepBox main Container
		 * @this ordering.stepBox
		 */
		self._container = function(stepID) {
			var cont = $$('.stepBox.step'+(stepID || (this.id+1)));
			if (this.key && $$('.step-'+this.key).length == 1)
				cont = $$('.stepBox.step-'+this.key);
		//console.log('step_cont:',this.id,this.key,$$('.stepBox')[this.id],$$('.stepBox.step'+this.id+1),$$('.stepBox.step-'+this.key));
			if (!cont || cont.length < 1)
				return $$('.stepBox')[this.id];
			return cont[0] || null;
		};

		
		/** stepBox initail function 
		 * @this ordering.stepBox
		 * @param {ordering.stepBox.id} stepID
		 */
		self._init = function(rowID,key) {
			var stepID = rowID;
			if (ordering.tmp.procress && ordering.procress) {
				if (typeof rowID === 'number') {
					key = ordering.procress[rowID];
					stepID = ordering.tmp.procress.indexOf(key);
				} else if (typeof rowID === 'string') {
					key = rowID;
					stepID = ordering.tmp.procress.indexOf(rowID);
				}
			}
			//console.log('step_init:',key,stepID,ordering.procress.indexOf(key));
			
			/**
			 * @this ordering.stepBox
			 * @type {ordering.step.idx|number}
			 */
			this.id = stepID;
			if (typeof this.id === 'undefined' || this.id === null)
				this.id = ordering.step.idx;
			
			this.key = key;
			
			/**
			 * @this ordering.stepBox
			 * @type {number}
			 * @default ordering.state.PENDING
			 * @see ordering.state
			 */
			this.state = ordering.state.PENDING;
			
			/**
			 * @this ordering.stepBox
			 * @type {ordering.stepfunc|object}
			 */
		//console.log('step_init_set:',this.id,this.key,ordering.step.data[this.key]);

			this.params = ordering.step.data[this.key] || ordering.step.data[this.id] || {};
			Object.extend(this,this.params);
			
			this.is_validated = false;
			
			this.inialized = true;
			ordering.validateCount = -1;
			
		//console.log('step_init_cont:',this._container());
			if (this._container(this.id)) {
				var cont = this._container();
				if (cont.className.match(/step(\d{1,})/ig)) {
					var stepNo = cont.className.match(/step(\d{1,})/ig);
					if (stepNo != (this.id+1))
						cont.toggleClassName('step'+stepNo,false);
				}
				cont.toggleClassName('step'+(this.id+1),true);
				
				if (cont.className.match(/step-\w{1,}/ig))
					cont.toggleClassName(cont.className.match(/step-\w{1,}/ig)[0],false);
				if (this.key && !cont.hasClassName('step-'+this.key))
					cont.toggleClassName('step-'+this.key,true);
			}
			return self;
		}
		/** Action on active
		 * @this ordering.stepBox
		 */
		self._active = function(isForce,callback) {
		//console.log('step_active...',isForce,this.id,this._container());
			try {
			if (!this._container()) return;
			
		//console.log('step_active ?',this._container().className);
			if (this._container().hasClassName("active") || this._container().hasClassName("edit") )
				return;
			if (isForce && (this.params.api && this.params.api.isRun)) {
				this._close();
				return;
			}
			
			this._state(ordering.state.ACTIVE);
			var self = this;
			var activation = function() {
			//console.log('run_activation...');
				try {
					self._reset();
					var stepContent = self._container().down('.stepContent');
					if (!stepContent) throw 'step_cont_empty';
					
					new Effect.SlideDown(stepContent,{
						duration: 0.7
						,beforeUpdate: function() {
							self._container().addClassName('active');
							stepContent.setStyle({
								height: 0
							});
						},afterFinish: function() {
							stepContent.setStyle({
								height: 'auto'
							}).show();
							callback && callback();
						}
					})
					new Effect.ScrollTo(self._container(),{sync:true});
				} catch(err) {
				//console.log('step_active_err:',err);
					self._container()
						.addClassName('active')
						.setStyle({
							height: 'auto'
						});
					callback && callback();
				}
			}
			
			if (!this._container().hasClassName('complete') && ordering.step.data.length > 1 && this.id === 0)
				ordering.setTS(function() {
					activation();
				},1500);
			else
				activation();
			} catch (err) {
			//console.log('step_active_err:',err);
			}
		}
		/** Action on stepbox opening
		 * @this ordering.stepBox
		 * @params {function} callback
		 */
		self._open = function(callback) {
			try {
				var openInit = function(response) {
				//console.log('stepbox_open_init?',self.params);
					if (self.params && typeof self.params.init === 'function')
						self.params.init && self.params.init();
					ordering.validateCount = 0;
					callback && callback(response || false);
				}

				this.params.show && this.params.show();
				if (typeof this.params.api === 'undefined')
					return openInit();
			//console.log('stepbox_open_api?',this.params.api.isRun,!this.params.api.isRun,!!this.params.api.isRun);
				if (!this.params.api.isRun || this.params.api.isRun === false)
					return openInit();
				
				this._container().toggleClassName('pending',true);
				ordering.api.fetch(self.params.api, function(response) {
					/*
					//var stepContent = self._container().select('.stepContent')[0];
					//if (stepContent.match('img.loading'))
					//	stepContent.update('');
					*/
				//console.log('stepbox_openapi_cb?',response)
					self._container().toggleClassName('pending',false);
					if (typeof self.params.api.callback === 'function')
						self.params.api.callback(response, function(response) {
							openInit(response);
						});
					else
						openInit(response);
				});
			} catch (err) {
			//console.log('stepbox_open_err?',err)
			}
		};
		/** Close action
		 * @this ordering.stepBox
		 */
		self._close = function(isReset) {
			var close_all = function() {
				self._reset(isReset);
				if (self._container()) {
					self._container().removeClassName('active').removeClassName('edit').removeClassName('pending');
					self._container().addClassName('complete');
					self.state = ordering.state.COMPLETE;
				}
			}
			
			try {
			//console.log('close_chk?',this.state,this._container().hasClassName('updated'));
				if (this._container() && !this._container().hasClassName('updated') && this._validation({type:'close'}))
					self.params.selection_update && self._selection(self.params.selection_update());
				
				if (typeof this.state === 'string' && this.state.match(/(active|edit)/ig)
					&& this._container() && !this._container().hasClassName('updated') 
					&& this._validation({type:'close'})) {
					this._updateapi(null,function() {
						close_all();
					});
				} else {
					close_all();
				}
			} catch (err) {
			//console.log('sel_upt_err:',err,self.id);
			}
		};
		/** Reset action
		 * @this ordering.stepBox
		 */
		self._reset = function(clearSelected,isFull) {
			if (this._container()) {
				this._container()
					.removeClassName('active')
					.removeClassName('complete')
					.removeClassName('edit');
			}
			if (clearSelected || isFull)
				this.params.reset && this.params.reset(clearSelected && isFull);
			this.state = ordering.state.PENDING;
		}

		self._errorMess = function(message,subClass) {
			//if (ordering.validateCount < 1) return;
			var errBox = !subClass ? this._container() : this._container().down(subClass);
			if (errBox) {
				if (message === false) {
					errBox.select('.error-mess').each(function(mess) {
						mess.innerHTML = '';
					});
				} else if (errBox.down(".error-mess"))
					errBox.down(".error-mess").innerHTML = message;
			}
		}
		/** Action on validated state
		 * @this ordering.stepBox
		 * @param {boolean} isValid
		 */
		self._state = function(state,isEnable,message) {
			if (!this.params) return;
			
			if (state == 'loading' && this._container()) {
				this._container().toggleClassName(state,isEnable || null);
				return;
			}
			
			if (this.state && this._container())
				this._container().toggleClassName(this.state,false);
			this.state = ordering.state.PENDING;
			if (state === false || (state=='error' && isEnable === false))
				this._errorMess(false);
			if (state == 'error' && isEnable && message)
				this._errorMess(message);
			
		//console.log('box_state?',state,isEnable,message);
			if (state) {
				if (state == 'error' && this.id ==0 && !this.is_validated) {
					this.is_validated = true;
					return;
				}
				
				this.state = state;
			//console.log('step_state:',this.id,this.key);
				if (this._container())
					this._container().toggleClassName(state,isEnable || null);
				/*
				if (state == 'error' && this._container().hasClassName(state)) {
					this._container().select('.error-mess').each(function(mess) {
						if (!mess.empty() || mess.innerHTML.replace(/[\s\n\t\r]+/ig,'')!='') {
							var child = mess.previous('input',0) || mess.previous('select');
							var inputs = mess.up('.form-group').select('input');
							if (inputs.length > 0)
								child = inputs[0];
							if (child) {
								var isFocus = child.up().select(child.tagName+':focus');
							//console.log('errmess?',isFocus,child,inputs);
								//if (isFocus.length < 1)
								//	child.focus();
							}
						}
					});
				}
				*/
			}
		}
		/** Action on edit state
		 * @this ordering.stepBox
		 * @param {ordering.stepBox.id} stepID
		 */
		self._edit = function(rowID) {
			try {
				if (typeof rowID !== 'undefined' && rowID !== this.id)
					this._init(rowID);
				
				ordering.setState(ordering.state.PENDING);
				this._active(false,function() {
					//self.state = 'edit';
					//self._container().addClassName('edit');
					self._container() && self._container().toggleClassName('updated',false);
					self._state('edit',true);
					ordering.step.idx = rowID;
				});
			} catch (err) {
			//console.log('step_edit_err:',err);
			}
		}
		/** Action on validated state
		 * @this ordering.stepBox
		 * @param {boolean} isValid
		 */
		self._validated = function(isValid) {
			/*
			var nextDimm = self._container().select('.nextButton')[0];
			//console.log('next_btn?',self._container(),nextDimm,!!isValid);
			nextDimm.toggleClassName('step_next_dimm',!!!isValid);
			//console.log('valid?',isValid)
			if (isValid === true) {
				nextDimm.addClassName('step_next');
				nextDimm.removeClassName('step_next_dimm');
			}
			*/
			if (isValid)
				self.state = 'validated';
			self._nextButton(isValid);
		};
		/** Action on next state
		 * @this ordering.stepBox
		 * @param {string|number} nextID
		 */
		self._next = function(rowID,params) {
			try {
				//if (this._container().className.match(/(active|edit)/))
				this._close();
				this._init(rowID);
				if (params && params.force) {
					if (this.params && this.params.skip) {
						ordering.nextStep(params);
						return false;
					} else if (this.id < ordering.step.data.length-1 && this._validation(params)) {
						ordering.nextStep(params);
						return false;
					}
				}
				return true;
			} catch (state) {
			//console.log('stepbox_next_err:',state);
			}
			return false;
		}

		
		/** StepBox click
		 * @this ordering.stepBox
		 * @param {string} key
		 * @param {object|string|null} input
		 */
		self._click = function(key,input,event) {
		//console.log('click_evt?',event);
			if (event && typeof event === 'object') {
				var $evt = jQuery(event)[0];
				//if (event.defaultPrevented === true) return;
				//console.log('click_evt_obj?',event.preventDefault,event.defaultPrevented,event.detail,$evt);
				//$evt.preventDefault();
				//if (event.detail > 1) return;
				event.preventDefault();
			}
			//console.log('input_node?',input.nodeName);
			
			ordering.isValidate = false;
			try {
				var clickData = null;
				if (typeof input !== 'object')
					clickData = input;
				else if (input.tagName.match(/select/ig)) {
					clickData = $(input).getValue();
				} else if (input.readAttribute) {
					if (input.readAttribute('data-key'))
						clickData = input.readAttribute('data-key');
					if (clickData===null && input.readAttribute('value'))
						clickData = input.readAttribute('value');
				}
			} catch (err) {
			//console.log('click_data_err:',err);
			}
			
			if (input && typeof input==='object' && (input.hasClassName && input.hasClassName('disabled'))) {
				if (this.params && this.params['error_'+key])
					this.params['error_'+key](clickData);
				return false;
			} 
			
			if (event && input && typeof input === 'object' && input.nodeName == 'BUTTON') {
				if (input.hasClassName('loading')) return false;
				//input.toggleClassName('loading',true);
			}
			
			ordering.tmp[key] = clickData;
			var clickKey = 'click_'+key;
			this.params[clickKey] && this.params[clickKey](clickData,input,event);
			if (clickData && (!event || (typeof event === 'string' && event != 'init')))
				if (typeof input !== 'undefined') {
					this._validated(false);
					ordering.setState(ordering.state.PENDING);
					ordering.step.current._errorMess(false);
					
					if (ordering.step.completed.indexOf(this.id) !== -1)
						ordering.step.completed.splice(ordering.step.completed.indexOf(this.id),1);
					if (this._validation() === true) {
						if (this._container() && this._container().down('.step_summ .selection-info'))
							this._container().select('.step_summ .selection-info')[0].update('');
						if (ordering.step.idx >= ordering.step.data.length-1)
							ordering.complete();
					}
					ordering.step.current.is_validated = true;
				}
			return false;
		}	
		/** Toggle click highligh
		 * @this ordering.stepBox
		 * @param {string} key
		 * @param {object|string|null} prefix
		 * @param {object} parent
		 */
		self._clickhighlight = function(key,prefix,parent) {
			try {
				if (!!!key && !!!prefix)
					throw 'empty_key_prefix';
				
				var childID = (prefix ? prefix : '')+key, child = $(childID);
				if (!child && parent) {
					if (typeof parent.length === 'undefined') {
						child = parent.down('.'+key);
						if (!child)
							child = parent.down('#'+childID);
					} else if (parent[0].hasClassName(key)) {
						child = parent[0];
					}
				}
				if (!child && $$('.'+key).length > 0)
					child = $$('.'+key)[0];
				
				if (!child) throw 'empty_child';
				if (child.hasClassName('selected')) 
					throw 'child_selected';
				
				if (!parent) {
					child.toggleClassName("selected");
					throw 'hl_without_parent';
				}
				
				var remove_children = function(items,callback) {
					items.each(function(item) {
						item.removeClassName('selected');
						if (self.params.fields)
							for (var i=0; i<self.params.fields.length; i++) {
								var field = self.params.fields[i];
								var itemKey = item.readAttribute("data-key");
								if (ordering.selected[field] && typeof ordering.selected[field][itemKey] !== 'undefined') {
									delete ordering.selected[field][itemKey];
								}
							}
						
						if (item.select('.selected').length > 0)
							remove_children(item.select('.selected'));
					});
					callback && callback();
				}
				
				var items = (parent.length && parent.length > 0) ? parent : parent.select('.selected');
				remove_children(items, function() {
					child.toggleClassName("selected",true);
				});				
			} catch (err) {
			//console.log('stepbox_clickhl_err:',err);
			}
		}

		
		/** Ordering validation
		 * @this ordering.stepBox
		 */
		self._validation = function(params) {
			var isValid = false;
			this._state('error',false);
			if (this._state != 'loading')
				this._validated(true);
			
			if (typeof this.params.validation === 'function') {
				isValid = this.params.validation(params);
				if (isValid === undefined)
					isValid = true;
			} else
				isValid = true;
			
			
			if (isValid === false) {
			//console.log('valid_count?',ordering.validateCount);
				if (ordering.validateCount > 0)
					this._state('error',true);
				ordering.validateCount++;
				self._validated(true);
			} else {
				ordering.validateCount = 0;
			}
			return isValid;
		};
		/** Section summary update
		 * @this ordering.stepBox
		 */
		self._selection = function(params,child) {
			var stepBoxId = (self.id+1);
			try {
				var orderCont = $('order_list_cont'), currListItem=null;
				if (orderCont)
					currListItem  = orderCont.down('.step'+stepBoxId);
				if (!params) {
					if (currListItem)
						currListItem.hide();
					return;
				} 
				
				var summaryTmpl = self._container().down('.selection-tmpl');
				if (!summaryTmpl) throw 'empty_summ_tmpl';
				
				var tmplHTML = summaryTmpl.innerHTML.substring(0);
				var contentTmpl = new Template(tmplHTML);
				
				if (child && typeof child !== 'boolean') {
					child.update(contentTmpl.evaluate(params)).show();
					return;
				}
				
				if (ordering.step.completed.indexOf(self.id) === -1)
					ordering.step.completed.push(self.id);
				
				var summaryBox = this._container().down('.selection-info');
				if (summaryBox) {
					summaryBox.update(contentTmpl.evaluate(params)).show();
					var leftParams = {};
					for (var k in params) {
						if (typeof params[k] !== 'string')
							leftParams[k] = params[k][0];
						else
							leftParams[k] = params[k];
					}
					this._container().select('.selection-info')[0].update(contentTmpl.evaluate(leftParams));
				}
				
				if (orderCont) {
					if (typeof params.heading === 'object' && params.heading[1]===false) {
						currListItem.hide();
						return;
					}
					var orderStepTmpl = new Template($('orderStep').innerHTML);
					var rightParams = {};
					for (var k in params) {
						if (typeof params[k] !== 'string')
							rightParams[k] = params[k][1] || null;
						else
							rightParams[k] = params[k];
					}
					
					if (orderCont.select('.step'+stepBoxId).length < 1) {
						orderCont.insert(orderStepTmpl.evaluate({
							id: stepBoxId
							,heading: params && params.heading || null
							,detail: contentTmpl.evaluate(rightParams)
							,image: params.image || null
						}));
					} else {
						orderCont.select('.step'+stepBoxId)[0].update(orderStepTmpl.evaluate({
							id: stepBoxId
							,heading: params.heading
							,detail: contentTmpl.evaluate(rightParams)
							,image: params.image
						}));
					}					
					orderCont.down('.step'+stepBoxId).toggle(params.skipRight===true ? false : true);
					
					if (orderCont.select('.order-step').length > 0)
						orderCont.up(2).down('.cancel-button').show();
					else
						orderCont.up(2).down('.cancel-button').hide();
				}
				return true;
			} catch (err) {
			//console.log('stepbox_selection_err:',err);
			}
			return false;
		}
		
		self._updateapi = function(inparams,callback) {
			var self = this;
			try {
				this._state('loading',true);
				
				var params = {};
				if (inparams && typeof inparams.params !== 'undefined')
					Object.extend(params, inparams.params)
				if (!params.url && !params.a)
					params.a = 'step'+(this.id+1);
				
				var fields = this.params.fields || null;
				if (fields) {
					fields.each(function(field) {
						var fieldVal = ordering.tmp[field] || ordering.selected[field] || null;
						if (fieldVal) {
							if (typeof fieldVal === 'string')
								params[field] = fieldVal;
							else
								params[field] = JSON.stringify(fieldVal);
						}
					})
				}
				
				if (ordering.tmp.update_api && ordering.api.conn)
					ordering.api.conn.transport.abort();
				
				ordering.tmp.update_api = null;
				ordering.setTS(function() {
					var connParam = {
						method: 'post'
						,url: params.url
						,reset: true
						,params: params
					}
					if (inparams.redirectLate)
						connParam.redirectLate = true;
					ordering.api.fetch(connParam,function(response) {
						try {
							ordering.isUpdating = false;
							if (response && response.status == 'ok')
								self._selection(self.params.selection_update());
							self._container() && self._container().addClassName('updated');
						} catch (err) {
						}
						if (self.params && typeof self.params.update_after === 'function')
							self.params.update_after(response,callback);
						else 
							callback && callback(response);
					});
				},300,ordering.tmp.update_api);
			} catch (err) {
			//console.log('step_updateapi_err:',err);
				this._state('loading',false);
				callback && callback(false);
			}
		}
		
		self._selected = function(params) {
			Object.extend(ordering.selected, params);
		}
		
		if (typeof stepID !== 'undefined')
			self._init(stepID);
		return self;
	};
	
	/** Ordering inializing
	 * @memberOf ordering
	 */
	ordering.init = function() {
		
	//console.log('step?',$$('.stepBox'));
		if ($$('.stepBox').length == 0)
			$('Container_Site').toggleClassName('stepBox',true);
		
		if (ordering.step.data) {
			if (ordering.procress)
				ordering.step.data.length = ordering.procress.length;
			else {
				var count = 0;
				for (var k in ordering.step.data)
					count++;
				ordering.step.data.length = count;
			}
		} else {
			ordering.step.data = {
				0: {
					click_login:function() {
						ordering.login();
					}
					,click_signupcreate: function(key) {
						try {
						//console.log('signup?',key);
							$('signupModal').toggleClassName('signup',true);
							$('signupModal').toggleClassName('signup-fail',false);
							$('signupModal').toggleClassName('verify',false);
							if (!key) return;
							
							$('signupErr').update('');
							ordering.api.fetch({
								url: '/servlet/SmarTone.eCommCreateAccount'
								,method: 'GET'
								,params: {
									act: 'createaccount'
									,email: $F('spe')
									,pw: $F('spp')
									,l:'e'
								}
							},function(response) {
								if (response && response.status == 'ok') {
									$('signupModal').down('.signed-email').innerHTML = $F('spe');
									ordering._click('signupverify',false);
								} else {
									if (response.err_msg)
										$('signupErr').innerHTML = response.err_msg;
								}
							});
						} catch (err) {
						//console.log('signup_err:',err);
						}
					}
					,click_signupverify: function(key) {

					}
				}
			};
		}
		
		if (ordering.step.data && ordering.step.data.length > 0) {
			if (ordering.procress) {
				if (!ordering.tmp.procress)
					ordering.tmp.procress = ordering.procress;
			//console.log('order_init:',ordering.procress,ordering.tmp.procress);
				ordering.procress.each(function(key,idx) {
					var stepData = new ordering.stepBox(idx,key);
				//console.log('order_init_setup:',idx,key,stepData.id,stepData.key,stepData);
				});
				ordering.step.data.length = ordering.procress.length;
			}
			
			ordering.step.current = new ordering.stepBox(0);
			var params = {
				type:'init'
				,force:false
			}
			ordering.isLoaded = false;
			if (ordering.step.data.length > 1) {
				$$('.complete-button').each(function(btn) {
					btn.hide();
				});
			}
			
			var loaded = null;
			if (ordering.loaded && ordering.loaded !== null) {
				loaded = function() {
					Object.extend(ordering.selected,ordering.loaded);
					params.force = true;
					ordering.isLoaded = true;
					ordering.setState(ordering.state.EDIT);
				}
			}
			
			if (typeof ordering.init_after !== 'undefined') {
				this.setState(this.state.INIT);
				ordering.init_after && ordering.init_after(function() {
					loaded && loaded();
					ordering.nextStep(params);
				});
			} else {
				loaded && loaded();
				ordering.nextStep(params);
			}
		}
		
		
	}	
	/** StepBox nextStep
	 * @memberof ordering
	 */
	ordering.nextStep = function(isInit) {
		var current = ordering.step.current || new ordering.stepBox(ordering.step.idx);
		if (!current) return false;
		if (current.state == 'loading') return false;
		//if (current.state == 'loading') return false;
		
		var params = null;
		if (!!isInit && typeof isInit !== 'boolean')
			params = isInit;
		else
			params = {force : isInit || false};
		
		try {
			if ((current.params && current.params.skip === true)
				|| current._container().hasClassName('skip')) {
				ordering.step.next = (ordering.step.idx+1);
				params.force = true;
			}
			
		//console.log('stepnext_valid?',!params.force,current._validation(params),params);
			if (!params.force && ordering.step.idx >= 0 && current._validation(params) === false) {
				//current._state('error',true);
				throw 'in_valid';
			}
			// else current._state(false);
			
			// Checking next step id
			var rowID = (ordering.step.idx+1);
			//console.log('next_id?',rowID);
			if (ordering.step.next !== null) {
				//console.log('next_type?',typeof ordering.step.next);
				if (typeof ordering.step.next === 'string' && ordering.procress)
					ordering.step.next = ordering.procress.indexOf(ordering.step.next);
				if (ordering.procress 
					&& ordering.step.completed.length == ordering.procress.length 
					&& ordering.step.next == ordering.step.completed.length) {
					ordering.step.next = null;
					throw 'run_complete';
				}
				if (ordering.step.next === ordering.step.idx) {
					ordering.step.next = null;
					throw 'active_box';
				}
				// Getting from specify step
				rowID = ordering.step.next;
				ordering.step.next = null;
			}
		//console.log('next_id_final?',rowID);
		
			// Make updating on going to next step
		//console.log('next_func_chk?',params.force,rowID,ordering.step.idx);
			if (!params.force && ordering.step.idx >= 0 && current._validation(params)
				&& (rowID != ordering.step.idx)
				&& ((ordering.procress && ordering.step.idx < ordering.procress.length) 
					|| ordering.step.idx < ordering.step.data.length
					|| (current._container().hasClassName('edit') && current.validation()))) {
				if (ordering.step.idx != ordering.step.last) {
					if (typeof current.params.step_next === 'function') {
						 var resp = current.params.step_next(function(resp) {
							if (resp === true) {
								ordering.step.last = ordering.step.idx;
								ordering.step.next = ordering.step.next || rowID;
								ordering.nextStep({
									type: 'step_next'
								});
							} else {
								ordering.step.current.update_after && ordering.step.current.update_after(response);
							}
						});
						if (resp === false) 
							throw 'step_next_func';
					} else if (ordering.step.current.params 
						&& typeof ordering.step.current.params.fields === 'object' 
						&& ordering.step.current.params.fields.length > 0) {
						ordering.step.current._updateapi(params.params,function(response) {
						//console.log('updateapi_cb:',response);
							if (!response) ordering.step.current._validated(false);
							if (response.status == 'ok') {
								ordering.step.last = ordering.step.idx;
								ordering.step.next = rowID;
								ordering.nextStep({
									type: 'step_next'
								});
							} else if (response.message) {
								ordering.step.current._errorMess(response.message);
								ordering.step.current._state('error',true);
							}
							ordering.step.current.update_after && ordering.step.current.update_after(response);
						});
						throw 'step_next_api';
					}
				}
			}
			
			// Checking is ended/completed
		//console.log('step_complete_processhk?',rowID,ordering.step.completed,ordering.procress);
			if ((ordering.procress && ordering.procress.length == ordering.step.completed.length)
				|| rowID >= ordering.step.data.length 
				|| ordering.step.completed == ordering.step.data.length) {
				if (params.type && params.type == 'init') {
					this.setState(false);
					ordering.isLoaded = false;
					throw 'step_is_init';
				}
				if (!params || !params.type || (params.type && params.type!='init'))
					throw 'run_complete';
				else {
					throw 'step_ended';
				}
			}

			ordering.step.last = ordering.step.idx;
			ordering.step.idx = rowID;
			if (current._next(rowID,params) === false)
				throw 'next_stopped';

			throw 'active_box';
		} catch(state) {
			current = ordering.step.current;
		//console.log('nextstep_state?',state,current.id,current.key,ordering.step.idx,params);
			switch(state) {
				case 'run_complete' :
					this.setState(ordering.state.ENDED);
					var stepTotal = ordering.procress ? ordering.procress.length : ordering.step.data.length;
					if (stepTotal > 2)
						current._close();
					ordering.step.idx = rowID;
					/*
					if (ordering.step.idx > ordering.step.data.length)
						ordering.step.idx = ordering.step.data.length;
					*/
					
					var isEnd = false;
					//console.log('nextstep_comple?',current.id,current.key,current.params.stepComplete,current);
					if (ordering.step.current.params.stepComplete === true)
						isEnd = true;
					ordering.complete && ordering.complete(isEnd);
					break;
				case 'active_box' :
					try {
					//console.log('active_close_last?',ordering.step.last,ordering.step.current.id,ordering.step.current);
						if (ordering.step.last != ordering.step.current.id)
							ordering.step.current._close();
						this.setState(this.state.EDIT);
						ordering.step.current._open(function(response) {
							try {
							//console.log('open_resp:',params.force,response,typeof ordering.step.current.params.set_loaded);
								if (params.force && typeof ordering.step.current.params.set_loaded === 'function') {
									var isContinue = ordering.step.current.params.set_loaded();
								//console.log('force_continue?',ordering.step.current.id,isContinue,ordering.step.next);
									if (isContinue === true && ordering.step.current._validation(params)) {
										ordering.setTS(function() {
											current._close();
											ordering.step.current.params.selection_update 
												&& ordering.step.current._selection(ordering.step.current.params.selection_update());
											ordering.nextStep(params.force);
										},1000);
									} else {
										ordering.step.current._active();
									}
								} else {
									ordering.step.current._active(params.force);
								}
							} catch (err) {
								ordering.step.current._active(params.force);
							}
						});
					} catch (err) {
					//console.log('next_active_err:',err);
					}
					break;
			}
		}
		return false;
	}
	/** StepBox validation
	 * @memberof ordering
	 * @param {string|number} stepID
	 */
	ordering.editStep = function(rowID) {
		try {
			if (typeof rowID === 'undefined') throw 'edit_id_empty';
			if (rowID && typeof rowID !== 'number') {
				var match = rowID.up('.stepBox').className.match(/step-(\w{1,})/ig);
			//console.log('step_match:',match,rowID,ordering.procress);
				if (match && ordering.procress) {
					var boxStepKey = match[0].replace('step-','');
					rowID = ordering.procress.indexOf(boxStepKey);
				//console.log('step_match_process:',boxStepKey,rowID);
				} else {
					match = rowID.up('.stepBox').className.match(/step(\d{1})/ig);
					rowID = match[0].replace('step','');
				}
			}
		//console.log('step_edit_curr:',rowID,ordering.step.current);
			
			ordering.isLoaded = false;
			var current = ordering.step.current || null;
			
			var self = this;
			var editing = function() {
				current._close();
				if (!current || current.id != rowID)
					current = new ordering.stepBox(rowID);
				ordering.step.current = current;
			//console.log('step_edit_bf:'+ordering.step.idx+"|"+ordering.step.last);
				if (ordering.step.idx != ordering.step.last)
					ordering.step.last = ordering.step.idx;
				else
					ordering.step.last = null;
				ordering.step.idx = rowID;
				ordering.step.current._edit(rowID);
				self.setState(ordering.state.EDIT);
			}
			
		//console.log('step_edit_curr:',current);
			editing();
		
			/*
			if (current) {
				//var currRowID = ordering.procress ? ordering.procress.indexOf(current.key) : ordering.step.idx;
				//ordering.step.last = currRowID;
				if (current.id>=0 && current._validation({type:'edit'})) {
					current._updateapi(null,function() {
						editing();
					});
				} else
					editing();
			}
			*/
		} catch (err) {
		//console.log('step_edit_err:',err,current);
		}
		return false;
	}
	
	ordering.checkLoaded = function(key,callback) {
		try {
		//console.log('check_load:',key,ordering.loaded[key],ordering.loaded);
			if (!ordering.loaded || typeof ordering.loaded[key] === 'undefined')
				throw 'step_loaded_null';
			if (JSON.stringify(ordering.loaded[key]) == '{}')
				throw 'step_loaded_null';
			
			var loaded = ordering.loaded[key];
			delete ordering.loaded[key];
			if (loaded === null)
				throw 'step_loaded_empty';
			
			callback && callback(loaded);
			return true;
		} catch (err) {
		//console.log("check_loaded_err:",err);
		}
		return false;
	}
	
	/**
	 * @memberOf ordering
	 */
	ordering.complete = function(isEnd) {
		var cartButton = $('addtocart');
		if (!cartButton && $$('.complete-button').length == 1)
			cartButton = $$('.complete-button')[0];
		if (!cartButton)
			cartButton = ordering.step.current._container().down('.nextButton');
		try {
			if (ordering.isUpdating)
				throw 'api_updating';
			
			if (!isEnd && (ordering.step.idx < ordering.step.completed.length))
				throw 'step_not_complete';
			
			if (!cartButton.hasClassName('validated')) {
				for (var i=0; i<ordering.step.completed.length; i++) {
					var completeIDX = ordering.step.completed[i];
					var stepBox = new ordering.stepBox(completeIDX);
					if (stepBox._validation({type:'complete'}) === false) {
						ordering.step.next = completeIDX;
						ordering.nextStep();
						throw 'steps_valid_fail';
					}
				}
				cartButton
					.toggleClassName('validated',true)
					.toggleClassName('step_next_dimm',false)
					.toggleClassName('step_next',true)
					.show();
					
				if (!isEnd && ordering.step.idx < ordering.step.completed.length) {
					ordering.step.idx = ordering.step.completed.length;
					return false;
				}
			}
			if (!isEnd) return false;
			
			this.setState(this.state.COMPLETE);
			if (typeof ordering.tmp.sumit === 'undefined')
				ordering.tmp.submit = false;
			if (ordering.tmp.submit === true) return;
			ordering.tmp.submit = true;
			ordering.api.fetch({
				url: 'cartridge.jsp'
				,method: 'post'
				,params: {
					action: 'submit'
				}
			},function(response) {
				ordering.tmp.submit = false;
				if (response && response.status == "ok")
					document.location.href = "cartridge.jsp";
			});
		} catch (state) {
		//console.log('complete_err:',state);
		}
		return false;
	}

	ordering.cancel = function() {
		var resp = confirm("Are you sure cancel this order ?");
		if (resp) {
			ordering.api.fetch({
				method: 'post'
				,reset: true
				,url: '?a=c'
			},function(response) {
				try {
					if (response && response.status == 'ok') {
						document.location.href = '/'+sLangSEO+'/mobile_and_price_plans/';
					}
				} catch (err) {
				//console.log('cancel_res_err:',err);
				}
			});
		}
		return false;
	}

	ordering.remove = function(itemID,callback) {
		if (!itemID) return;
		
		ordering.api.fetch({
			method: 'post'
			,url: 'cart.jsp?remove=1'
			,params: {id: itemID}
		},function(response) {
			if (response && response.status=='ok') {
				if (callback)
					callback && callback(response);
					if (ordering.isStFrontdesk() && (typeof(redso) != "undefined") ) {
						redso.mobileApp("remove_bag", {"orderid":itemID});
					}
				else
					ordering.setTS(function() {
						document.location.reload(true);
					})
			}
		});
		return false;
	}
	ordering.login = function(callback, options) {
		//console.log("callback ="+ callback)
		if (!ordering.step.current)
			ordering.init();
			
		try {
			var no_redirect    = false;
			var login_optional = false;
			var login_success_callback = null;
			var modal_title    = "";
			if(options){
				if(options.no_redirect === true){
					no_redirect = true;
				}
				if(options.login_optional === true){
					login_optional = true;
				}
				if(options.login_success_callback){
					login_success_callback = options.login_success_callback;
				}
				modal_title = options.modal_title || "";
			}
		//console.log('login_checking...:',callback);
			if (typeof callback === 'object')
				callback = null;
			var callback = callback || ordering.tmp.login_callback;
			ordering.tmp.login_callback = null;
			
			ordering.isLogin = false;
			//$('loginModal').down('.captcha-cont').hide();
			
			var login_success = function(response) {
				
				try {
				//console.log('remeber?',$('sp').value);
					if ($('TFPhone').value !== '' && !$('sp').checked)
						deleteCookie("remeber", "/", ".smartone.com");
					
					var myQuota = response.quota||0;
				//console.log(myQuota+"|"+ordering.bShowSP);
					if(myQuota>0 && ordering.bShowSP==true){
						ordering.bShowSP = false;
						jQuery('button.button-close').hide();
						jQuery('.modal-dialog').hide();
						jQuery('#CusDCLogined').show();
						jQuery('#loginedQuota').html(response.quota);
					}else{
						
						ordering.bShowSP = false;
						if(ordering.needRefresh == true){
							location.reload();
						}
						
						if(jQuery("#loginModal").hasClass("in")){
							jQuery('#loginModal').modal('hide');
						}
						
						$('Container_Site').toggleClassName('logined',true);
						ordering.isLogin = response.login || false;
						
						var orderSize = (response.cart)?parseInt(response.cart):0;						
						$('bagItemCount').update(orderSize);
						$('bagItemCount').toggleClassName('hide',orderSize<1 ? true : false);
						
						if (response.preview){
							$('cartPopList').down('.items-cont').update(response.preview);
						}else{
							$('cartPopList').down('.items-cont').update("");
						}
						$('Container_Site').toggleClassName('cartpreview',(orderSize>0) || response.preview ? true : false);
					}
					
				} catch (err) {
				//console.log('login_success_err:',err);
				}
				
				// Update User Name
				try {
					if (response.user) {
						$$('.acct-name').each(function(name) {
							name.update(response.user);
						})
					}
				} catch (err) {
					
				}
				
				try {
				//console.log('login_cart?',response.cart,$$('.cart-total'));
					if (response.cart)
						ordering.cart_total(response.cart);
				} catch (err) {}
				
				//updateLpParam(response.lid);

			}
			var login_fail = function(response) {
				ga_error("Login",response.message || "");
				if (response && response.redirect) {
					document.location.href = response.redirect;
					return;
				}
				
				if (response && response.message && $('loginErr')) {
					try {
						$('loginErr').update('');
						if (response.message) {
							var mess = response.message;
							if (mess.indexOf('<p>') == -1)
								mess = '<p style="color:#f00">'+mess+'</p>';
							$('loginErr').innerHTML = mess;													
						}
					} catch (err)  {
						//console.log('login_mess_err:',err)}
					}
				}
				if (response && response.captcha)
					$('loginModal').down('.captcha-cont').show();
				else
					$('loginModal').down('.captcha-cont').hide();
				
				$('FormLogin').reset();
				var cookies = new ordering.cookieClass('/','.smartone.com');
				if (cookies.get('remeber') && cookies.get('remeber') !== '') {
					$('TFPhone').value = cookies.get('remeber');
					$('sp').checked = true;
				}				
			}
			
			ordering.api.fetch({
				url: "?login=1"  + (no_redirect?"&no_redirect=1":"")
				,reset: true
				,method: 'post'
				,params: $('FormLogin').serialize()
			},function(response) {
				
				try {
				//console.log('ologin_cb?',response,typeof callback);
				try {
					if (response.login) {
						ga_vpv('/AddToCart/' + ga_jsonItemData.ga_type + '/RequireLoginSkipped');
					} else {
						ga_vpv('/AddToCart/' + ga_jsonItemData.ga_type + '/RequireLogin');
					}
				} catch (err2) {
					console.log("err2="+err2)
				}
				
				$('Container_Site').toggleClassName('logined',false);
				//Not login| error
				if (!response || !response.login || response.status!='ok') {
					var hasModal = false;
					// normal login popup
					$$('.modal.in').each(function(mbox) {
						jQuery(mbox).modal('hide');
						hasModal = true;
					});
					//if ($('signupModal').hasClassName('in'))
					//	jQuery('#signupModal').modal('hide');
					if (login_optional && response && (response.login===false) && (response.guest===true) && (response.status=="ok") ){
						// login is optional AND server allow quest
						//console.log("login_optional");
					}else if ($$('body.modal-open').length < 1 || !$('loginModal').hasClassName('in')) {
						var cookies = new ordering.cookieClass('/','.smartone.com');
						//Sign in
						var $loginModal = jQuery('#loginModal');
						$loginModal.off("show.bs.modal.ordering.login");
						//console.log("on 'show.bs.modal.ordering.login'");
						$loginModal.on('show.bs.modal.ordering.login', function (e) {
							//console.log("show.bs.modal.ordering.login");
							$('FormLogin').reset();
							if (cookies.get('remeber') && cookies.get('remeber') !== '') {
								$('TFPhone').value = cookies.get('remeber');
								$('sp').checked = true;
							}				
							$('loginErr').update('');
							
							$('loginModal').select('.has-feeback.has-error').each(function(field) {
								field.toggleClassName('has-error',false);
								field.down('.icon-icon-warning').toggleClassName('icon-icon-warning',false);
							})
							jQuery('#loginModal').find('.has-error').removeClass('has-error');
							jQuery('#loginModal').find('.with-errors').empty();
							
							if(ordering.bShowSP==true){
								jQuery('#login_new_acc').hide();
								jQuery('#MsgTop').show();
								jQuery('#loginModal h1.greeting').html("Special Handset Discount");
							}else{
								jQuery('#login_new_acc').show();
								jQuery('#MsgTop').hide();
								//jQuery('h1.greeting').html("Welcome to Online Store!!");	
								jQuery('#loginModal h1.greeting').html(ordering.msg["login__welcome"]);
							}
							if(modal_title != ""){
								jQuery('#loginModal h1.greeting').html(modal_title);
							}
							var $FormLogin = jQuery('#FormLogin');
							$FormLogin.off("submit.ordering.login");
							$FormLogin.validator({
								delay: 1500
								,feedback: {error:"icon-icon-warning"}
								,disable: false
							})
							/*
							.on('invalid.bs.validator',function(e) {
								var field = e.relatedTarget;
								if (field.readAttribute('name') == 'spe') {
									if (ordering.tmp.signup_email && ordering.tmp.signup_email.indexOf(field.value)) {
										//return false;
										field.up('.has-feeback').down('.form-control-feedback');
									}
								}
								//return true;
							})
							*/
							.on('submit.ordering.login', function (e) {
								//console.log("submit.ordering.login");
								if (e.isDefaultPrevented()) return false;
								e.preventDefault();
								
								$('FormLogin').TFPhone.value = $('FormLogin').TFPhone.value.replace(/[ ()]/g, '');
								
								ga_login('Submit');
								$('FormLogin').down('.button-action').toggleClassName('loading',true);
							//console.log('login_in?',$('loginModal').hasClassName('in'),$('FormLogin').down('.button-action'))
								
								$('loginErr').update('');
								ordering.api.fetch({
									url: '?login=1' + (no_redirect?"&no_redirect=1":"")
									,reset: true
									,method: 'post'
									,params: $('FormLogin').serialize()
								},function(response) {
									//console.log(response);
									$('FormLogin').down('.button-action').toggleClassName('loading',false);
									if (!response || !response.login || response.status!='ok') {
										login_fail(response);
										return;
									}
									
									login_success(response);
									callback && callback(response);
									login_success_callback && login_success_callback(response);
								});
								return false;
							})
						});
						
						/* Retargetting */
						jQuery('#frmTarget').attr('src', '/storefront/retargetting/' + sLang + '/4.1.html');
						var $loginModal = jQuery('#loginModal');
						//
						var fadeRemoved = false;
						if(hasModal){
							// when previously has modal, make the loginModal show instantly
							// to have modals out and in seamlessly
							if($loginModal.hasClass("fade")){
								$loginModal.removeClass("fade");
								fadeRemoved = true;
							}
						}
						//
						$loginModal.modal({
							backdrop:'static'
							,show:true
						});
						if(fadeRemoved){
							// restore fade style
							$loginModal.addClass("fade");
							// restore the backdrop fadeout style
							jQuery(".modal-backdrop.in").addClass("fade");
						}
					} else {
						login_fail(response);
						/*
						$('FormLogin').reset();
						var cookies = new ordering.cookieClass('/','.smartone.com');
						if (cookies.get('remeber') !== '') {
							$('TFPhone').value = cookies.get('remeber');
						}
						*/
					}
					
					if (response && response.captcha)
						$('loginModal').down('.captcha-cont').show();
					else
						$('loginModal').down('.captcha-cont').hide();
					callback && callback(response);
					return;
				}
				
				// hide existing modal
				jQuery('.modal.in').each(function() {
					jQuery(this).modal('hide');
				});
				
				//console.log('login_success?',response,typeof callback);
				//Logined
				login_success(response);
				callback && callback(response);
				login_success_callback && login_success_callback(response);
				
				} catch (err) {
					console.log('login_resp_err:',err);
					jQuery('#loginModal').modal('hide');
				}
			});
		} catch (err) {
			console.log('login_err:',err);
		}
		return false;
	}
	
	ordering.cart_total = function(total) {
		$$('.cart-total').each(function(tot) {
			if (total > 0)
				tot.update(total);
			tot.toggleClassName('hide',total < 1 ? true : false);
			//console.log('tot_child?',tot);
		});
	}
	
	ordering.SPricelogin = function(){
		var cus_dc = null;
		//Show special handset discount
		
		try{
			cus_dc = handsetDetailJSON.color_itms[0].storage[0].cus_dc_price;
			//console.log(cus_dc);
			if(cus_dc!="" && cus_dc!=null){
				//console.log("Show special handset discount");
				ordering.bShowSP = true;
				ordering.login();
				
				
			}
		}catch(err){
		//console.log('hs_discount_err:',err);
		}
	}
	
	ordering.logout = function(resp) {
		try {
		//console.log('logout_click...',resp);
			
			jQuery('#signoutModal').modal('toggle');
			if (resp === true) {
				ordering.api.fetch({
					url: '?logout=1'
					,method: 'post'
				},function(response) {
				// console.log('ologin_cb?',response);
					
						// console.log("ordering.logout");
						// Ajax.Responders.register ({
						// 	onLoading:
						// 		function(){
						// 			console.log("cookie_action loading...");
						// 		},
						// 	onComplete:
						// 		function(junk, xmlHttpObj){
						// 			console.log("cookie_action complete");
						// 		}
						// 	});
						// var url = 'https://webstage7a.smartone.com/jsp/cookie_action.jsp';
						// var queryString = 'cid=' + name;
						// var ajax = new Ajax.Request(url, {method:'post', parameters:queryString});  	

					// new Ajax.Request('https://webstage7a.smartone.com/jsp/cookie_action.jsp', {
					//   method:'post',
					//   onSuccess: function(transport) {
					//     // console.log("cookie_action onSuccess: " + response +", "+ response.status);
					// 	if (response && response.status === 'ok') {
					// 		document.location.href = "/"+sLangSEO+"/storefront/";
					// 	}
					//     // console.log("cookie_action onSuccess");
					//   },
					//   onFailure: function() { console.log('cookie_action Something went wrong...'); }
					// });
					deleteLoginCookie_ajax("/"+sLangSEO+"/storefront/");

					// deleteCookie("ecCok01", "/", ".smartone.com");
					// deleteCookie("ecCok02", "/", ".smartone.com");
					// deleteCookie("cart", "/", ".smartone.com");
					// deleteCookie("loginid", "/", ".smartone.com");
					// deleteCookie("cag_sid", "/", ".smartone.com");
					// deleteCookie("show_logout", "/", ".smartone.com");
					
					// if (response && response.status === 'ok') {
					// 	document.location.href = "/"+sLangSEO+"/storefront/";
					// }
				});			
			}
		} catch (err) {
		//console.log('logout_err:',err);
		}
	}
	ordering.loginForm = function() {
		ordering.login(function(resp) {
		//console.log('success?',resp);
		});
	}
	
	ordering.signup = function(key,event) {
		try {
		//console.log('signup....')
			var process = function(callback) {
				ordering.api.fetch({
					url: '?signup=1'
					,method: 'post'
					,params: $('signupForm').serialize()
				},function(response) {
				//console.log('signup_resp?',response);
					if (!response || response.status !== 'ok' || response.message) {
						callback && callback(response, response);
					} else {
						callback && callback(true, response);
					}
					
				});				
			}
			
			var invalid_signup = function(email) {
				if (!ordering.tmp.signup_email)
					ordering.tmp.signup_email = [];
				if (ordering.tmp.signup_email.indexOf(email) == -1)
					ordering.tmp.signup_email.push(email);
			}
			
		//console.log('signup?',key);
			$('signupModal').toggleClassName('signup',true);
			$('signupModal').toggleClassName('signup-fail',false);
			$('signupModal').toggleClassName('verify',false);
			$('signupModal').toggleClassName('complete',false);
			$('signupModal').toggleClassName('subscribe',false);
			if (key === false) return false;
		
			switch (key) {
				case 'resend' :
					process();
					return;
					break;
				case 'subscribe' :
					$('signupModal').toggleClassName('signup',false);
					$('signupModal').toggleClassName('subscribe',true);
					if ($('newsModal').hasClassName('in'))
						jQuery('#newsModal').modal('hide');
				default:
					if ($('loginModal').hasClassName('in'))
						jQuery('#loginModal').modal('hide');
					if (!$('signupModal').hasClassName('in')) {
						jQuery('#signupModal').modal({
							backdrop:'static'
							,show:true
						});
						jQuery('#signupModal').find('.has-error').removeClass('has-error');
						jQuery('#signupModal').find('.with-errors').empty();
						
						ga_vpv('/signIn/createAccount');
						$('signupForm').reset();
						$('signupForm').select('.has-feeback').each(function(block) {
							block.toggleClassName('has-error',false);
							block.toggleClassName('has-success',false);
							block.toggleClassName('field-focus',false);
							if (block.down('.icon-icon-warning'))
								block.down('.icon-icon-warning').toggleClassName('icon-icon-warning',false);
						})
						ordering.tmp.signup_pass = [];
					}
					break;
			}
			
			//console.log('signup_loaded...',key);
			/*
			jQuery('#signupForm input').on('focus enter',function(e) {
				//console.log('input_focus:',e.currentTarget,e);
				jQuery('#signupForm').find('.field-focus').removeClass('field-focus');
				jQuery(e.currentTarget).parents('.has-feeback').addClass('field-focus');
			})
			*/
			
			var signup_completed_with_guest = function(){
				//console.log("signup_completed_with_guest");
				var $signupModal = jQuery("#signupModal");
				
				$signupModal.toggleClass('signup',false);
				$signupModal.toggleClass('verify',false);
				$signupModal.toggleClass('complete',false);
				$signupModal.toggleClass('merging',true);
				
				//return;
				var doLogin = function(params, successCallback, failCallback){
					//console.log("doLogin");
					ordering.api.fetch({
						url: '?login=1'
						,method: 'post'
						,params: params
					},function(response) {
						//console.log(response);
					//console.log('signup_resp?',response);
						if (!response || response.status !== 'ok' || response.message) {
							failCallback(response);
						} else {
							successCallback();
						}
						
					});
				};
				
				var successCallback = function(){
					//console.log("success");
					window.location.reload(true);
				};
				
				var failCallback = function(response){
					//console.log("fail");
					//console.log(response);
					setTimeout(function(){
						doLogin(params, successCallback, failCallback);
					}, 5000);
				};
				
				var params = {
					TFPhone: jQuery("#signupForm").find("input[name='spe']").val(),
					TFPass : jQuery("#signupForm").find("input[name='spp']").val(),
					signup_login:"1"
				};
				
				var doLogout = function(successCallback, failCallback){
					//console.log("doLogout");
					ordering.api.fetch({
						url: '?logout=1'
						,method: 'post'
					},function(response) {
						//console.log(response);
						
						// deleteCookie("ecCok01", "/", ".smartone.com");
						// deleteCookie("ecCok02", "/", ".smartone.com");
						// deleteCookie("cart", "/", ".smartone.com");
						// deleteCookie("loginid", "/", ".smartone.com");
						// deleteCookie("cag_sid", "/", ".smartone.com");
						// deleteCookie("show_logout", "/", ".smartone.com");
						
						// successCallback();
						deleteLoginCookie_ajax("/"+sLangSEO+"/storefront/");
					});	
					
				};
				
				var logoutSuccessCallback = function(){
					doLogin(params, successCallback, failCallback);
				};
				
				var logoutFailCallback = function(){
					
				};
				
				doLogout(logoutSuccessCallback, logoutFailCallback);
				return;
				doLogin(params, successCallback, failCallback);
			};
			
			var signup_completed = function(){
				ordering.setTS(function() {
					window.location.reload(true);
				}, 3000);
			};
			
			jQuery('#spee').bind("cut copy paste",function(e) { e.preventDefault(); });
			jQuery('#spr').bind("cut copy paste",function(e) { e.preventDefault(); });
			
			var $signupForm = jQuery('#signupForm');
			$signupForm.off("submit.ordering.signup");
			$signupForm.validator({
				trigger: 'focusout'
				,html: 'html'
				,delay: 300
				,feedback: {error:""}
				,custom: {
					userfirst: function($el) {
						return ($el.val() && $el.val().replace(/\s/g,'')!=='' ? true : false);
					}
					,emailinvalid: function($el) {
						if ($el.val() && !$el.val().match(/^[-a-zA-Z0-9~!$%^&*_=+}{\'?]+(\.[-a-zA-Z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/ig)) {
							return false;
						}
						return true;
					}
					,emaildup: function($el) {
						if (ordering.tmp.signup_email && ordering.tmp.signup_email.indexOf($el.val()) != -1) {
							return false;
						}
						return true;
					}
					,passinvalid:function($el) {
						return $el.val() && ordering.tmp.signup_pass && ordering.tmp.signup_pass.indexOf($el.val()) != -1 ? false : true;
					}
					,passlen: function($el) {
						//$el.val($el.val().replace(/[\s\n\t\r]/g,''))
						return ($el.val() && $el.val().length >= 8 && $el.val().length <= 30 ? true : false);
					}
					,passwrd: function($el) {
						return ($el.val() && $el.val().match(/(^|.+?)[a-z]{1}/ig) ? true : false);
					}
					,passnum: function($el) {
						return ($el.val() && $el.val().match(/(^|.+?)[0-9]{1}/ig) ? true : false);
					}
					,passsym: function($el) {
						return ($el.val() && $el.val().match(/(^|.+?)[\W_]{1}/ig) ? true : false);
					}
				}
				,errors: {
					userfirst:'first'
					,emaildup: 'd'
					,emailinvalid: 'ei'
					,passwrd: 'w'
					,passnum: 'n'
					,passsym: 's'
					,passlen: 'l'
					,passinvalid: 'i'
				}
			})
			.on('submit.ordering.signup', function (e) {
				//console.log("submit.ordering.signup");
				if (e.isDefaultPrevented()) return false;
				e.preventDefault();
				
				$('signupErr').update('');
				process(function(response, actual_response) {
					
					if (response === true) {
						$('signupModal').toggleClassName('signup',false);
						$('signupModal').toggleClassName('signup-fail',false);
						$('signupModal').toggleClassName('verify',false);
						$('signupModal').toggleClassName('complete',true);
						ga_vpv('/signIn/createAccount/thankyou');
						
						// JL 2016-03-24
						if($("ku").checked){
							// to insert GA for signup eNewsletter when creating account
							//window.console && console.log("to insert GA for signup eNewsletter when creating account");
							ga_vpv('/signIn/createAccount/thankyouWithNewsletter');
						}else{
							//window.console && console.log("no need to insert GA for signup eNewsletter");
							// RL 2016-04-13
							ga_vpv('/signIn/createAccount/thankyouWithoutNewsletter');
							// End RL 2016-04-13
						}
						// JL 2016-03-24
						
						if (!$('signupModal').hasClassName('subscribe')) {
							
							if(actual_response && (actual_response.signup_guest=="Y")){
								signup_completed_with_guest();
							}else{
								signup_completed();
							}
							
						} else {
							$('signupModal').toggleClassName('t-vert',true);
						}
					} else {
						if (response.message) {
							if (response.err === -999 || response.message.match(/registered/ig)) {
								$('spe').up('.has-feeback').toggleClassName('invalid-focus',true);
								$('spe').up('.has-feeback').down('.help-block').update(response.message);
								invalid_signup($('spe').value);
								jQuery('#signupForm').validator('validate');
								$('spe').focus();
							} else if (response.err === -902 || response.message.match(/password/ig)) {
								//$('spp').value = '';
								//$('spr').value = '';
								if (!ordering.tmp.signup_pass)
									ordering.tmp.signup_pass = []
								if (ordering.tmp.signup_pass.indexOf($('spp').value) == -1)
									ordering.tmp.signup_pass.push($('spp').value);
								//$('spp').up('.has-feeback').toggleClassName('has-error',true);
								//$('spp').up('.has-feeback').down('.help-block').update(response.message);
								jQuery('#signupForm').validator('validate');
								$('spp').focus();
							}
						}else{
							$('signupModal').toggleClassName('signup',false);
							$('signupModal').toggleClassName('verify',false);
							$('signupModal').toggleClassName('complete',false);
							$('signupModal').toggleClassName('signup-fail',true);
						}
					}
					
				})
				return false;
			});
		} catch (err) {
		//console.log('signup_err:',err);
		}		
		return false;
	}
	ordering.signupverify = function(key) {
	//console.log('signup_verify?',key);
		try {
			$('signupModal').toggleClassName('signup',false);
			$('signupModal').toggleClassName('signup-fail',false);
			$('signupModal').toggleClassName('verify',true);
			$('signupModal').toggleClassName('complete',false);
			ga_vpv('/signIn/createAccount/verification');
			if (key === false) {
				//$('spee').value = '';
				//$('spp').value = '';
				jQuery('#signVerify').validator({
					feedback: {error:"icon-icon-warning"}
				})
				.on('submit', function (e) {
					if (e.isDefaultPrevented()) return false;
					e.preventDefault();
					
					ordering.api.fetch({
						url:'?verify=1'
						,method: 'post'
						,params: {
							e: $F('spe')
							,v: $F('spv')
						}
					},function(response) {
					//console.log('verify_resp:',response);
						$('signVerify').down('.button-action').toggleClassName('loading',false);
						if (response && response.status=='ok') {
							$('TFPhone').value = $F('spe');
							$('TFPass').value = $F('spp');
							
							$('signupModal').toggleClassName('signup',false);
							$('signupModal').toggleClassName('signup-fail',false);
							$('signupModal').toggleClassName('verify',false);
							$('signupModal').toggleClassName('complete',true);
							ga_vpv('/signIn/createAccount/thankyou');
							ordering.setTS(function() {
								window.location.reload(true);
								//if ($('signupModal').hasClassName('in'))
								//	jQuery('#signupModal').modal('hide');
								//ordering.login();
							}, 3000);
						} else {
							//if (response.message)
							//	$('signupErr').innerHTML = response.message;
							$('spv').value = '';
							jQuery('#signVerify').validator('validate');
						}
					});					
					return false;
				});
				return;
			}
			
			$('signVerify').down('.button-action').toggleClassName('loading',true);
			ordering.api.fetch({
				/*
				url: '/servlet/SmarTone.eCommCreateAccount'
				,method: 'GET'
				,params: {
					act: 'verify'
					,email: $F('spe')
					,v: $F('spv')
					,l:'e'
				}
				*/
				url:'?verify=1'
				,method: 'post'
				,params: {
					e: $F('spe')
					,v: $F('spv')
				}
			},function(response) {
			//console.log(response);
				if (response && response.status=='ok') {
					$('TFPhone').value = $F('spe');
					$('TFPass').value = $F('spp');
					ordering.setTS(function() {
						jQuery('#signupModal').modal('hide');
						$('signVerify').down('.button-action').toggleClassName('loading',false);
						ordering.login();
					}, 3000);
				} else {
					$('signVerify').down('.button-action').toggleClassName('loading',false);
					if (response.err_msg)
						$('signupErr').innerHTML = response.err_msg;
				}
			});
		} catch (err) {
		//console.log('signup_verify_err:',err);
			$('signVerify').down('.button-action').toggleClassName('loading',false);
		}		
		return false;
	}

	ordering.myaccount = function() {
		ordering.current._updateapi({
			params: {url:'?myacct=update'}
		},function(response) {
			
		})
	}
	
	ordering.timeout = function(resp) {
		if (typeof resp.force === 'undefined' && window.location.href.match(/\/storefront\/(index.jsp|\?|#)?$/g)) {
			cookies.clear('logined');
			return;
		}
		
		var cookies = new ordering.cookieClass('/','.smartone.com');
		if (!cookies.get('logined')) return;
		cookies.clear('logined');
		
		jQuery('#timeoutModal').on('hide.bs.modal', function (e) {
			var redirect = resp.redirect || null;
			if (resp.force === true)
				redirect = '/'+sLangSEO+'/storefront/';
			if (redirect)
				document.location.href = redirect;
			else
				document.location.reload(true);
		});
		
		var isFound = jQuery('.modal-box.in');
		if (isFound && isFound.length > 0)
			isFound.each(function(idx,box) {
				jQuery(box).on('hide.bs.modal', function (e) {
					jQuery('#timeoutModal').modal("show");
				})
				jQuery(box).modal('hide');
			});
		else {
			if (!$('timeoutModal').hasClassName('in'))
				jQuery('#timeoutModal').modal("show");
		}
	}
	
	ordering.alert = function(message,duration,callback) {
		if (duration === false && $('alertModal').hasClassName('in')) {
			jQuery('#alertModal').modal('hide');
			return;
		}
		if (message)
			jQuery('#alertModal').find('.alert-disp').html(message);
		if (duration !== -1) {
			// appended namespace "ordering.alert" to avoid collide
			jQuery('#alertModal').one('hide.bs.modal.ordering.alert', function (e) {
				callback && callback();
			});
			jQuery('#alertModal').one('shown.bs.modal.ordering.alert', function (e) {
				ordering.setTS(function() {
					jQuery('#alertModal').modal("hide");
				},duration || 3000);
			});
		}else{
			
		}
		jQuery('#alertModal').modal({
			keyboard: false,
			show: true
		});
	}

	ordering.cookie = {
	  
	  key: 'cookies',
	  
	  set: function(key, value, expire) {
	   var cookies = this.getCookies();
	   cookies[key] = value;
	   var src = Object.toJSON(cookies).toString();
	   this.setCookie(this.key, src, expire);
	  },
	  
	  get: function(key){
		  this.key = key;
	   if (this.exists(key)) {
		var cookies = this.getCookies();
		return cookies[key];
	   }
	   if (arguments.length == 2) {
		return arguments[1];
	   }
	   return null;
	  },
	  
	  exists: function(key){
	   return key in this.getCookies();
	  },
	  
	  clear: function(key){
	   var cookies = this.getCookies();
	   delete cookies[key];
	   var src = Object.toJSON(cookies).toString();
	   this.setCookie(this.key, src);
	  },
	  
	  getCookies: function() {
	   return this.hasCookie(this.key) ? this.getCookie(this.key).evalJSON() : {};
	  },
	  
	  hasCookie: function(key) {
	   return this.getCookie(key) != null;
	  },
	 
	  setCookie: function(key,value,expireTime) {
	   var expires = new Date();
	   expires.setTime(expireTime || expires.getTime()+1000*60*60*24)
	   document.cookie = key+'='+escape(value)+'; expires='+expires.toGMTString()+'; path=/';
	  },
	 
	  getCookie: function(key) {
	   var cookie = key+'=';
	   var array = document.cookie.split(';');
	   for (var i = 0; i < array.length; i++) {
		var c = array[i];
		while (c.charAt(0) == ' '){
		 c = c.substring(1, c.length);
		}
		if (c.indexOf(cookie) == 0) {
		 var result = c.substring(cookie.length, c.length);
		 return '{"'+key+'":"'+unescape(result)+'"}';
		};
	   }
	   return null;
	  }
	 }	
	
	ordering.cookieClass = Class.create({
		initialize: function(path, domain) {
			this.path = path || '/';
			this.domain = domain || null;
		},
		// Sets a cookie
		set: function(key, value, mins) {
			if (typeof key != 'string') {
				throw "Invalid key";
			}
			if (typeof value != 'string' && typeof value != 'number') {
				throw "Invalid value";
			}
			if (mins && typeof mins != 'number') {
				throw "Invalid expiration time";
			}
			var setValue = key+'='+escape(new String(value));
			if (mins) {
				var date = new Date();
				date.setTime(date.getTime()+(mins*1000*60));
				var setExpiration = "; expires="+date.toGMTString();
			} else var setExpiration = "";
			var setPath = '; path='+escape(this.path);
			var setDomain = (this.domain) ? '; domain='+escape(this.domain) : '';
			var cookieString = setValue+setExpiration+setPath+setDomain;
			document.cookie = cookieString;
		},
		// Returns a cookie value or false
		get: function(key) {
			var keyEquals = key+"=";
			var value = false;
			document.cookie.split(';').invoke('strip').each(function(s){
				if (s.startsWith(keyEquals)) {
					value = unescape(s.substring(keyEquals.length, s.length));
					throw $break;
				}
			});
			return value;
		},
		// Clears a cookie
		clear: function(key) {
			this.set(key,'',-1);
		},
		// Clears all cookies
		clearAll: function() {
			document.cookie.split(';').collect(function(s){
				return s.split('=').first().strip();
			}).each(function(key){
				this.clear(key);
			}.bind(this));
		}
	});
	
	ordering.optInAjax = function(params, successCallback, failCallback){
		var href = "/" + sLangSEO + "/storefront/ajax/opt_in_out_newsletter.jsp";
	
		// params = { email, by, eufa }
		ordering.api.fetch(
			{
				url: href,
				params: params
			}, 
			function(response){					
				//console.log(response);
				
				if( (response==null) || (response.status!="ok") ){
					failCallback(response);
				}else{
					successCallback();
				}
			}
		);
	};
	ordering.isStFrontdesk = function(){
		return jQuery("style[data-id='style-for-stfrontdesk']").length > 0;
	};

	ordering.enquiryProductDetail = function(){
		if (!ordering.isStFrontdesk()) {
			return;
		}
		
		var sSize = jQuery("#st-model-option .st-model-wrapper").children("a").filter(".selected").attr("data-model");	
		var sName = (jQuery(".st-prod-brand").length > 0 ? jQuery(".st-prod-brand:eq(0)").text()+" ":"") + jQuery(".st-prod-title:eq(0)").text() + (sSize?" "+sSize:"");
		var sColor = jQuery(".st-color-name").text();
		var sProductCode = jQuery(".st-details-view").attr("data-current-product-code");
		var sType = "";
		var sImgUrl = "";

		if (jQuery("meta[property='og:image']").attr("content").indexOf("handset") > -1){
			sType = "handset";
		} else if (jQuery("meta[property='og:image']").attr("content").indexOf("accessories") > -1){
			sType = "accessories";
		} else if (jQuery("meta[property='og:image']").attr("content").indexOf("prepaid") > -1){
			sType = "prepaid";
			sImgUrl = jQuery("meta[property='og:image']").attr("content");
		}
			
		var oData = {
			"product_name": sName,
			"product_color": (sColor?sColor:((sLang=="english")?ga_jsonItemData.items[0].color[0].color_name_eng:ga_jsonItemData.items[0].color[0].color_name_chi)),
			"product_code": (sProductCode?sProductCode:ga_jsonItemData.items[0].product_code),
			"items":[]
			}
		for (var i=0; i < ga_jsonItemData.items.length;i++){
			oData.items.push({
				"group_num": 1,
				"type": sType,
				"product_desc": (ga_jsonItemData.items[i].brand_name?ga_jsonItemData.items[i].brand_name+" ":"") + ((sLang=="english")?ga_jsonItemData.items[i].group_title_eng:ga_jsonItemData.items[i].group_title_chi) + (ga_jsonItemData.items[i].size?" "+ga_jsonItemData.items[i].size+" ":"") + ((sLang=="english")?ga_jsonItemData.items[i].color[0].color_name_eng:ga_jsonItemData.items[i].color[0].color_name_chi),
				"product_image": (sType == "prepaid")? sImgUrl:document.location.origin+"/"+sType+"/main/"+ga_jsonItemData.items[i].media[0]+".jpg",				
				"product_code": ga_jsonItemData.items[i].product_code,
				"link": ga_jsonItemData.items[i].detail_url,
				"nature": "enquiry",
				"remaining": 0
			})
		}	
		console.log(oData);
		redso.mobileApp("enquiry_product_detail", oData);
	}
	/*
	ordering.getHrefWithDomain = function(href){
		var $a = jQuery("<a></a>");
		$a.attr("href", href);
		var $body = jQuery("body");
		$body.append($a);
		var value = $a[0].href;
		$a.remove();
		return value;
	};
	
	// return true if success
	// return false if cant
	// if caller is a click event listener, should preventDefault() only if return true
	ordering.openInAppBrowser = function(href){
		if(typeof(redso) == "undefined"){
			return false;
		}
		try{
			//console.log(href);
			var href_with_domain = ordering.getHrefWithDomain(href);
			//console.log(href_with_domain);
			redso.mobileApp('open_in_app_browser', {"url": href_with_domain});
			return true;
		}catch(err){
			console.log(err);
		}
		return false;
	};

	ordering.initAnchorTargetForStFrontdesk = function(){
		if(!ordering.isStFrontdesk()){
			return;
		}
		//
		var changeAllToBlank = function($list){
			$list.not("[target='_blank']").each(function(){
				var $this = jQuery(this);
				
				console.log("anchor "+$this.attr("href") + " " + $this.attr("target"));
				$this.attr("target", "_blank");
				console.log("anchor "+$this.attr("href") + " " + $this.attr("target"));
				
			});
		};
		var chanegOpenWithExternal = function($a){
			var $ext = $a.filter("[data-open-with='external']");
			changeAllToBlank($ext);
		};
		var changePdf = function($a){
			var $pdf = $a.filter("[href$='.pdf']");
			//console.log("anchor $pdf = " + $pdf.length);
			changeAllToBlank($pdf);
		};
		var changeNonSelf = function($a){
			var $withTarget = $a.filter("[target]");
			var $nonSelf = $withTarget.not("[target='_self']");
			//console.log("anchor $nonSelf = " + $nonSelf.length);
			changeAllToBlank($nonSelf);
		};
		var changeNonSmartone = function($a){
			$a.each(function(){
				var hostname = this.hostname.toLowerCase();
				if(hostname != ""){
					if(!hostname.endsWith("smartone.com")){
						console.log("anchor " + hostname);
						changeAllToBlank(jQuery(this));
					}	
				}
			});
			
		};
		//
		console.log("anchor 0 initAnchorTargetForStFrontdesk");
		var $a = jQuery("a").not("[target='_blank']");

		try{
			console.log("anchor 1 " + $a.length);
			chanegOpenWithExternal($a);
			$a = $a.not("[target='_blank']");
			console.log("anchor 2 " + $a.length);
			changePdf($a);
			$a = $a.not("[target='_blank']");
			console.log("anchor 3 " + $a.length);
			changeNonSelf($a);
			$a = $a.not("[target='_blank']");
			console.log("anchor 4 " + $a.length);
			changeNonSmartone($a);
			$a = $a.not("[target='_blank']");
			console.log("anchor 5 " + $a.length);
		}catch(err){
			console.log(err);
		}
	};
	*/
	//ordering.triggerContentRendered = function(){
	//	jQuery("html").trigger("smt_content_rendered");
	//};
	//ordering.onContentRendered = function(){
	//	ordering.initAnchorTargetForStFrontdesk();
	//};
	ordering.newsletter = function(key) {
		if(ordering.isStFrontdesk()){
			return;
		}
		var $newsletterForm = jQuery("#newsRegister");
		var $newsModal      = jQuery("#newsModal");
		
		var changeToPassword = function(){
			$newsModal.toggleClass('step1', false);
			$newsModal.toggleClass('step2', true);
		};
		var changeToSuccess = function(){
			$newsModal.toggleClass('step1', false);
			$newsModal.toggleClass('step3', true);
		};
		var changeToFailed = function(){
			$newsModal.toggleClass('step1', false);
			$newsModal.toggleClass('step1-fail', true);
		};
		
		var callOptInAjax = function(){
			//console.log("callOptInAjax");
			var $optInEmail = $newsletterForm.find("#ne");
			var $optInSubmit= $newsletterForm.find("button.step1-disp");
			var eufa = $newsletterForm.find("[name='eufa']").val();
			$optInEmail.prop("disabled", true);
			$optInSubmit.prop("disabled", true);
			
			var successCallback = function(){
				//console.log("successCallback");
				changeToSuccess();
			};
			
			var failCallback = function(response){
				//console.log("failCallback");
				if(response && (response.account_exist=="Y")){
					changeToPassword();
				}else{
					changeToFailed();
				}		
			};
			
			var params = {
				email: $optInEmail.val(),
				eufa : eufa,
				by   : "email"
			};
			
			ordering.optInAjax(params, successCallback, failCallback);
		};
		var isStep1 = function(){
			return $newsModal.hasClass("step1");
		};
		
		try {
			$newsletterForm.validator({
				feedback: {error:"icon-icon-warning"}
				,custom: {
					passchk: function($el) {
					//console.log('pass_chk_func?',$el.parents('.pass-cont.pass-error'),$el);
						if ($el.parents('.pass-error').length > 0 && $el.val() == ordering.tmp.newspass) {
						//console.log('current?',$el.val(),jQuery('#ep').val());
							return false;
						}
						return true;
					}
				}
				,errors: {passchk:'Pass error'}
			})
			.on('submit',function(e) {
				if (e.isDefaultPrevented()) return false;
				e.preventDefault();
				
				if(isStep1()){
					callOptInAjax();
					return;
				}
				////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				var params = {}
				if ($('ne')) params.e = $('ne').value;
				if ($('ep')) params.p = $('ep').value;
				if ($('le')) params.o = $('le').value;
				
				ordering.api.fetch({
					url: '?newsletter=1'
					,method: 'post'
					,params: params
				},function(response) {
					//console.log('signup_resp?',response);
					if (!response || response.status !== 'ok' || response.message) {
						//callback && callback(response);
						if ($('ep').value !== '') {
							$('newsModal').down('.pass-cont').toggleClassName('pass-error',true);
							//$('newsModal').down('.pass-cont').toggleClassName('has-success',false);
							//$('newsModal').down('.pass-cont').toggleClassName('has-error',true);
							//$('newsModal').down('.pass-cont .form-control-feedback').toggleClassName('icon-icon-warning',true);
						}
						ordering.tmp.newspass = $('ep').value;
						jQuery('#newsRegister').validator('validate');
						return;
					}
					
					if (response.success) {
						var sucess_run = function() {
							ga_vpv('/popup/newsletterOffer/thankyou');
							//jQuery('#newsModal').modal('hide');
							//ordering.alert('Thank you for subscription of newsletter!');
							$('newsModal').toggleClassName('step2',false);
							$('newsModal').toggleClassName('step3',true);
						}
						
						if (response.login)
							ordering.login(sucess_run);
						else
							sucess_run();
						return;
					}
					
					switch(response.action) {
						case 'subscribe' :
							$('newsModal').toggleClassName('step1',false);
							$('newsModal').toggleClassName('step2',true);
							$('ep').enable();
							ga_vpv('/popup/newsletterOffer/password');
							break;
						case 'signup' :
							$('signupForm').reset();
							ordering.signup('subscribe');
							$('spe').value = $('ne').value;
							$('ku').checked = true;
							break;
					}
				});				
				return false;
			});

		jQuery('#newsModal').on('show.bs.modal', function() {
			cookies.clear('newsletter_client');
			cookies.set('newsletter_client','r',60*24*7);
		})
			
			if (key == 'logined') {
				$('newsModal').toggleClassName('step1',false);
				$('newsModal').toggleClassName('step2',true);
				return;
			}

			var cookies = new ordering.cookieClass('/','.smartone.com');
			var cookieNews = cookies.get('newsletter_client');
			var newsStatus = (typeof(NEWSLETTER_STATUS) != "undefined") ? NEWSLETTER_STATUS : false ;

			if (cookieNews !== false && cookieNews.match(/[rs]/)) return;
			if (newsStatus !== false && newsStatus.match(/[rs]/)) return;
			
			// NEWSLETTER_DELAY = 60
			// 1 for testing
			var NEWSLETTER_DELAY = 60; // seconds
			
			var show_newsletter = function() {
				ordering.setTS(function() {
					if ($$('body.modal-open').length < 1) {
						ga_vpv('/popup/newsletterOffer');
						jQuery('#newsModal').modal({
							backdrop:'static'
							,show:true
						});
					}
					else {
						if (ordering.tmp.newsTS) clearTimeout(ordering.tmp.newsTS);
						jQuery($$('.modal.in')[0]).one('hide.bs.modal', function () {
							cookies.clear('newsletter_client');
							cookies.set('newsletter_client','n');
							show_newsletter();
						});
					}
				},NEWSLETTER_DELAY*1000,ordering.tmp.newsTS);
			}
			
			if ( (cookieNews==='n') || (newsStatus==='n') || (!ordering.cookie.exists('newsletter_client') || ordering.cookie.get('newsletter_client') === 'n')) {
				show_newsletter();
			}
		} catch (err) {
		//console.log('news_err:',err);
		}
	};

	ordering.checkout = function(evt) {
		evt.preventDefault();
		var container = ordering.step && ordering.step.current && ordering.step.current._container() || null;
		if (container && container.hasClassName('loading')) return false;
		
		//if (evt.isDefaultPrevented && !evt.isDefaultPrevented())
		if (!ordering.tmp.checkout) {
			ordering.tmp.checkout = true;
			document.location.href = '/'+sLangSEO+'/storefront/cart.jsp';
		}
		return false;
	};

	ordering.checkTimeout = function() {
		var cookies = new ordering.cookieClass('/','.smartone.com');
		if (cookies.get('ecCok01') && cookies.get('ecCok02')) return true;
		if (!cookies.get('logined')) return true;
		
		ordering.timeout({force:true,redirect:'/'+sLangSEO+'/storefront/'});
		return false;
	};
	
	ordering.initProductTileColorChoice = function($tile){
		$tile.find('.color-choice.activated').on('click','span',function(e){
			var $target = jQuery(this); 
			var iHSID = $target.attr('hsid'); 
			var colorID = $target.attr('colorid'); 
			var type = $target.attr('type'); 
			var img = $target.closest('.tile-inner').find('figure img').first(); 
			
			img.attr('showingcolor', colorID);
			
			var sImgList = $target.attr('imgurl'); 
			var aryImgList = sImgList.split(",");
			
			if(aryImgList.length>1){
				img.attr('src', aryImgList[0]); 
			}else{
				img.attr('src', sImgList);
			}
			img.attr('hsid',iHSID);
			
			img.addClass('animated st-device-scale-increase'); 
			
			img.on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(){
				img.removeClass('animated st-device-scale-increase');
			});
		});
	};
	
	ordering.initProductTileThumbnailRollover = function($tile){
		var $img = $tile.find(".thumbnail_rollover");
		if($img.length==0)return;
		var child = $img[0];
		var aryColor = $tile.find('.colorswatch[hsid=' + jQuery(child).attr('hsid') + ']');
		// skip rollover effect when no color option at all
		if(aryColor.length==0) {
			return true; // break the each loop
		}

		jQuery(child).on('mouseover',function(evt) {
			var target = evt.target;
			var iShowingColor = jQuery(target).attr('showingcolor');
			var aryColor = $tile.find('.colorswatch[hsid=' + jQuery(target).attr('hsid') + ']');
			var sImgList = jQuery(aryColor[iShowingColor]).attr('imgurl');
			var aryImgList = sImgList.split(",");
			
			if(aryImgList.length>1){
				jQuery(target).fadeOut(400, 'swing', function() {
					jQuery(target).attr('src',  aryImgList[1]);
					jQuery(target).fadeIn(250, 'swing');
				});
				jQuery(target).attr('showingSeq', 1);
				timerRollOver = setInterval(
					function() {
						jQuery(target).fadeOut(400, 'swing', function() {
							var iNewSeq = parseInt(jQuery(target).attr('showingSeq')) + 1;
							iNewSeq = iNewSeq % aryImgList.length;
							jQuery(target).attr('showingSeq', iNewSeq);
							jQuery(target).attr('src', aryImgList[iNewSeq]);
							jQuery(target).fadeIn(250, 'swing');
						});
					},
					3000
				);
			}
			
		});
		
		jQuery(child).on('mouseout',function(evt) {
			if (timerRollOver != null) clearTimeout(timerRollOver);
			
			var target = evt.target;
			var iShowingColor = jQuery(target).attr('showingcolor');
			var aryColor = $tile.find('.colorswatch[hsid=' + jQuery(target).attr('hsid') + ']');
			var sImgList = jQuery(aryColor[iShowingColor]).attr('imgurl');
			if (sImgList && sImgList != '') {
				var aryImgList = sImgList.split(",");
				
				jQuery(target).fadeOut(400, 'swing', function() {
					jQuery(target).attr('showingSeq', 0);
					jQuery(target).attr('src', aryImgList[0]);
					jQuery(target).fadeIn(250, 'swing');
				});
			}
		});
		
	};
	
	// when clicking a hyperlink, run the async function as well
	// cover normal left click and ctrl click (open link in new tab)
	ordering.addAsyncToLink = function(a, asyncFunctionWithCallback){
		var $a = jQuery(a);
		$a.on("click.addAsyncToLink", function(e){
			var openNew = false;
			try{
				if(e.ctrlKey){
					//console.log("ctrl click");
					openNew = true;
				}else if(e.metaKey){
					//console.log("Command down");
					openNew = true;
				}
			}catch(error){}
			if(openNew){
				//console.log("open new");
				asyncFunctionWithCallback();
			}else{
				//console.log("open current");
				e.preventDefault();
				asyncFunctionWithCallback(function(){
					//console.log("fire callback");
					window.location.href = $a.attr("href");
				});
			}
		});
	};
	
	ordering.addGaProductClickByList = function(a, ga_sListName, ga_list_position){
		ordering.addAsyncToLink(a, function(callback){
			ga_productclickbylist(ga_sListName, ga_list_position, callback);
		});
	};
	
	ordering.productTile_appendItemsCallback = function($itemsWrapper, start, items, ga_sListName, callback){
		if(items.length==0) {
			callback();
			return;
		}
		var FADE_IN_DUR = 100;
		var isMobile = jQuery("body").hasClass("mobile");
		
		var ROW_SIZE = (isMobile)?2:3;
		var len      = items.length;
		var index    = 0;			
		var $row     = null;		
		
		// bottom border of existing grids
		var $childrenRows = $itemsWrapper.children(".auto-load-more-row");
		if($childrenRows.length==0){
			$itemsWrapper.prev(".st-tile-row").addClass("st-border-bottom");	
		}else{
			$row = $childrenRows.last();
			if($row.children().length == ROW_SIZE){
				$row = null;
			}
		}
		
		var showNext = function(){
			if(len == index){
				callback();
				return;
			}
			if($row == null){
				$row = jQuery("<div class='row auto-load-more-row'></div>");
				$itemsWrapper.children(".row").last().addClass("st-border-bottom");
				$itemsWrapper.append($row);
			}
			
			var $tile = jQuery("<div class=\"st-prod-tile st-prod-tile-md col-md-4 st-mob-col-xs-6\"></div>");
			var obj = items[index];
			var html = obj.html;
			var $inner = jQuery(html);
			//var json = obj.json;
			$tile.append($inner);
			var $a = $inner.children("a");
			if($a.length > 0){
				var ga_list_position = start+index;
				ordering.addGaProductClickByList($a[0], ga_sListName, ga_list_position);
			}
			$row.append($tile);

			if(!isMobile){
				ordering.initProductTileColorChoice($tile);
				ordering.initProductTileThumbnailRollover($tile);
			}

			var numChildren = $row.children().length;
			if(numChildren != ROW_SIZE){
				$tile.addClass("st-border-right");
			}
			$tile.hide();
			$tile.fadeIn(FADE_IN_DUR, function(){
				showNext();
			});					
			index++;
			if(ROW_SIZE == numChildren){
				$row = null;
			}
		};
		showNext();
	};
	
	// $target.length should be 1
	// $itemsWrapper.length should be 1
	// appendItemsCallback($itemsWrapper, start, items, ga_sListName, onCompleteCallback)
	//
	// sample $target <div data-href="..." data-type="accessory" data-method="group_id"	data-exclude="1695,1448" data-num="3" ></div>
	ordering.initAutoLoadMore = function($target, $itemsWrapper, appendItemsCallback){
		
		var initElement = function(el){
			var $el     = jQuery(el);
			var IS_BUSY = "isBusy.autoLoadMore";
			var INVIEW  = "inview.autoLoadMore";
			var HREF    = "data-href";
			// 
			// busy
			var isBusy = function(){
				return $el.data(IS_BUSY) === true;
			};
			var setBusy = function(){
				$el.data(IS_BUSY, true);
			};
			var unsetBusy = function(){
				$el.data(IS_BUSY, false);
			};
			// inview
			var unsetInview = function(){
				$el.removeData(INVIEW);
			}
			var setInview = function(inview){
				$el.data(INVIEW, inview);
			};
			var getInview = function(){
				return $el.data(INVIEW);
			};
			var setupInview = function(){
				var inview  = new Waypoint({
					element: el,
					handler: onEnter,
					offset : "150%"
				});
				/*
				var inview = new Waypoint.Inview({
					element: el,
					enter  : onEnter
				});
				*/
				setInview(inview);
			};
			var destroyInview = function(){
				var inview = getInview();
				if(inview == null) return;
				//console.log("inview.destroy");
				inview.destroy();
				unsetInview();
			};
			//
			var onEnter = function(direction){
				//console.log("onEnter "+direction);
				if(direction!="down")return;
				var href = $el.attr(HREF);
				if( (href==null) || (href=="") ){					
					destroyInview();
					return;
				}
				//console.log("href = "+ href);
				if(isBusy()) {
					//console.log("busy");
					return;
				}
				doLoadMore(href);
			};
			var getLoadNum = function(){
				return parseInt($el.attr("data-num"));
			};
			var setLoadStart = function(start){
				$el.attr("data-start", start);
			};
			var getLoadStart = function(){
				var start = $el.attr("data-start");
				if(start==null) return 0;
				return parseInt(start);
			};
			var getLoadMethod = function(){
				return $el.attr("data-method");
			};
			var getLoadType = function(){
				return $el.attr("data-type");
			};
			var getLoadExclude = function(){
				var exclude = $el.attr("data-exclude");
				if(exclude==null) return "";
				return exclude;
			};
			var getGaListName = function(){
				var gaListName = $el.attr("data-ga-list-name");
				if(gaListName==null) return "";
				return gaListName;
			};
			// loading
			var setLoading = function(){
				var spinner = $el.data("spinner.autoLoadMore");
				if(spinner == null){
					var opts = {
						color: '#cccccc'
					};
					spinner = new Spinner(opts).spin(el);
					$el.data("spinner.autoLoadMore", spinner);					
				}else{
					spinner.spin(el);
				}				
				$el.addClass("auto-load-more--loading");
			};
			var unsetLoading = function(){
				var spinner = $el.data("spinner.autoLoadMore");
				spinner.stop();
				$el.removeClass("auto-load-more--loading");
			};
			//
			var processGa = function(start, items, ga_sListName){
				var list = [];
				for(var i=0; i<items.length ; i++){
					var item = items[i];
					list.push(item.json);
				}
				
				var ga_aryListProduct = list;
				var ga_iStartIndex    = start;
				
				//console.log(ga_aryListProduct);
				//console.log(ga_iStartIndex);
				//console.log(ga_sListName);
				ga_product_list(ga_aryListProduct, ga_iStartIndex, ga_sListName);
			};
			var processResult = function(response, start){
				//console.log(response.items.length);
				var finishCallback = function(){
					unsetBusy();
					//console.log("no more items");
				};
				var continueCallback = function(){
					unsetBusy();					
					setupInview();					
				};
				if(response.items == null){
					finishCallback();
					return;					
				}
				setLoadStart(start + response.items.length);
				var callback = function(){
					if(response.remain === false){
						//console.log("remain is false");
						finishCallback();
						return;
					}					
					continueCallback();					
				};
				var ga_sListName = getGaListName();
				processGa(start, response.items, ga_sListName);
				appendItemsCallback($itemsWrapper, start, response.items, ga_sListName, callback);				
			};
			// skip the num
			var processFailed = function(start,size){
				//console.log("processFailed " +size)
				//setLoadStart(start + size);
				unsetBusy();					
				//setupInview();
			};
			var doLoadMore = function(href){
				setBusy();
				setLoading();
				destroyInview();	
				var size   = getLoadNum();
				var start  = getLoadStart();
				var lang   = window.sLang;
				var method = getLoadMethod();
				var product_type = getLoadType();
				var exclude= getLoadExclude();
				//console.log("doFetch");
				var doFetch = function(){
					ordering.api.fetch(
						{ 
							url: href,
							params: {
								start  : start,
								size   : size,
								lang   : lang,
								method : method,
								exclude:exclude,
								product_type:product_type
							}
						}, 
						function(response){					
							//console.log(response);
							unsetLoading();
							if( (response==null) || (response.status!="ok") ){
								processFailed(start,size);
							}else{
								processResult(response, start);
							}
						}
					);	
				};
				doFetch();				
			};
			// start
			setupInview();
		};
		
		if($target.length != 1) return;
		if($itemsWrapper.length != 1) return;
		
		initElement($target[0]);		
	};

	ordering.isNewOwlCarousel = function(){     
        try{
            var $div = jQuery("<div></div>");
            $div.owlCarousel();
            var data = $div.data("owlCarousel");
            return (data.constructor.name == "Owl");
        }catch(error){}
        return false;
    };
    ordering.loadingModal = function(options){
        var $loading = jQuery("<div id='loading-modal'><div class='loading-modal__table'><div class='loading-modal__cell'></div></div></div>");
        $loading.addClass("modal modal-box overlay");
        $loading.attr("data-backdrop", "static");
        $loading.attr("data-keyboard", "false");
        $loading.modal('show');
        //
        var opts = {
            color: '#fff'
        };
        if(options){
        	if(options.className){
        		opts.className = options.className;
        	}
        }
        var target = $loading.find(".loading-modal__cell")[0];
        var spinner = new Spinner(opts).spin(target);
        $loading.data("spinner", spinner);
    };
    ordering.unloadingModal = function(){
        var $loading = jQuery("#loading-modal");
        if($loading.length==0) return;
        var spinner = $loading.data("spinner");
        spinner.stop();
        $loading.modal('hide');
        $loading.remove();
    };
	ordering.htmlToggleSupportCopy = function(){
		var supportCopy = ordering.browserSupportCopy();
		if(supportCopy){
			jQuery("html").addClass("browser-support-copy");
		}else{
			jQuery("html").removeClass("browser-support-copy");
		}
	};
	ordering.browserSupportCopy = function(){
		try{
			var support = !!document.queryCommandSupported;
			return support && !!document.queryCommandSupported("copy");
		}catch(error){
			window.console && console.log(error);
		}
		return false;
	};
	ordering.browserSupportCut = function(){
		try{
			var support = !!document.queryCommandSupported;
			return support && !!document.queryCommandSupported("cut");
		}catch(error){
			window.console && console.log(error);
		}
		return false;
	};
	ordering.isLoggedIn = function(){
		return jQuery("#Container_Site").hasClass("logined");
	};
	ordering.promptForLogin = function(){		
		console.log("isLoggedIn? "+ ordering.isLoggedIn());
		if(!ordering.isLoggedIn()){
			ordering.login();
		}
	};
})();


jQuery(document).ready(function(){
	var initNavBarGA = function(){
		if(jQuery("body").hasClass("mobile")){
			return;
		}
		//
		var EVENT_CATEGORY = "Navigation Bar";
		var EVENT_ACTION   = "Click";
		var hitCallback = function(e,a){
			//var label = jQuery(a).attr("data-ga-label");
			//console.log(label);
			//console.log("ctrlKey="+e.ctrlKey);
			//console.log("metaKey="+e.metaKey);
			var href = jQuery(a).attr("href");
			window.location.href = href;
		};
		var isOpenNew = function(e){
			return e.ctrlKey || e.metaKey;
		};
		//
		var onclick = function(e, a){
			var eventLabel = jQuery(a).attr("data-ga-label");
			// to avoid ad-block, let it open
			if(isOpenNew(e)){
				ga("send", "event", {
					eventCategory: EVENT_CATEGORY,
					eventAction  : EVENT_ACTION,
					eventLabel   : eventLabel
				});
			}else{
				e.preventDefault();
				var timer = setTimeout(function(){
					timer = null;
					hitCallback(e,a);
				}, 1000);
				ga("send", "event", {
					eventCategory: EVENT_CATEGORY,
					eventAction  : EVENT_ACTION,
					eventLabel   : eventLabel,
					hitCallback  : function(){
						if(timer != null){
							clearTimeout(timer);
							timer = null;
							hitCallback(e,a);
						}
					}
				});	
			}
		};
		//
		jQuery("#mainNav").find("a[data-ga-label]").on("click", function(e){
			try{
				onclick(e, this);
			}catch(error){
				hitCallback(e, this);
			}
		});
	};
	
	var initCustomerReview = function(){
		if(!window.CustomerReview){
			//window.console && console.log("requires CustomerReview");
			return;
		}
			
		CustomerReview.initAllCommentsWidgets();
		
		// override 
		CustomerReview.loginCallback = function(callback){
			
			var loginCB = function(response){
				//console.log("loginCB response="+response);
			};
			var modal_title = (window.sLang == "english")?"Login to rate this product":"立 即 登 入 評 價 此 產 品";
			var options = {
				no_redirect: true,
				modal_title: modal_title,
				login_success_callback: function(response){
					//console.log("login_success_callback response="+response);
					callback && callback(response.eufa);
				}
			};
			ordering.login(loginCB, options);
			//ordering.login(callback, {login_optional:false, no_redirect:false});
		};
	};
	
	var png2jpg = function(src){
		var lastIndexOf = src.lastIndexOf(".png");
		if(lastIndexOf == -1) return src;
		if((src.length - lastIndexOf) != 4) return src;
		return src.substring(0,lastIndexOf) + ".jpg";
	}
	var img_png2jpg = function($img){
		var src = $img.attr("src");
		var jpgsrc = png2jpg(src);
		if(src == jpgsrc) return;
		$img.attr("data-o-src", src);
		$img.attr("src", jpgsrc);		
	};
	var fixOverlayBag = function($trigger){
		var $images = $trigger.find("#cartPopList .cart-item-row figure img");
		$images.each(function(){
			img_png2jpg(jQuery(this));
		});
	};
	
	jQuery(".st-store-controls").mouseenter(function(){
		fixOverlayBag(jQuery(this));
	});
	
	///////////////////////////////////////////////////////////////////////////////////
	var preventModalBackgroundTouchMove = function(){
		var $body = jQuery("body");
		function is_touch_device() {
			return (('ontouchstart' in window)
			  || (navigator.MaxTouchPoints > 0)
			  || (navigator.msMaxTouchPoints > 0));
		}
		function is_not_mobile() {
			return !$body.hasClass("mobile");
		}
		/*
		function add_rules(){
			var $style = jQuery("<style></style>");
			var rules = "body.modal-open{position:fixed; width: 100%; overflow:hidden;}";
			$style.append(rules);
			$body.append($style);
		}
		*/
		var add_listeners = function(){
			var scrollPos = 0;
			jQuery('.modal')
			.on('show.bs.modal.preventModalBackgroundTouchMove', function (){
				scrollPos = jQuery('body').scrollTop();
				jQuery('body').css({
					overflow: 'hidden',
					position: 'fixed',
					top : -scrollPos
				});
			})
			.on('hide.bs.modal.preventModalBackgroundTouchMove', function (){
				jQuery('body').css({
					overflow: '',
					position: '',
					top: ''
				}).scrollTop(scrollPos);
			});
		};
		try{			
			if(is_touch_device()){
				//add_rules();
				add_listeners();
			}
		}catch(error){}
	};
	preventModalBackgroundTouchMove();
	///////////////////////////////////////////////////////////////////////////////////
	var initPopupContent = function(){
		var $popupContent = jQuery(".popup-content");
		if($popupContent.length==0) return;
		var $first = $popupContent.eq(0);
		var dataPopupDelay = $first.attr("data-popup-delay");
		var delay = 0;
		if((dataPopupDelay!=null) && (dataPopupDelay!="")){
			try{
				delay = parseInt(dataPopupDelay);
			}catch(error){}
		}
		$first.find("[data-role='popup-content__close-button']").on("click", function(){
			$first.modal("hide");
		});
		setTimeout(function(){
			$first.modal("show");
		}, delay);
	};
	/*
	var initOpenWithExtBrowser = function(){
		if(!ordering.isStFrontdesk()){
			return;
		}
		jQuery("body").on("click", "a[data-open-with='external']", function(e){
			var a = jQuery(this)[0];
			var href = a.href;

			if(ordering.openInAppBrowser(href)){
				e.preventDefault();
			}else{
			}
			
		});
	};
	*/
	
	//
	
	initNavBarGA();
	
	initPopupContent();
	
	initCustomerReview();

	//ordering.initAnchorTargetForStFrontdesk();
	//jQuery("html").on("smt_content_rendered", function(){
	//	ordering.onContentRendered();
	//});
});