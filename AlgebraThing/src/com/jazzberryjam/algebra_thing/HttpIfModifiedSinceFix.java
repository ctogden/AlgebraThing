package com.jazzberryjam.algebra_thing;

import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class HttpIfModifiedSinceFix implements Filter {
	private static final String _CLASS = HttpIfModifiedSinceFix.class.getName();
    private static final Logger logger = Logger.getLogger(_CLASS);
	
	@Override
	public void destroy() {
		logger.entering(_CLASS, "destroy()");
		 logger.exiting(_CLASS, "destroy()");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
	        logger.entering(_CLASS,
	           "doFilter(ServletRequest,ServletResponse,FilterChain)",
	     new Object[] { request, response, chain });
	        HttpServletRequest httpRequest = null;
	        HttpServletRequestWrapper requestWrapper = null;

	        httpRequest = (HttpServletRequest) request;
	        requestWrapper = new HttpModifiedSinceRequestWrapper(httpRequest);
	        chain.doFilter(requestWrapper, response);

	        logger.exiting(_CLASS,
	            "doFilter(ServletRequest,ServletResponse,FilterChain)");
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
		 logger.entering(_CLASS, "init(FilterConfig)", config);
	        logger.exiting(_CLASS, "init(FilterConfig)");
	}

}
