// oniko.js: https://github.com/adryd325/oniko.js

(function oniko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nikoEl = document.createElement("div");

  let nikoPosX = 32;
  let nikoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
//  let idleAnimation = null;
//  let idleAnimationFrame = 0;

  const nikoSpeed = 12;
  const spriteSets = {
/*    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ], */
    //Up
    N: [
      [0, 1],
      [-1, 1],
      [-2, 1],
      [-3, 1],
    ],
    NE: [
      [0, 1],
      [-1, 1],
      [-2, 2],
      [-3, 2],
    ],
    NW: [
      [0, 1],
      [-1, 1],
      [-2, 0],
      [-3, 0],
    ],

    //Left
    E: [
      [0, 2],
      [-1, 2],
      [-2, 2],
      [-3, 2],
    ],

    //Right
    W: [
      [0, 3],
      [-1, 3],
      [-2, 3],
      [-3, 3],
    ],

    //Down
    S: [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [-3, 0],
    ],
    SE: [
      [0, 0],
      [-1, 0],
      [-2, 2],
      [-3, 2],
    ],
    SW: [
      [0, 0],
      [-1, 0],
      [-2, 3],
      [-3, 3],
    ],
  };

  function init() {
    nikoEl.id = "oniko";
    nikoEl.ariaHidden = true;
    nikoEl.style.width = "48px";
    nikoEl.style.height = "64px";
    nikoEl.style.position = "fixed";
    nikoEl.style.pointerEvents = "none";
    nikoEl.style.imageRendering = "pixelated";
    nikoEl.style.left = `${nikoPosX - 16}px`;
    nikoEl.style.top = `${nikoPosY - 16}px`;
    nikoEl.style.zIndex = 2147483647;

    let nikoFile = "./oniko.png"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nikoFile = curScript.dataset.cat
    }
    nikoEl.style.backgroundImage = `url(${nikoFile})`;

    document.body.appendChild(nikoEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the niko element is removed from DOM
    if (!nikoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp
      frame()
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nikoEl.style.backgroundPosition = `${sprite[0] * 48}px ${sprite[1] * 64}px`;
  }

/*  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nikoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nikoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nikoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nikoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  } */

  function frame() {
    frameCount += 3;
    const diffX = nikoPosX - mousePosX;
    const diffY = nikoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

/*    if (distance < nikoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    } */

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nikoPosX -= (diffX / distance) * nikoSpeed;
    nikoPosY -= (diffY / distance) * nikoSpeed;

    nikoPosX = Math.min(Math.max(16, nikoPosX), window.innerWidth - 16);
    nikoPosY = Math.min(Math.max(16, nikoPosY), window.innerHeight - 16);

    nikoEl.style.left = `${nikoPosX - 16}px`;
    nikoEl.style.top = `${nikoPosY - 16}px`;
  }

  init();
})();
