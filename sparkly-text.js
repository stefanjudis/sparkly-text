let sheet;
let sparkleTemplate;

class SparklyText extends HTMLElement {
  #numberOfSparkles = 3;
  #sparkleSvg = `<svg width="1200" height="1200" viewBox="0 0 1200 1200" aria-hidden="true">
		<path fill="red" d="m611.04 866.16c17.418-61.09 50.25-116.68 95.352-161.42 45.098-44.742 100.94-77.133 162.17-94.062l38.641-10.68-38.641-10.68c-61.227-16.93-117.07-49.32-162.17-94.062-45.102-44.738-77.934-100.33-95.352-161.42l-11.039-38.641-11.039 38.641c-17.418 61.09-50.25 116.68-95.352 161.42-45.098 44.742-100.94 77.133-162.17 94.062l-38.641 10.68 38.641 10.68c61.227 16.93 117.07 49.32 162.17 94.062 45.102 44.738 77.934 100.33 95.352 161.42l11.039 38.641z"/>
	</svg>`;

  generateCss() {
    if (!sheet) {
      const css = `
        :host {
          --_sparkle-base-size: var(--sparkly-text-size, 1em);
          --_sparkle-base-animation-length: var(--sparkly-text-animation-length, 1.5s);
          --_sparkle-base-color: var(--sparkly-text-color, #4ab9f8);

          position: relative;
          z-index: 0;
        }

        .sparkle-wrapper {
          position: absolute;
          z-index: -1;
          width: var(--_sparkle-base-size);
          height: var(--_sparkle-base-size);
          transform-origin: center;
        }

        @media (prefers-reduced-motion: no-preference) {
          .sparkle-wrapper {
            animation: sparkle-spin var(--_sparkle-base-animation-length) linear 1;
          }
        }

        svg {
          width: var(--_sparkle-base-size) !important;
          height: var(--_sparkle-base-size) !important;
          display: block;
          position: absolute;
          pointer-events: none;
        }

        svg path {
          fill: var(--_sparkle-base-color);
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
      sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
    }
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    // https://caniuse.com/mdn-api_cssstylesheet_replacesync
    if (this.shadowRoot || !("replaceSync" in CSSStyleSheet.prototype)) {
      return;
    }

    this.#numberOfSparkles = parseInt(
      this.getAttribute("number-of-sparkles") || `${this.#numberOfSparkles}`,
      10
    );

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(document.createElement("slot"));
    this.generateCss();
    this.addSparkles();
  }

  addSparkles() {
    for (let i = 0; i < this.#numberOfSparkles; i++) {
      setTimeout(() => {
        this.addSparkle();
      }, i * 500);
    }
  }

  addSparkle() {
    if (!sparkleTemplate) {
      sparkleTemplate = document.createElement("span");
      sparkleTemplate.classList.add("sparkle-wrapper");
      sparkleTemplate.innerHTML = this.#sparkleSvg;
    }

    const sparkleWrapper = sparkleTemplate.cloneNode(true);
    sparkleWrapper.style.top = `calc(${
      Math.random() * 110 - 5
    }% - var(--_sparkle-base-size) / 2)`;
    sparkleWrapper.style.left = `calc(${
      Math.random() * 110 - 5
    }% - var(--_sparkle-base-size) / 2)`;

    this.shadowRoot.appendChild(sparkleWrapper);
    sparkleWrapper.addEventListener("animationend", () => {
      sparkleWrapper.remove();
    });

    setTimeout(() => {
      const {matches:motionOK} = window.matchMedia('(prefers-reduced-motion: no-preference)');
      if (motionOK && this.isConnected) this.addSparkle();
    }, 2000 + Math.random() * 1000);
  }
}

if ("customElements" in window) {
  window.customElements.define("sparkly-text", SparklyText);
}

export { SparklyText };
