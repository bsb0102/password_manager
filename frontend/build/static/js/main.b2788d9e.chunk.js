(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{11:function(e,a,t){},13:function(e,a,t){e.exports=t(27)},21:function(e,a,t){},26:function(e,a,t){},27:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),r=t(8),s=t.n(r),o=t(6),c=t(3);var m=e=>{let{isOpen:a,onClose:t}=e;const[r,s]=Object(n.useState)(""),[o,c]=Object(n.useState)("");return l.a.createElement("div",{className:"modal ".concat(a?"open":"")},l.a.createElement("div",{className:"modal-content"},l.a.createElement("h2",null,"Login"),l.a.createElement("form",{onSubmit:e=>{e.preventDefault(),console.log("Username:",r),console.log("Password:",o),t()}},l.a.createElement("label",null,"Username:",l.a.createElement("input",{type:"text",placeholder:"Username",value:r,onChange:e=>{s(e.target.value)},required:!0})),l.a.createElement("label",null,"Password:",l.a.createElement("input",{type:"password",placeholder:"Password",value:o,onChange:e=>{c(e.target.value)},required:!0})),l.a.createElement("button",{type:"submit"},"Login")),l.a.createElement("button",{onClick:t},"Close Modal")))};t(21);var i=()=>{const e=Object(c.o)(),[a,t]=Object(n.useState)(!1);return l.a.createElement("div",{className:"landing-page"},l.a.createElement("nav",{className:"landing-nav"},l.a.createElement("div",{className:"nav-brand",onClick:()=>e("/")},"TECH CJ"),l.a.createElement("button",{onClick:()=>{t(!0)},className:"nav-login-btn"},"Login")),l.a.createElement("header",{className:"landing-header"},l.a.createElement("h1",null,"Innovative solutions for modern problems")),l.a.createElement("main",{className:"landing-main"},l.a.createElement("section",{className:"landing-info"},l.a.createElement("h2",null,"About Our Product"),l.a.createElement("p",null,"Describe your product in more detail, its benefits, and how it solves problems."),l.a.createElement("button",{onClick:()=>e("/features"),className:"features-btn"},"Learn More"))),l.a.createElement("footer",{className:"landing-footer"},l.a.createElement("p",null,"\xa9 ",(new Date).getFullYear()," TECH CJ")),l.a.createElement(m,{isOpen:a,onClose:()=>{t(!1)}}))},u=t(28);t(11);var d=()=>{const e=Object(c.o)(),[a,t]=Object(n.useState)(""),[r,s]=Object(n.useState)(""),[o,m]=Object(n.useState)(""),[i,d]=Object(n.useState)(!1);return l.a.createElement("div",{className:"auth-form-container"},l.a.createElement("form",{onSubmit:async t=>{t.preventDefault(),d(!0),m("");try{console.log("API URL:","http://localhost:443/api");const t=await u.a.post("".concat("http://localhost:443/api","/auth/login"),{username:a,password:r});d(!1),localStorage.setItem("token",t.data.token),e("/dashboard")}catch(n){console.log(n),d(!1),n.response?m(n.response.data.message||"Invalid username or password"):n.request?m("No response from the server. Please try again later."):m("An error occurred. Please try again.")}},className:"auth-form"},l.a.createElement("h2",null,"Login"),o&&l.a.createElement("div",{className:"error-message"},o),l.a.createElement("input",{type:"text",placeholder:"Username",value:a,onChange:e=>t(e.target.value),required:!0,disabled:i}),l.a.createElement("input",{type:"password",placeholder:"Password",value:r,onChange:e=>s(e.target.value),required:!0,disabled:i}),l.a.createElement("button",{type:"submit",disabled:i},i?"Logging in...":"Login"),l.a.createElement("p",{className:"alt-action"},"Don't have an account? ",l.a.createElement("span",{onClick:()=>e("/register")},"Register here"))))};var p=()=>{const e=Object(c.o)(),[a,t]=Object(n.useState)(""),[r,s]=Object(n.useState)(""),[o,m]=Object(n.useState)(""),[i,d]=Object(n.useState)("");return l.a.createElement("div",{className:"auth-form-container"},l.a.createElement("form",{onSubmit:async t=>{t.preventDefault(),m("");try{const t=await u.a.post("".concat("http://localhost:443/api","/auth/register"),{username:a,password:r});console.log(t.data),d("Registration successful! You can now login."),setTimeout(()=>e("/login"),3e3)}catch(o){m("Registration failed. Please try again."),console.log("Failed: ","http://localhost:443/api")}},className:"auth-form"},l.a.createElement("h2",null,"Register"),o&&l.a.createElement("div",{className:"error-message"},o),i&&l.a.createElement("div",{className:"success-message"},i),l.a.createElement("input",{type:"text",placeholder:"Username",value:a,onChange:e=>t(e.target.value),required:!0}),l.a.createElement("input",{type:"password",placeholder:"Password",value:r,onChange:e=>s(e.target.value),required:!0}),l.a.createElement("button",{type:"submit"},"Register"),l.a.createElement("p",{className:"alt-action"},"Already have an account? ",l.a.createElement("span",{onClick:()=>e("/login")},"Login here"))))};var g=()=>l.a.createElement(o.a,null,l.a.createElement("div",{className:"App"},l.a.createElement(c.c,null,l.a.createElement(c.a,{path:"/",element:l.a.createElement(i,null)}),l.a.createElement(c.a,{path:"/login",element:l.a.createElement(d,null)}),l.a.createElement(c.a,{path:"/register",element:l.a.createElement(p,null)}))));t(26);s.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(g,null)),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.b2788d9e.chunk.js.map