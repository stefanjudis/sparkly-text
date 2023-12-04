let _needsStyles = true;

class SparklyText extends HTMLElement {
  static identifiers = {};

  #numberOfSparkles = 3;
  #sparkleSvg = `<svg width="1200" height="1200" viewBox="0 0 1200 1200" aria-hidden="true">
		<path fill="red" d="m611.04 866.16c17.418-61.09 50.25-116.68 95.352-161.42 45.098-44.742 100.94-77.133 162.17-94.062l38.641-10.68-38.641-10.68c-61.227-16.93-117.07-49.32-162.17-94.062-45.102-44.738-77.934-100.33-95.352-161.42l-11.039-38.641-11.039 38.641c-17.418 61.09-50.25 116.68-95.352 161.42-45.098 44.742-100.94 77.133-162.17 94.062l-38.641 10.68 38.641 10.68c61.227 16.93 117.07 49.32 162.17 94.062 45.102 44.738 77.934 100.33 95.352 161.42l11.039 38.641z"/>
	</svg>`;

  generateCss(breakpoint, type) {
    if (!_needsStyles) return;

    const css = `
		sparkly-text {
			--_sparkle-base-size: var(--sparkly-text-size, 1em);
			--_sparkle-base-animation-length: var(--sparkly-text-animation-length, 1.5s);
			--_sparkle-base-color: var(--sparkly-text-color, #4ab9f8);

			position: relative;
			z-index: 0;
		}

		sparkly-text .sparkle-wrapper {
			position: absolute;
			z-index: -1;
			width: var(--_sparkle-base-size);
			height: var(--_sparkle-base-size);
			animation: sparkle-spin var(--_sparkle-base-animation-length) linear 1;
			transform-origin: center;
		}

		sparkly-text svg {
			width: var(--_sparkle-base-size) !important;
			height: var(--_sparkle-base-size) !important;
			display: block;
			position: absolute;
			pointer-events: none;
		}

		sparkly-text svg path {
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
    let sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    _needsStyles = false;
  }

  connectedCallback() {
    this.#numberOfSparkles = parseInt(
      this.getAttribute("number-of-sparkles") || `${this.#numberOfSparkles}`,
      10
    );

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
    const sparkleWrapper = document.createElement("span");
    sparkleWrapper.classList.add("sparkle-wrapper");
    sparkleWrapper.innerHTML = this.#sparkleSvg;
    sparkleWrapper.style.top = `calc(${
      Math.random() * 110 - 5
    }% - var(--_sparkle-base-size) / 2)`;
    sparkleWrapper.style.left = `calc(${
      Math.random() * 110 - 5
    }% - var(--_sparkle-base-size) / 2)`;

    this.appendChild(sparkleWrapper);
    sparkleWrapper.addEventListener("animationend", () => {
      sparkleWrapper.remove();
    });

    setTimeout(() => {
      this.addSparkle();
    }, 2000 + Math.random() * 1000);
  }
}

if ("customElements" in window) {
  window.customElements.define("sparkly-text", SparklyText);
}

export { SparklyText };
