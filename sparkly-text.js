let sheet;
let sparkleTemplate;

// https://caniuse.com/mdn-api_cssstylesheet_replacesync
const supportsConstructableStylesheets =
  "replaceSync" in CSSStyleSheet.prototype;

const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)");

class SparklyText extends HTMLElement {
  #numberOfSparkles = 3;
  #sparkleSvg = `<svg width="1200" height="1200" viewBox="0 0 1200 1200" aria-hidden="true">
		<path fill="red" d="m611.04 866.16c17.418-61.09 50.25-116.68 95.352-161.42 45.098-44.742 100.94-77.133 162.17-94.062l38.641-10.68-38.641-10.68c-61.227-16.93-117.07-49.32-162.17-94.062-45.102-44.738-77.934-100.33-95.352-161.42l-11.039-38.641-11.039 38.641c-17.418 61.09-50.25 116.68-95.352 161.42-45.098 44.742-100.94 77.133-162.17 94.062l-38.641 10.68 38.641 10.68c61.227 16.93 117.07 49.32 162.17 94.062 45.102 44.738 77.934 100.33 95.352 161.42l11.039 38.641z"/>
	</svg>`;

  #css = `
    :host {
      --_sparkle-base-size: var(--sparkly-text-size, 1em);
      --_sparkle-base-animation-length: var(--sparkly-text-animation-length, 1.5s);
      --_sparkle-base-color: var(--sparkly-text-color, #4ab9f8);

      position: relative;
      z-index: 0;
    }

    svg {
      position: absolute;
      z-index: -1;
      width: var(--_sparkle-base-size);
      height: var(--_sparkle-base-size);
      transform-origin: center;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: no-preference) {
      svg {
        animation: sparkle-spin var(--_sparkle-base-animation-length) linear infinite;
      }

      svg.rainbow path {
        animation: rainbow-colors calc(var(--_sparkle-base-animation-length) * 2) linear infinite;
      }
    }

    svg path {
      fill: var(--_sparkle-base-color);
    }

    @keyframes rainbow-colors {
      0%, 100% { fill: #ff0000; }
      14% { fill: #ff8000; }
      28% { fill: #ffff00; }
      42% { fill: #00ff00; }
      56% { fill: #0000ff; }
      70% { fill: #4b0082; }
      84% { fill: #8f00ff; }
    }

    @keyframes sparkle-spin {
      0% {
        scale: 0;
        opacity: 0;
        rotate: 0deg;
      }

      50% {
        scale: 1;
        opacity: 1;
      }

      100% {
        scale: 0;
        opacity: 0;
        rotate: 180deg;
      }
    }
`;

  static register() {
    if ("customElements" in window) {
      window.customElements.define("sparkly-text", SparklyText);
    }
  }

  generateCss() {
    if (!sheet) {
      if (supportsConstructableStylesheets) {
        sheet = new CSSStyleSheet();
        sheet.replaceSync(this.#css);
      } else {
        sheet = document.createElement("style");
        sheet.textContent = this.#css;
      }
    }

    if (supportsConstructableStylesheets) {
      this.shadowRoot.adoptedStyleSheets = [sheet];
    } else {
      this.shadowRoot.append(sheet.cloneNode(true));
    }
  }

  connectedCallback() {
    const needsSparkles = motionOK.matches || !this.shadowRoot;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.generateCss();
      this.shadowRoot.append(document.createElement("slot"));
    }

    if (needsSparkles) {
      this.#numberOfSparkles = parseInt(
        this.getAttribute("number-of-sparkles") || `${this.#numberOfSparkles}`,
        10
      );

      if (Number.isNaN(this.#numberOfSparkles)) {
        throw new Error(`Invalid number-of-sparkles value`);
      }
      this.cleanupSparkles();
      this.addSparkles();
    }

    motionOK.addEventListener("change", this.motionOkChange);
    window.addEventListener("popstate", this.handleNavigation);
    window.addEventListener("pageshow", this.handlePageShow);
  }

  disconnectedCallback() {
    motionOK.removeEventListener("change", this.motionOkChange);
    window.removeEventListener("popstate", this.handleNavigation);
    window.removeEventListener("pageshow", this.handlePageShow);
    this.cleanupSparkles();
  }

  handleNavigation = () => {
    if (motionOK.matches) {
      this.cleanupSparkles();
      this.addSparkles();
    }
  };

  handlePageShow = (event) => {
    // If the page is being loaded from the bfcache
    if (event.persisted && motionOK.matches) {
      this.cleanupSparkles();
      this.addSparkles();
    }
  };

  cleanupSparkles() {
    // Remove all existing sparkle SVGs
    const sparkles = this.shadowRoot.querySelectorAll('svg');
    sparkles.forEach(sparkle => sparkle.remove());
  }

  // Declare as an arrow function to get the appropriate 'this'
  motionOkChange = () => {
    if (motionOK.matches) {
      this.addSparkles();
    }
  };

  addSparkles() {
    for (let i = 0; i < this.#numberOfSparkles; i++) {
      setTimeout(() => {
        this.addSparkle(sparkle => {
          sparkle.style.top = `calc(${
            Math.random() * 110 - 5
          }% - var(--_sparkle-base-size) / 2)`;
          sparkle.style.left = `calc(${
            Math.random() * 110 - 5
          }% - var(--_sparkle-base-size) / 2)`;
        });
      }, i * 500);
    }
  }

  addSparkle(update) {
    if (!sparkleTemplate) {
      const span = document.createElement("span");
      span.innerHTML = this.#sparkleSvg;
      sparkleTemplate = span.firstElementChild.cloneNode(true);
    }

    const sparkleWrapper = sparkleTemplate.cloneNode(true);
    
    // Add rainbow class if --sparkly-text-color is set to 'rainbow'
    const styles = getComputedStyle(this);
    if (styles.getPropertyValue('--sparkly-text-color').trim() === 'rainbow') {
      sparkleWrapper.classList.add('rainbow');
    }
    
    update(sparkleWrapper);
    this.shadowRoot.appendChild(sparkleWrapper);
    sparkleWrapper.addEventListener("animationiteration", () => {
      update(sparkleWrapper);
    });
  }
}

SparklyText.register();

export { SparklyText };
