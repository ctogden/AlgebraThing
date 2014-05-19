package com.jazzberryjam.algebra_thing.validation;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("passwordEqualityValidator")
public class PasswordEqualityValidator implements Validator {

	@Override
	public void validate(FacesContext context, UIComponent component, Object value)
			throws ValidatorException {
		String pword = (String) value;
		String confPword = (String) component.getAttributes().get("regConfPword");
		
		if(pword == null || confPword == null) {
			throw new ValidatorException(new FacesMessage("You must enter and confirm your password."));
		}
		
		if(pword.equals("") || confPword.equals("")) {
			throw new ValidatorException(new FacesMessage("You must enter and confirm your password."));
		}
		
		if(!pword.equals(confPword)) {
			throw new ValidatorException(new FacesMessage("Your passwords must match"));
		}
	}

}
