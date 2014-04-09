package com.jazzberryjam.algebra_thing;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.jazzberryjam.algebra_thing.beans.LoginStatusBean;
import com.jazzberryjam.algebra_thing.beans.UserDataBean;


public class LogoutServlet extends HttpServlet {

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
        
        loginStatus.setLoggedIn(false);
        loginStatus.setUsername(null);
        loginStatus.setPword(null);
        userDataBean.setFirstname(null);
        userDataBean.setLastname(null);
        userDataBean.setEmail(null);
        userDataBean.setUsername(null);
        userDataBean.setUserType(null);
        
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