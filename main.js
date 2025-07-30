
async function injectHTML(selector, url) {
    const resp = await fetch(url);
    if (!resp.ok) return;
    document.querySelector(selector).innerHTML = await resp.text();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    injectHTML('#header-placeholder', '../ui/header.html');
    injectHTML('#footer-placeholder', '../ui/footer.html');
    injectHTML('#sidebar-placeholder', '../ui/sidebar.html');
    injectHTML('#modals-placeholder', '../components/modals.html');
  });