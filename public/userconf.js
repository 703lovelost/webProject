let login_div = document.createElement('div');
login_div.className = "login_name";
login_div.innerHTML = "{{#each users}} {{this.login}} {{/each}}";

let logpass_div = document.getElementsByClassName('logpass');
if (this.login) {
   logpass_div.replaceWith(login_div);
}
