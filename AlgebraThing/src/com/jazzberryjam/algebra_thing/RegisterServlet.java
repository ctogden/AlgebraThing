package com.jazzberryjam.algebra_thing;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.*;
import com.jazzberryjam.algebra_thing.beans.LoginStatusBean;
import com.jazzberryjam.algebra_thing.beans.UserDataBean;
import com.jazzberryjam.algebra_thing.security.PasswordHash;

public class RegisterServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
    	ServletContext context = getServletContext();
        LoginStatusBean loginStatus = (LoginStatusBean) context.getAttribute("loginStatusBean");
        UserDataBean userDataBean = (UserDataBean) context.getAttribute("userDataBean");
        
        if(loginStatus == null) {
        	loginStatus = new LoginStatusBean();
        	context.setAttribute("loginStatusBean", loginStatus);
        }
        
        if(userDataBean == null) {
        	userDataBean = new UserDataBean();
        	context.setAttribute("userDataBean", userDataBean);
        }
        
        loginStatus.setUsername(request.getParameter("reg_username"));
        loginStatus.setPword(request.getParameter("reg_pword"));
        String pwordConf = request.getParameter("pword_conf");
        
        userDataBean.setUsername(loginStatus.getUsername());
        userDataBean.setEmail(request.getParameter("email"));
        userDataBean.setFirstname(request.getParameter("firstname"));
        userDataBean.setLastname(request.getParameter("lastname"));
        
        if(loginStatus.getUsername().equals("") || loginStatus.getPword().equals("") 
        		|| userDataBean.getEmail().equals("") || userDataBean.getFirstname().equals("")
        		|| userDataBean.getLastname().equals("") || pwordConf.equals("")) {
        	// TODO: ADD AN AJAX RESPONSE HERE WITH THE ERROR DETAILS TO PROVIDE
        	// FEEDBACK TO THE USER
        	response.sendRedirect("AlgebraThing.jsp");
        	return;
        }
        
        String pwordHash = null;
        
        try {
			pwordHash = PasswordHash.createHash(loginStatus.getPword());
		} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
			e.printStackTrace(System.err);
		}
    	
    	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Key loginKey = KeyFactory.createKey("login", "loginCredentials");
        
        Query query = new Query("user", loginKey);
        List<Entity> userList = datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());
        
        boolean exists = false;
        for(Entity userData : userList) {
        	if(loginStatus.getUsername().equalsIgnoreCase((String) userData.getProperty("username"))) {
        		exists = true;
        		break;
        	}
        }
        
        if(!exists) {
        	Entity userLogin = new Entity("user", loginKey);
        	userLogin.setProperty("username", loginStatus.getUsername());
        	userLogin.setProperty("pword", pwordHash);
        	datastore.put(userLogin);
        	
        	Key userDataKey = KeyFactory.createKey("userData", "userData");
        	Entity userData = new Entity("userData", userDataKey);
        	userData.setProperty("username", userDataBean.getUsername());
        	userData.setProperty("firstname", userDataBean.getFirstname());
        	userData.setProperty("lastname", userDataBean.getLastname());
        	userData.setProperty("email", userDataBean.getEmail());
        	userData.setProperty("userType", null);
        	datastore.put(userData);
        	
        	loginStatus.setLoggedIn(true);
        }
        
        response.sendRedirect("AlgebraThing.jsp");
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}