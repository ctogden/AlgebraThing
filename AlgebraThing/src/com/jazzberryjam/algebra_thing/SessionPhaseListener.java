package com.jazzberryjam.algebra_thing;

import java.util.Map;
import java.util.logging.Logger;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.PhaseEvent;
import javax.faces.event.PhaseId;
import javax.faces.event.PhaseListener;

public class SessionPhaseListener implements PhaseListener {
	private static final long serialVersionUID = -8246272798261076270L;
	private static final String _CLASS = SessionPhaseListener.class.getName();
	private static final Logger logger = Logger.getLogger(_CLASS);
	private static final String TIME_KEY = "NOW";

	@Override
	public void afterPhase(PhaseEvent event) {
		logger.entering(_CLASS, "afterPhase(PhasseEvent)", event);
		FacesContext ctx = null;
		ExternalContext eCtx = null;
		Map<String, Object> sessionMap = null;

		ctx = event.getFacesContext();
		eCtx = ctx.getExternalContext();
		sessionMap = eCtx.getSessionMap();
		sessionMap.put(TIME_KEY, System.currentTimeMillis());
		logger.exiting(_CLASS, "afterPhase(PhaseEvent)");
	}

	@Override
	public void beforePhase(PhaseEvent event) {
		logger.entering(_CLASS, "beforePhase(PhaseEvent)", event);
		logger.exiting(_CLASS, "beforePhase(PhaseEvent)");
	}

	@Override
	public PhaseId getPhaseId() {
		logger.entering(_CLASS, "getPhaseId(PhasseEvent)");
		PhaseId phaseId = PhaseId.ANY_PHASE;
		logger.exiting(_CLASS, "getPhaseId(PhaseEvent)", phaseId);
		return phaseId;
	}

}
