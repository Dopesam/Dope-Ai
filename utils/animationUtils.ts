/**
 * Creates a magical pixie dust explosion effect at the given coordinates.
 * @param x The clientX coordinate
 * @param y The clientY coordinate
 */
export const triggerPixieDust = (x: number, y: number) => {
  const colors = ['#00ff9d', '#00ccff', '#ffeb3b', '#ffffff', '#a855f7']; // Vibrant Green, Blue, Yellow, White, Purple
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${Math.random() * 8 + 4}px`;
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${particle.style.backgroundColor}`;
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 150 + 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    const animation = particle.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
    ], {
      duration: Math.random() * 600 + 400,
      easing: 'cubic-bezier(0, .9, .57, 1)',
    });

    animation.onfinish = () => particle.remove();
  }
};