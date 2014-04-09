<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib
    prefix="c"
    uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html data-ng-app="equationEditorApp">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<link type="text/css" rel="stylesheet" href="AlgebraThing.css">
<link type="text/css" rel="stylesheet" href="bootstrap.css">


<!-- External Scripts -->
<script type='text/javascript' src='scripts/angular.min.js'></script>
<script type='text/javascript' src='scripts/angular-route.min.js'></script>
<script type='text/javascript' src='scripts/jquery.min.js'></script>
<script type='text/javascript' src='scripts/bootstrap.min.js'></script>
<script type='text/javascript' src='scripts/main.js'></script>
</head>
<body>
	<jsp:useBean id="loginStatusBean" scope="session" 
		class="com.jazzberryjam.algebra_thing.beans.LoginStatusBean" />
	<jsp:useBean id="userDataBean" scope="session"
		class="com.jazzberryjam.algebra_thing.beans.UserDataBean" />
		
	<div class="modal fade" id="welcome" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel">Algebra Thing</h4>
				</div>
				<div class="modal-body">
					The best way to practice algebra.
					<p>More content goes here...</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Let's
						Practice Algebra!</button>
				</div>
			</div>
		</div>
	</div>
	
	<header id="navbar" class="navbar navbar-inverse navbar-fixed-top"
		role="navigation">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse"
					data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">AlgebraThing</a>
			</div>
			<div class="collapse navbar-collapse">
				<ul class="nav navbar-nav">
					<c:if test="${loginStatusBean.loggedIn}">
						<li><a href="#username">Hello <jsp:getProperty name="userDataBean" property="firstname" /></a></li>
					</c:if>
					<li class="active"><a href="#">New Equation</a></li>
					<c:if test="${!loginStatusBean.loggedIn}">
						<li>
							<a href="#save" onclick="$('#login_container').fadeToggle();$('#register_container').fadeOut();">Save</a>
							<div id="login_container">
								<form name="login_form" action="LoginServlet">
									<input class="login_comp login_text_box" type="text"
									 	name="username" placeholder="Username" />
									<input class="login_comp login_text_box" type="password" 
										name="pword" placeholder="Password" />
									<input id="login_button" class="login_comp button" type="submit" value="Login" />
								</form>
								<input id="open_registration_button" class="button" type="button" value="Register"
									onclick="$('#login_container').fadeToggle();$('#register_container').fadeToggle();" />
							</div>
							<div id="register_container">
								<form name="register_form" action="RegisterServlet">
									<input class="login_comp login_text_box" type="text"
										name="firstname" placeholder="Firstname" />
									<input class="login_comp login_text_box" type="text" 
								    	name="lastname" placeholder="Lastname" />
									<input class="login_comp login_text_box" type="text"
										name="email" placeholder="Email" />
									<input class="login_comp login_text_box" type="text"
										name="reg_username" placeholder="Username" />
									<input class="login_comp login_text_box" type="password"
										name="reg_pword" placeholder="Password" />
									<input class="login_comp login_text_box" type="password"
										name="pword_conf" placeholder="Confirm Password" />
									<input id="register_button" class="login_comp button" type="submit" value="Register" />
								</form>
							</div>
						</li>
						<li><a href="#contact">My Profile</a></li>
					</c:if>
					<c:if test="${loginStatusBean.loggedIn}">
						<li><a href="#save">Save</a></li>
						<li><a href="#profile">My Profile</a></li>
						<li>
							<form id="logout_form" action="LogoutServlet">
								<a id="logout_link" href="#logout" onclick="$('#logout_form').submit();">Logout</a>
							</form>
						</li>
					</c:if>
				</ul>
			</div>
			<!--/.nav-collapse -->
		</div>
	</header>
	<div id="main_content" data-ng-view>

	</div>

	<!-- Footer -->
	<div id="footer">
		<div id="copyright">© JJ Enterprises</div>
		<a id="faq" href=#>FAQ</a> <a id="contact" href=#>Contact</a>
	</div>

</body>
</html>