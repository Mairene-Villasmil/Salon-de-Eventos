export function renderLogin(container) {
  container.innerHTML = `
    <div class="login-container">
      <h2>Ingreso Usuario</h2>
      <form id="loginUsuarioForm">
        <input type="text" id="username" placeholder="Usuario" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Ingresar <span id="spinner" style="display:none;">⏳</span></button>
        <p id="loginError" class="error-msg"></p>
      </form>
    </div>
  `;

  const form = document.getElementById("loginUsuarioForm");
  const errorElem = document.getElementById("loginError");
  const spinner = document.getElementById("spinner");
  const btn = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorElem.textContent = '';
    spinner.style.display = 'inline-block';
    btn.disabled = true;
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
  
    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
    
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error login:', errorText);
        throw new Error("Login inválido");
      }
    
      const data = await res.json();
      console.log('Respuesta login:', data);
    
      const userData = await fetch(`https://dummyjson.com/users/${data.id}`).then(r => r.json());
      console.log('Datos completos usuario:', userData);
    
      sessionStorage.setItem('token', data.token || data.accessToken);
      sessionStorage.setItem('user', JSON.stringify(userData));
    
      window.location.hash = '#/perfil';
      if (typeof route === 'function') route();
    
    } catch (error) {
      errorElem.textContent = "Usuario o contraseña incorrectos";
      console.error(error);
    }       
  });
}
