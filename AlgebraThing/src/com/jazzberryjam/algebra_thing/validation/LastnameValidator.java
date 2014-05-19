package com.jazzberryjam.algebra_thing.validation;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("lastnameValidator")
public class LastnameValidator implements Validator {

	@Override
	public void validate(FacesContext context, UIComponent component, Object value)
			throws ValidatorException {
		String lastname = (String) value;
		
		if(lastname == null) {
			throw new ValidatorException(new FacesMessage("You must enter a lastname."));
		}
		
		if(lastname.equals("")) {
			throw new ValidatorException(new FacesMessage("You must enter a lastname."));
		}
	}
}