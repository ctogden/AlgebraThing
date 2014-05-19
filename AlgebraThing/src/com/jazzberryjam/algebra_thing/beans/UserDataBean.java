package com.jazzberryjam.algebra_thing.beans;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.jazzberryjam.algebra_thing.EquationComparator;
import com.jazzberryjam.algebra_thing.data.UserType;

@ManagedBean(name="userDataBean")
@RequestScoped
public class UserDataBean implements Serializable {
	private String username;
	private String email;
	private String firstname;
	private String lastname;
	private UserType userType;
	private Date dateJoined;
	private long equSolved;
	private long equSaved;
	private List<String> equationHistoryList;
	
	private LoginStatusBean loginStatusBean;
	
	public UserDataBean() {
		equationHistoryList = new LinkedList<>();
	}
	
	@PostConstruct
	public void loadUserData() {
		if(loginStatusBean.isLoggedIn()) {
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Key userDataKey = KeyFactory.createKey("userData", "userData");
        	Query userDataQuery = new Query("userData", userDataKey);
        	List<Entity> userDataList = datastore.prepare(userDataQuery).asList(FetchOptions.Builder.withDefaults());
        	
        	for(Entity userData : userDataList) {
        		if(loginStatusBean.getUsername().equalsIgnoreCase((String) userData.getProperty("username"))) {
        			firstname = (String) userData.getProperty("firstname");
        			lastname = (String) userData.getProperty("lastname");
        			email = (String) userData.getProperty("email");
        			userType = (UserType) userData.getProperty("userType");
        			dateJoined = (Date) userData.getProperty("dateJoined");
        			equSolved = (long) userData.getProperty("equSolved");
        			equSaved = (long) userData.getProperty("equSaved");
        			break;
        		}
        	}
        	
        	Key equationKey = KeyFactory.createKey("equation", "equation");
        	Query equationQuery = new Query("equation", equationKey);
        	List<Entity> equationList = datastore.prepare(equationQuery).asList(FetchOptions.Builder.withDefaults());
        	
        	Comparator<Entity> equationComparator = new EquationComparator();
        	Collections.sort(equationList, equationComparator);
        	
        	equSaved = equationList.size();
        	
        	int count = 0;
        	for(Entity equation : equationList) {
        		if(count > 4) {
        			break;
        		}
        		if(loginStatusBean.getUsername().equalsIgnoreCase((String) equation.getProperty("username"))) {
        			String equationJSON = (String) equation.getProperty("equationJSON");
        			String date = (String) equation.getProperty("dateWorkedOn");
        			
        			int end = equationJSON.lastIndexOf('}');
        			String formatted = equationJSON.substring(0, end) + ",\"dateWorkedOn\":\""
        					+ date + "\"" + equationJSON.substring(end);
        			equationHistoryList.add(formatted);
        			count++;
        		}
        	}
		}
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

	public Date getDateJoined() {
		return dateJoined;
	}

	public void setDateJoined(Date dateJoined) {
		this.dateJoined = dateJoined;
	}

	public LoginStatusBean getLoginStatusBean() {
		return loginStatusBean;
	}

	public void setLoginStatusBean(LoginStatusBean loginStatusBean) {
		this.loginStatusBean = loginStatusBean;
	}

	public long getEquSolved() {
		return equSolved;
	}

	public void setEquSolved(long equSolved) {
		this.equSolved = equSolved;
	}

	public long getEquSaved() {
		return equSaved;
	}

	public void setEquSaved(long equSaved) {
		this.equSaved = equSaved;
	}

	public List<String> getEquationHistoryList() {
		return equationHistoryList;
	}

	public void setEquationHistoryList(List<String> equationHistoryList) {
		this.equationHistoryList = equationHistoryList;
	}
}
