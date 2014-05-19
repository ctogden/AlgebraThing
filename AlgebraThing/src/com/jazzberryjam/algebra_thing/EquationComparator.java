package com.jazzberryjam.algebra_thing;

import java.util.Comparator;

import com.google.appengine.api.datastore.Entity;

public class EquationComparator implements Comparator<Entity> {

	@Override
	public int compare(Entity o1, Entity o2) {
		if(((long) o1.getProperty("equationID")) > ((long) o2.getProperty("equationID"))) {
			return -1;
		} else if (((long) o1.getProperty("equationID")) < ((long) o2.getProperty("equationID"))) {
			return 1;
		} else {
			return 0;
		}
	}

}
