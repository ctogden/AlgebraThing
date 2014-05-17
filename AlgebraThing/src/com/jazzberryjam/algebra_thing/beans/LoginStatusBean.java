package com.jazzberryjam.algebra_thing.beans;

import java.io.IOException;
import java.io.Serializable;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.jazzberryjam.algebra_thing.data.UserType;
import com.jazzberryjam.algebra_thing.security.PasswordHash;

@ManagedBean(name="loginStatusBean")
@SessionScoped
public class LoginStatusBean implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private boolean loggedIn;
	private String username;
	private String pword;
	
	private String regUsername;
	private String regPword;
	private String regConfPword;
	private String email;
	private String firstname;
	private String lastname;
	private UserType userType;
	
	public LoginStatusBean() {
		loggedIn = false;
	}
	
	public void setLoggedIn(boolean loggedIn) {
		this.loggedIn = loggedIn;
	}
	
	public boolean isLoggedIn() {
		return loggedIn;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setPword(String pword) {
		this.pword = pword;
	}
	
	public String getPword() {
		return pword;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}
	
	public String getRegUsername() {
		return regUsername;
	}

	public void setRegUsername(String regUsername) {
		this.regUsername = regUsername;
	}

	public String getRegPword() {
		return regPword;
	}

	public void setRegPword(String regPword) {
		this.regPword = regPword;
	}

	public String getRegConfPword() {
		return regConfPword;
	}

	public void setRegConfPword(String regConfPword) {
		this.regConfPword = regConfPword;
	}

	public void login() {
		String pwordHash = null;
		try {
			pwordHash = PasswordHash.createHash(pword);
		} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
			e.printStackTrace(System.err);
		}
        
        
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Key loginKey = KeyFactory.createKey("login", "loginCredentials");
        Query query = new Query("user", loginKey);
        List<Entity> userList = datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
       
        for(Entity userData : userList) {
        	String dbUsername = (String) userData.getProperty("username");
        	String dbPword = (String) userData.getProperty("pword");
        	
        	if(dbUsername.equalsIgnoreCase(username)) {
        		try {
					if(PasswordHash.validatePassword(pword.toCharArray(), dbPword)) {
						loggedIn = true;
						break;
					}
				} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
					e.printStackTrace(System.err);
				}
        	}
        }
        
        if(loggedIn) {
        	Key userDataKey = KeyFactory.createKey("userData", "userData");
        	Query userDataQuery = new Query("userData", userDataKey);
        	List<Entity> userDataList = datastore.prepare(userDataQuery).asList(FetchOptions.Builder.withDefaults());
        	
        	for(Entity userData : userDataList) {
        		if(username.equalsIgnoreCase((String) userData.getProperty("username"))) {
        			firstname = (String) userData.getProperty("firstname");
        			lastname = (String) userData.getProperty("lastname");
        			email = (String) userData.getProperty("email");
        			userType = (UserType) userData.getProperty("userType");
        			break;
        		}
        	}
        }
        
        try {
        	FacesContext.getCurrentInstance().getExternalContext().redirect("AlgebraThing.jsf");
        } catch(IOException e) {
        	e.printStackTrace(System.err);
        }
	}
	
	public void logout() {
		FacesContext.getCurrentInstance().getExternalContext().invalidateSession();
		username = null;
		pword = null;
		firstname = null;
		lastname = null;
		email = null;
		userType = null;
		
		try {
			FacesContext.getCurrentInstance().getExternalContext().redirect("AlgebraThing.jsf");
		} catch(IOException e) {
			e.printStackTrace(System.err);
		}
	}
	
	public void register() {
		String pwordHash = null;
        
        try {
			pwordHash = PasswordHash.createHash(regPword);
		} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
			e.printStackTrace(System.err);
		}
    	
    	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Key loginKey = KeyFactory.createKey("login", "loginCredentials");
        
        Query query = new Query("user", loginKey);
        List<Entity> userList = datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
        
        boolean exists = false;
        for(Entity userData : userList) {
        	if(regUsername.equalsIgnoreCase((String) userData.getProperty("username"))) {
        		exists = true;
        		break;
        	}
        }
        
        if(!exists) {
        	username = regUsername;
        	Entity userLogin = new Entity("user", loginKey);
        	userLogin.setProperty("username", regUsername);
        	userLogin.setProperty("pword", pwordHash);
        	datastore.put(userLogin);
        	
        	Date date = new Date();
        	Key userDataKey = KeyFactory.createKey("userData", "userData");
        	Entity userData = new Entity("userData", userDataKey);
        	userData.setProperty("username", regUsername);
        	userData.setProperty("firstname", firstname);
        	userData.setProperty("lastname", lastname);
        	userData.setProperty("email", email);
        	userData.setProperty("userType", null);
        	userData.setProperty("dateJoined", date);
        	userData.setProperty("equSolved", 0);
        	userData.setProperty("equSaved", 0);
        	datastore.put(userData);
        	
        	loggedIn = true;
        }
        
        try {
        	FacesContext.getCurrentInstance().getExternalContext().redirect("AlgebraThing.jsf");
        } catch(IOException e) {
        	e.printStackTrace(System.err);
        }
	}
}
