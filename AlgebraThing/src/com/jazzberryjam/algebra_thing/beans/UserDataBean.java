package com.jazzberryjam.algebra_thing.beans;

import java.io.Serializable;

import com.jazzberryjam.algebra_thing.data.UserType;

public class UserDataBean implements Serializable {
	private String username;
	private String email;
	private String firstname;
	private String lastname;
	private UserType userType;
	
	public UserDataBean() {
		
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
 	public String getEmail() {
 		return email;
 	}
 	
 	public void setFirstname(String firstname) {
 		this.firstname = firstname;
 	}
 	
 	public String getFirstname() {
 		return firstname;
 	}
 	
 	public void setLastname(String lastname) {
 		this.lastname = lastname;
 	}
 	
 	public String getLastname() {
 		return lastname;
 	}
 	
 	public void setUserType(UserType userType) {
 		this.userType = userType;
 	}
 	
 	public UserType getUserType() {
 		return userType;
 	}
}
