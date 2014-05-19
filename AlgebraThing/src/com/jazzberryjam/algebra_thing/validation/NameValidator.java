package com.jazzberryjam.algebra_thing.validation;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("nameValidator")
public class NameValidator implements Validator {

	@Override
	public void validate(FacesContext context, UIComponent component, Object value)
			throws ValidatorException {
		String firstname = (String) value;
		
		if(firstname == null) {
			throw new ValidatorException(new FacesMessage("You must enter a firstname."));
		}
		
		if(firstname.equals("")) {
			throw new ValidatorException(new FacesMessage("You must enter a firstname."));
		}
	}
}