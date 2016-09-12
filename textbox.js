// Recommended AMD module pattern for a Knockout component that:
//  - Can be referenced with just a single 'require' declaration
//  - Can be included in a bundle using the r.js optimizer
define(['text!./textbox.html'], function( htmlString) {
	function textbox( params) { 
		var self = this;
		self.form = ko.observable();//params.form;		
		self.params = params;	
		//VALUE
		//self.form._formColumns.push(self);	
		self.InternalName = params.InternalName;
		
		//VALUE
		self.value = ko.observable();
		//LABEL
		self.label = ko.observable();
		//DESCRIPTION
		self.description = ko.observable();
		//Info
		self.infotip = ko.observable();
		//Data-Type
		self.datatype = ko.observable();
		//Placeholder
		self._placeholder = ko.observable();
		//Show optional text		
		self.optionaltext = ko.observable(false);		
		//Max characters
		self.maxlength = ko.observable(255);
		//text box width in pixels
		self.width = ko.observable("300px");		
		//Is required field		
		self.filePrefix = (self.params.prefix == undefined) ? "" : self.params.prefix;
		if(self.params.required == undefined)
			self._inputRequired = ko.observable(false);
		else 
			self._inputRequired = self.params.required;	

		
		if(self._inputRequired == "false" || self._inputRequired == false)
		{self.optionaltext(true);}			

		self.Init = function(params) {
		
		
				if( self.model[self.InternalName] == undefined) {
					self.model[self.InternalName] = self.value;
					self.value((self.form().__formDataResults == undefined) ? "" : self.form().__formDataResults[self.InternalName]);
				}
				else {
					self.value = self.model[self.InternalName];
				}
	//??			
				self.form()._formColumnValues[self.InternalName] = self.value;
				//FORM COLLECTION
				self.form()._formColumns[self.InternalName] = self;
				if( params.label != undefined) self.label( params.label);
				if( params.description != undefined) self.description( params.description);
				if( params.infotip != undefined) self.infotip( params.infotip);				
				if( params.maxlength != undefined) self.maxlength( params.maxlength); 
				if( params.width != undefined) self.width( params.width); 		
				if( params.datatype != undefined) self.datatype( params.datatype); 		
				if( params.placeholder != undefined) self._placeholder( params.placeholder); 						
		
		};
		
		self.enabled = ko.pureComputed( function() {
			if( self.form()) {
				//return self.form()._formEnableForm();
				var b = ((self.form().mwp_FormState() == self.form()._formStates.DRAFT));
				return (b.toString().toLowerCase() == 'true') ? true : false;
			}
			return false;
		});		
	}
    // Use prototype to declare any public methods
    //componentButtons.prototype.doSomething = function() { ... };
	textbox.prototype.schema = {
		"Params": {
			"InternalName": "",
			"width": "600px",
			"maxlength": 255,
			"required": true,
			"label":"",
			"infotip":"",  //Used for information icon text.
			"datatype":"", // For value:number for numeric.
			"placeholder":"" //Used for masking textbox display. Example mm/dd/yyyy or $
		}
	};
	
	
	ko.bindingHandlers.inittextbox = {
		init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			viewModel.form(bindingContext.$root);
			viewModel.model = bindingContext.$parent;
			viewModel.Init(viewModel.params);
			viewModel.element = element.parentElement;
		}
	}; 
 
    // Return component definition
    return { viewModel: textbox, template: htmlString };
});

