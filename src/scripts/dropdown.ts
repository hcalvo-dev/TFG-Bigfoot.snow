export function dropdown() {
  if (typeof window === 'undefined') return;

  const toggleBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('menu-close');
  const overlay = document.getElementById('overlay');
  const sideMenu = document.getElementById('side-menu');

  if (!toggleBtn || !closeBtn || !overlay || !sideMenu) return;

  const openMenu = () => {
    overlay.classList.remove('hidden');
    toggleBtn.classList.add('hidden');
    overlay.classList.add('opacity-100');
    sideMenu.classList.remove('translate-x-full');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    overlay.classList.add('hidden');
    setTimeout(() => {
      toggleBtn.classList.remove('hidden');
    }, 300); 
    overlay.classList.remove('opacity-100');
    sideMenu.classList.add('translate-x-full');
    document.body.classList.remove('menu-open');
  };

  toggleBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}
