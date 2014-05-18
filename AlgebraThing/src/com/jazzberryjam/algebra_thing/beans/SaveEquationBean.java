package com.jazzberryjam.algebra_thing.beans;

import java.io.Serializable;
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
	private LoginStatusBean loginStatusBean;
	
	public SaveEquationBean() {
		
	}

	public String getEquationJSON() {
		return equationJSON;
	}

	public void setEquationJSON(String equationJSON) {
		this.equationJSON = equationJSON;
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
    	Entity equationData = new Entity("equation", equationKey);
    	equationData.setProperty("username", loginStatusBean.getUsername());
    	equationData.setProperty("equationJSON", equationJSON);
    	datastore.put(equationData);
	}
}
