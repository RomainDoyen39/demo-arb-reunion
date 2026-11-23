/* Le dernier pixel d'une vague est semi-transparent et laisse voir le fond.
   Un liseré de la même couleur que le remplissage le rend plein. */
function sealWaves() {
  document.querySelectorAll('svg[preserveAspectRatio="none"]').forEach((svg) => {
    const path = svg.querySelector("path");
    if (!path) return;
    const fill = getComputedStyle(path).fill;
    if (!fill || fill === "none") return;
    const d = path.getAttribute("d") || "";
    const joinsTop = /L\s*0[\s,]+0\s*Z\s*$/i.test(d);
    svg.style.backgroundImage = joinsTop
      ? `linear-gradient(to bottom, ${fill} 2px, transparent 2px)`
      : `linear-gradient(to top, ${fill} 2px, transparent 2px)`;
  });
}

sealWaves();
