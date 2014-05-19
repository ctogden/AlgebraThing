package com.jazzberryjam.algebra_thing.beans;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;

@ManagedBean(name="saveEquationBean")
@RequestScoped
public class SaveEquationBean implements Serializable {
	private String equationJSON;
	private int equationID;
	private LoginStatusBean loginStatusBean;
	
	public SaveEquationBean() {
		
	}

	public String getEquationJSON() {
		return equationJSON;
	}

	public void setEquationJSON(String equationJSON) {
		this.equationJSON = equationJSON;
	}
	
	public int getEquationID() {
		return equationID;
	}

	public void setEquationID(int equationID) {
		this.equationID = equationID;
	}

	public LoginStatusBean getLoginStatusBean() {
		return loginStatusBean;
	}

	public void setLoginStatusBean(LoginStatusBean loginStatusBean) {
		this.loginStatusBean = loginStatusBean;
	}

	public void saveEquation() {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();		
		Key equationKey = KeyFactory.createKey("equation", "equation");		
    	Query equationQuery = new Query("equation", equationKey);
    	List<Entity> equationList = datastore.prepare(equationQuery).asList(FetchOptions.Builder.withDefaults());

    	for(Entity equation : equationList) {
    		if(loginStatusBean.getUsername().equalsIgnoreCase((String) equation.getProperty("username"))) {
    			if(loginStatusBean.getEquationID() == ((long) equation.getProperty("equationID"))) {
    				datastore.delete(equation.getKey());
    			}
    		}
    	}
		
    	Date date = new Date();
    	Entity equationData = new Entity("equation", equationKey);
    	equationData.setProperty("username", loginStatusBean.getUsername());
    	equationData.setProperty("equationID", loginStatusBean.getEquationID());
    	equationData.setProperty("equationJSON", equationJSON);
    	equationData.setProperty("dateWorkedOn", date.toString());
    	datastore.put(equationData);
	}
}
