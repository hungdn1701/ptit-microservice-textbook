(function() {
  // Fix FOUC by reading the theme immediately from localStorage (same origin)
  try {
    const savedThemeId = localStorage.getItem('ide-theme');
    const isLight = savedThemeId === 'light' || (!savedThemeId && window.matchMedia('(prefers-color-scheme: light)').matches);
    if (isLight) {
      document.documentElement.classList.add('light');
    }
  } catch (e) {
    // Ignore cross-origin errors if any
  }

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'SET_THEME' && typeof e.data.isLight !== 'undefined') {
      document.documentElement.classList.toggle('light', e.data.isLight);
    }
  });

  // Automatically apply styling classes to Typst's inline styled HTML boxes
  document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll('span, strong, div > h3');
    elements.forEach(el => {
      const text = el.textContent;
      let calloutClass = null;
      if (text.includes('[RULE]')) calloutClass = 'callout-principle';
      else if (text.includes('[Warning]')) calloutClass = 'callout-warning';
      else if (text.includes('[Tip]')) calloutClass = 'callout-tip';
      else if (text.includes('[CASE]')) calloutClass = 'callout-analysis';
      else if (text.includes('[NOTE]')) calloutClass = 'callout-note';
      else if (text.includes('[Case Study]')) calloutClass = 'callout-casestudy';
      else if (text.includes('Bạn sẽ học được gì') || text.includes('Bn s h?c `c gA')) calloutClass = 'callout-learning';

      if (calloutClass) {
        const parentDiv = el.closest('div');
        if (parentDiv && !parentDiv.classList.contains('callout')) {
          parentDiv.classList.add('callout', calloutClass);
        }
      }
    });
  });
})();
