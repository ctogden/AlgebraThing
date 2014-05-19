package com.jazzberryjam.algebra_thing.validation;

import java.util.List;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;

@FacesValidator("usernameValidator")
public class UsernameValidator implements Validator {

	@Override
	public void validate(FacesContext context, UIComponent component, Object value)
			throws ValidatorException {
				String username = (String) value;
				
				if(username == null) {
					throw new ValidatorException(new FacesMessage("You must enter a username."));
				}
				
				if(username.equals("")) {
					throw new ValidatorException(new FacesMessage("You must enter a username."));
				}
				
				if(username.length() < 8) {
					throw new ValidatorException(new FacesMessage("Your username must be at least 8 characters long."));
				}
				
				DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		        Key loginKey = KeyFactory.createKey("login", "loginCredentials");
		        
		        Query query = new Query("user", loginKey);
		        List<Entity> userList = datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
		        
		        for(Entity userData : userList) {
		        	if(username.equalsIgnoreCase((String) userData.getProperty("username"))) {
		        		throw new ValidatorException(new FacesMessage("That username is already taken, please choose another one."));
		        	}
		        }
	}

}
