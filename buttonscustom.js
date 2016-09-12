// Recommended AMD module pattern for a Knockout component that:
//  - Can be referenced with just a single 'require' declaration
//  - Can be included in a bundle using the r.js optimizer
define(['text!./buttonscustom.html'], function( htmlString) {
function Buttonscustom( params) { 
		var self = this;
		self.params = params;
//debugger;		
		self.form = ko.observable();//params.form);
		
		// SETTINGS
		self.enableSaveUpdateDeleteButtonOnForms = (params.save != undefined) ? params.save : false; //self.form()._formSettings
		self.enableCancelButtonOnSubmittedOrProcessingForms = (params.cancel != undefined) ? params.cancel : true;
		self.enableDeleteButtonOnApprovedForms = (params.deletesubmitted != undefined) ? params.deletesubmitted : true;
		
        // SUBMIT
        self._formButtonSubmitClick = function () {
		
		var validchk1 = self.form()._formValidate();
		var validchk2 = validateCustom(); 		
        if (validchk1 == false || validchk2 == false) {
            return;
        };				
            self.form().mwp_FormState(self.form()._formStates.SUBMITTED);
            self.form()._formModerationStatus(2); //SPModerationStatusType.Pending; -- will be applied only for Moderation Mode = DRAFT
            self.form()._formSave();
        };			
        self._formButtonSubmitEnabled = ko.pureComputed(function () {
			if( self.form()) {
				//var b = (self.form().mwp_FormState() == self.form()._formStates.DRAFT);
				var b = (self.form()._formReadOnly() == false);
				return (b.toString().toLowerCase() == 'true') ? true : false;
			}
			return false;
        });
		/**
		 * SUBMIT FORM BUTTON
		 */
		self.enableFormsCommandSubmit = function() {
			return self._formButtonSubmitEnabled();
		};
		self.actionFormsCommandSubmit = function() {
			self._formButtonSubmitClick();
		};
        // CANCEL
        self._formButtonCancelClick = function () {
			if( self.form()) {
				self.form().mwp_FormState(self.form()._formStates.CANCELLED);
				if (self.form()._formModerationStatus() == 2) //SPModerationStatusType.Pending
					self.form()._formModerationStatus(3); //SPModerationStatusType.Draft; -- will be applied only for Moderation Mode = DRAFT
				self.form()._formSave();
			}
			return false;
        }
        self._formButtonCancelEnabled = ko.computed(function () {
			if( self.form()) {
				var b = (((self.form().mwp_FormState() != self.form()._formStates.DRAFT) && (self.form().mwp_FormState() != self.form()._formStates.CANCELLED)) // cancel enabled always, except Draft or Cancelled
						&& (self.form()._formReadOnly() == false) // read only form can't have cancel button
						&& self.enableCancelButtonOnSubmittedOrProcessingForms); // cancel enabled via options
				return (b.toString().toLowerCase() == 'true') ? true : false;
			}
			return false;
        });
        // DELETE
        self._formButtonDeleteClick = function () {
            self.form()._formDelete();
        };
		self._formApproved = function () {
			if (self.form()._formEnableModeration()) return (self.form()._formModerationStatus() == 0);
			return true;
		};
        self._formButtonDeleteEnabled = ko.pureComputed(function () {
			if( self.form()) {
				var moderation;
				if (self.form()._formModerationMode() == self.form()._formModerationModeLevel.DISABLED) {
					moderation = (!self._formApproved()) || ((self._formApproved() && ( self.enableDeleteButtonOnApprovedForms || ((self.form().mwp_FormState() == self.form()._formStates.DRAFT) && self.enableSaveUpdateDeleteButtonOnForms) )));
				}
				else {
					moderation = ((!self._formApproved() || !self.form()._formEnableModeration()) || self.enableDeleteButtonOnApprovedForms);// if moderation is enabled -> then any moderation state enables delete, except APPROVED
				}
				var b_draft = ((self.form().mwp_FormState() == self.form()._formStates.DRAFT) && (self.enableSaveUpdateDeleteButtonOnForms));
				var b_submitted = ((self.form().mwp_FormState() != self.form()._formStates.DRAFT) && (!self._formButtonCancelEnabled()) && self.enableDeleteButtonOnApprovedForms);
				var b = (!self.form()._formNew() // the new, not created yet form, can't have delete button
				    && (self.form()._formReadOnly() == false) // read only form can't have delete button
					&& moderation && ( b_draft || b_submitted));
				return (b.toString().toLowerCase() == 'true') ? true : false;
			}
			return false;
        });
		/**
		 * DELETE FORM BUTTON
		 */
		self.enableFormsCommandDelete = function() {
			return self._formButtonDeleteEnabled();
		};
		self.actionFormsCommandDelete = function() {
			self._formButtonDeleteClick();
		};
        // SAVE
        self._formButtonSaveClick = function () {
		var validchk1 = self.form()._formValidate();
		var validchk2 = validateCustom(); 		
        if (validchk1 == false || validchk2 == false) {
            return;
        };				
            self.form().mwp_FormState(self.form()._formStates.DRAFT); // Saved form is always in Draft state
            self.form()._formModerationStatus(3);//SPModerationStatusType.Draft; -- will be applied only for Moderation Mode = DRAFT
            self.form()._formSave();
        };			
        self._formButtonSaveEnabled = ko.pureComputed(function () {
			if( self.form()) {
				var b = ((self.form().mwp_FormState() == self.form()._formStates.DRAFT) // Form can be saved only while in Draft state 
					 && (self.form()._formReadOnly() == false) // read only form can't have save button
					 && ((self.form()._formModerationMode() == self.form()._formModerationModeLevel.DRAFT) || (self.enableSaveUpdateDeleteButtonOnForms)));
				return (b.toString().toLowerCase() == 'true') ? true : false;
			}
			return false;
        });
		/**
		 * SAVE FORM BUTTON
		 */
		self.enableFormsCommandSave = function() {
			return self._formButtonSaveEnabled();
		};
		self.actionFormsCommandSave = function() {
			self._formButtonSaveClick();
		};

        // CLOSE
        self._formButtonCloseClick = function () {
            self.form()._formRedirectToList();
        }
        self._formButtonCloseEnabled = ko.pureComputed(function () {
            return true;
        });
		self._formLoadForm = function() {
			//self.form()._formInitialize();
		};
		/**
		 * CANCEL FORM BUTTON
		 */
		self.enableFormsCommandCancel = function() {
			return self._formButtonCloseEnabled();
		};
		self.actionFormsCommandCancel = function() {
			self._formButtonCloseClick();
		};

		// Proxy method:  delete list item
		self.Init = function() {
						
			self.form()._formModerationMode((self.params.moderation != undefined) ? self.params.moderation : "Disabled");
			self.form()._formUniqueIDMethod((self.params.counter != undefined) ? self.params.counter : "Counter" );//this._formSettings.UniqueIDMethod);
			
			self._formLoadForm();
		};
	}
    // Use prototype to declare any public methods
    //componentButtons.prototype.doSomething = function() { ... };
	Buttonscustom.prototype.schema = {
		"Params": {
			"save": true,
			"cancel": true,
			"deletesubmitted": true,
			"moderation": "Draft",
			"uniqueid": "Counter"
		}
	};

	
	ko.bindingHandlers.initBT = {
		init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			//viewModel.form = bindingContext.$parent;
			viewModel.form( bindingContext.$root);
			viewModel.Init();
			
			if( viewModel.form()._formIsSearchContext == false) {
				requirejs( ["ribbonEdit"], 
					function(ribbon) {
						viewModel.ribbon = ribbon;
						ribbon.Toolbar = viewModel;
						RefreshCommandUI();
					});
			}
		}
	};  
    // Return component definition
    return { viewModel: Buttonscustom, template: htmlString };
});
// Custom form validation called on formsave and combined with Parsley check.
function validateCustom()
{
	var valid = true;	
	if (validStartDt() == false){valid = false};
	if (validEndDt() == false){valid = false};	
	//if (validateAttachDoc(false) == false) {valid = false};	
	//if (validateAttachCert(false) == false) {valid = false};		
	return valid;
}
//Checks for the following: Date is required, valid date, start date before end date.
function validStartDt()
{
	var dStart = new Date($('#event-Start').val()); 
	var dEnd = new Date($('#event-End').val()); 	
	var dToday = new Date(); 
	dToday.setDate(dToday.getDate()-1); 
	//Check if start date is entered.
	if ($('#event-Start').val() == '')
	{
		$('#event-Start').removeClass("parsley-success");
		$('#event-Start').addClass("parsley-error");
		$('#startDt-Before-Msg').hide();
		$('#startDt-Valid-Msg').hide();			
		$('#startDt-AfterEnd-Msg').hide();			
		$('#startDt-Req-Msg').show();
		return false;
	}
	//Check if valid date.
	else if (dStart == 'Invalid Date')
	{
		$('#event-Start').removeClass("parsley-success");
		$('#event-Start').addClass("parsley-error");
		$('#startDt-Before-Msg').hide();
		$('#startDt-AfterEnd-Msg').hide();			
		$('#startDt-Req-Msg').hide();	
		$('#startDt-Valid-Msg').show();		
		return false;
	}
	//check if start date is before today.
	else if (dStart <= dToday)
	{
		$('#event-Start').removeClass("parsley-success");
		$('#event-Start').addClass("parsley-error");
		$('#startDt-Req-Msg').hide();
		$('#startDt-Valid-Msg').hide();			
		$('#startDt-AfterEnd-Msg').hide();			
		$('#startDt-Before-Msg').show();
		return false;
	}
	//check if start date is after end date.
	else if (dEnd < dStart && $('input[name="OneDayEvent"]:checked').val() != "Yes")
	{
		$('#event-Start').removeClass("parsley-success");
		$('#event-Start').addClass("parsley-error");
		$('#startDt-Req-Msg').hide();
		$('#startDt-Valid-Msg').hide();			
		$('#startDt-Before-Msg').hide();	
		$('#startDt-AfterEnd-Msg').show();
		return false;
	}
	else
	{	
		if ($('#event-Start').hasClass("parsley-error")==true)
		{
			$('#event-Start').removeClass("parsley-error");		
			$('#event-Start').addClass("parsley-success");
		}	
		$('#startDt-Req-Msg').hide();
		$('#startDt-Valid-Msg').hide();			
		$('#startDt-Before-Msg').hide();	
		$('#startDt-AfterEnd-Msg').hide();	
		$('#endDt-BeforeStart-Msg').hide();	
		if($('#endDt-Req-Msg').is(':hidden') && $('#endDt-Valid-Msg').is(':hidden') && $('#endDt-Before-Msg').is(':hidden') && $('#endDt-BeforeStart-Msg').is(':hidden'))
		{ 		
			$('#event-End').removeClass("parsley-error");			
		}			
		return true
	}
}
//Checks for the following: Date is required, valid date, start date before end date.
function validEndDt()
{
	//If event is only 1 day then end date does not need validation.
	if ($('input[name="OneDayEvent"]:checked').val() == "Yes")
	{
		return true
	}
	var dStart = new Date($('#event-Start').val()); 
	var dEnd = new Date($('#event-End').val()); 	
	var dToday = new Date(); 
	dToday.setDate(dToday.getDate()-1); 
	//Check if end date is entered.
	if ($('#event-End').val() == '')
	{
		$('#event-End').removeClass("parsley-success");	
		$('#event-End').addClass("parsley-error");
		$('#endDt-Before-Msg').hide();
		$('#endDt-Valid-Msg').hide();			
		$('#endDt-AfterStart-Msg').hide();	
		$('#endDt-Req-Msg').show();
		return false
	}
	//Check if valid date.
	else if (dEnd == 'Invalid Date')
	{
		$('#event-End').removeClass("parsley-success");
		$('#event-End').addClass("parsley-error");
		$('#endDt-Before-Msg').hide();
		$('#endDt-AfterEnd-Msg').hide();			
		$('#endDt-Req-Msg').hide();	
		$('#endDt-Valid-Msg').show();		
		return false;
	}
	//check if end date is before today.
	else if (dEnd <= dToday)
	{
		$('#event-End').removeClass("parsley-success");
		$('#event-End').addClass("parsley-error");
		$('#endDt-Req-Msg').hide();
		$('#endDt-Valid-Msg').hide();					
		$('#endDt-BeforeStart-Msg').hide();	
		$('#endDt-Before-Msg').show();
		return false
	}
	//check if end date is before start date.
	else if (dEnd < dStart)
	{
		$('#event-End').removeClass("parsley-success");
		$('#event-End').addClass("parsley-error");	
		$('#endDt-Req-Msg').hide();
		$('#endDt-Valid-Msg').hide();					
		$('#endDt-Before-Msg').hide();
		$('#endDt-BeforeStart-Msg').show();
		return false
	}
	else
	{	
		if ($('#event-End').hasClass("parsley-error")==true)
		{
			$('#event-End').removeClass("parsley-error");		
			$('#event-End').addClass("parsley-success");
		}
		$('#endDt-Req-Msg').hide();
		$('#endDt-Valid-Msg').hide();					
		$('#endDt-Before-Msg').hide();
		$('#startDt-AfterEnd-Msg').hide();	
		$('#endDt-BeforeStart-Msg').hide();	
		if($('#startDt-Req-Msg').is(':hidden') && $('#startDt-Valid-Msg').is(':hidden') && $('#startDt-Before-Msg').is(':hidden') && $('#startDt-AfterEnd-Msg').is(':hidden'))
		{ 
			$('#event-Start').removeClass("parsley-error");
		}		
		return true
	}
}

