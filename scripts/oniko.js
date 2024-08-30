function oniko() {
  const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

  // Exit if the user prefers reduced motion.
  if (isReducedMotion) return;

  const nikoEl = document.createElement("div");

  // Load Niko's position from local storage.
  let nikoPosX = 0; // Initial X position
  let nikoPosY = 0; // Initial Y position
  let mousePosX = 0; // Mouse X position
  let mousePosY = 0; // Mouse Y position

  let frameCount = 0; // Frame counter
  let sleepFrameCount = 0; // Frame counter for sleep animation

  const nikoSpeed = 10; // Niko's movement speed
  const sleepFrameSpeed = 0.1; // Speed of sleep frame change (lower is slower)

  let SleepTimer; // Timer for sleep state
  const idleTime = 100000; // 1 minute (sleep duration)
  let isSleeping = false; // Flag to check if Niko is sleeping

  // Sprites.
  const spriteSets = {
    idle: [[0, 0]],
    SleepN: [[0, 1], [-1, 1], [-2, 1], [-3, 1]], // Up
    SleepE: [[0, 2], [-1, 2], [-2, 2], [-3, 2]], // Left
    SleepW: [[0, 3], [-1, 3], [-2, 3], [-3, 3]], // Right
    SleepS: [[0, 4], [-1, 4], [-2, 4], [-3, 4]], // Down
    N: [[0, 0], [-1, 0], [-2, 0], [-3, 0]], // Up
    NE: [[0, 0], [-1, 0], [-2, 6], [-3, 6]], // Up-Right
    NW: [[0, 0], [-1, 0], [-2, 7], [-3, 7]], // Up-Left
    E: [[0, 7], [-1, 7], [-2, 7], [-3, 7]], // Right
    W: [[0, 6], [-1, 6], [-2, 6], [-3, 6]], // Left
    S: [[0, 5], [-1, 5], [-2, 5], [-3, 5]], // Down
    SE: [[0, 5], [-1, 5], [-2, 6], [-3, 6]], // Down-Right
    SW: [[0, 5], [-1, 5], [-2, 7], [-3, 7]], // Down-Left
  };

  function init() {
    // Create Niko element.
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

    // Disable overriding by other css files
    nikoEl.style.setProperty("margin", "0px", "important");
    nikoEl.style.setProperty("padding", "0px", "important");
    nikoEl.style.setProperty("background-color", "transparent", "important");
    nikoEl.style.setProperty("box-shadow", "0px 0px 0px 0px transparent", "important");

    // Set background image for Niko.
    let nikoFile = "img/oniko.png"; // Correct path to the sprite
    nikoEl.style.backgroundImage = `url(${nikoFile})`;

    document.body.appendChild(nikoEl);

    resetSleepTimer(); 
    window.requestAnimationFrame(onAnimationFrame);

    // Track mouse position.
    document.onmousemove = function (event) {
      mousePosX = event.clientX; // Update mouse X position
      mousePosY = event.clientY; // Update mouse Y position
      resetSleepTimer(); // Reset idle timer
      window.requestAnimationFrame(onAnimationFrame); // Start animation frame
    };
  }

  let lastFrameTimestamp;

  // Animate Niko.
  function onAnimationFrame(timestamp) {
    if (!nikoEl.isConnected) return; // Exit if Niko is not in the DOM
    if (!lastFrameTimestamp) lastFrameTimestamp = timestamp; // Initialize timestamp
    if (timestamp - lastFrameTimestamp > 70) {
      lastFrameTimestamp = timestamp; // Update last frame timestamp
      frame(); // Update Niko's position
    }
    window.requestAnimationFrame(onAnimationFrame); // Request the next animation frame
  };

  // Set the sprite based on the current frame.
  function setSprite(name, frame) {
    if (name != undefined){
      const sprite = spriteSets[name][frame % spriteSets[name].length];
      nikoEl.style.backgroundPosition = `${sprite[0] * 48}px ${sprite[1] * 64}px`;
    }
  }

  // Update Niko's animation.
  function frame() {
    frameCount += 3; // Increment frame count
    let diffX = mousePosX - nikoPosX; // Calculate difference in X
    let diffY = mousePosY - nikoPosY; // Calculate difference in Y
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    // Check if Niko should go to sleep
    if (distance < 128 && !SleepTimer && !isSleeping) {
      SleepTimer = setTimeout(() => {
        isSleeping = true; // Set sleeping state
        sleepFrameCount = 0; // Reset sleep frame count
      }, idleTime);
    }

    // If Niko is sleeping, update sleep animation
    if (isSleeping) {
      setSprite(getSleepDirection(), Math.floor(sleepFrameCount));
      sleepFrameCount += sleepFrameSpeed; // Increment sleep frame count based on speed
      return;
    }

    // Determine the direction of Niko based on mouse position.
    let direction;
    if (distance > 0) {
      if (diffY / distance > 0.5) direction = "N";
      else if (diffY / distance < -0.5) direction = "S";
      else if (diffX / distance > 0.5) direction = "W";
      else if (diffX / distance < -0.5) direction = "E";
    }

    // Move Niko if he is far from the mouse.
    if (distance > 128) {
      setSprite(direction, frameCount); // Update sprite based on frame count
      nikoPosX += (diffX / distance) * nikoSpeed; // Update Niko's position
      nikoPosY += (diffY / distance) * nikoSpeed; // Update Niko's position
    } else {
      setSprite(direction || "idle", 0); // Set idle sprite
    }

    // Update Niko's position in the DOM element.
    nikoEl.style.left = `${nikoPosX}px`; // Update the left position
    nikoEl.style.top = `${nikoPosY}px`; // Update the top position

    // Constrain Niko's position within the window.
    nikoPosX = Math.min(Math.max(16, nikoPosX), window.innerWidth - 16);
    nikoPosY = Math.min(Math.max(16, nikoPosY), window.innerHeight - 16);
  }

  // Get the direction for sleep animation
  function getSleepDirection() {
    let diffX = mousePosX !== undefined ? nikoPosX - mousePosX : 0;
    let diffY = mousePosY !== undefined ? nikoPosY - mousePosY : 0;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
    let direction;

    if (distance > 0) {
      if (diffY / distance > 0.5) direction = "SleepN";
      else if (diffY / distance < -0.5) direction = "SleepS";
      else if (diffX / distance > 0.5) direction = "SleepW";
      else if (diffX / distance < -0.5) direction = "SleepE";
    }

    return direction;
  }

  // Reset idle timer
  function resetSleepTimer() {
    clearTimeout(SleepTimer);
    SleepTimer = null; // Clear the idle timer
    if (isSleeping) {
      isSleeping = false; // Reset sleeping state
      sleepFrameCount = 0; // Reset sleep frame count
    }
  }

  init(); // Initialize Niko
}

oniko(); // Call the function
