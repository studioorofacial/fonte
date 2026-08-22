document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLogin');
  if (!form) return;
  const apiBase = window.CMS_API_BASE || (
    location.protocol === 'file:' || location.hostname.endsWith('github.io')
      ? 'http://localhost:6000/api'
      : '/api'
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const login = document.getElementById('loginID')?.value.trim();
    const password = document.getElementById('passwordID')?.value || '';
    if (!login || !password) {
      window.alert('Informe o usuário/e-mail e a senha.');
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ login, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Usuário ou senha incorretos.');
      sessionStorage.setItem('cms_token', data.token);
      window.location.href = 'admin.html';
    } catch (error) {
      window.alert(error.message || 'Não foi possível autenticar.');
    } finally {
      if (button) button.disabled = false;
    }
  });
});
