package com.jazzberryjam.algebra_thing.beans;

import java.io.Serializable;

public class LoginStatusBean implements Serializable {
	private boolean loggedIn;
	private String username;
	private String pword;
	
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
}
