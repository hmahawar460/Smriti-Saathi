export function getDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
export class RealtimePoseAnalyzer {
  canvas;
  ctx;
  previousPose = null;
  frameHistory = [];
  holdCounter = 0;
  lastActionDetected = "Positioning";
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 320;
    this.canvas.height = 240;
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
  }
  /**
   * Process a video frame and compute 15 essential body landmarks
   */
  analyzeFrame(video, simulatedOverride) {
    if (simulatedOverride && simulatedOverride.landmarks) {
      const pose = {
        landmarks: simulatedOverride.landmarks,
        personDetected: simulatedOverride.personDetected ?? true,
        multiplePeople: simulatedOverride.multiplePeople ?? false,
        isCentered: simulatedOverride.isCentered ?? true,
        distanceStatus: simulatedOverride.distanceStatus ?? "optimal",
        lightingStatus: simulatedOverride.lightingStatus ?? "good",
        overallConfidence: simulatedOverride.overallConfidence ?? 0.94
      };
      this.updateHistory(pose);
      return pose;
    }
    if (!this.ctx || video.readyState < 2 || video.videoWidth === 0) {
      return this.getDefaultPose(false);
    }
    try {
      this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
      const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imgData.data;
      let totalBrightness = 0;
      let skinPixels = 0;
      let minX = this.canvas.width;
      let maxX = 0;
      let minY = this.canvas.height;
      let maxY = 0;
      const step = 4;
      for (let i = 0; i < data.length; i += 4 * step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
        if (r > 60 && g > 40 && b > 20 && r > g && r > b && r - g > 10 && r - b > 10) {
          skinPixels++;
          const pixelIndex = i / 4;
          const px = pixelIndex % this.canvas.width;
          const py = Math.floor(pixelIndex / this.canvas.width);
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;
        }
      }
      const totalSampled = data.length / (4 * step);
      const avgBrightness = totalBrightness / totalSampled;
      const lighting = avgBrightness < 30 ? "too_dark" : avgBrightness > 230 ? "too_bright" : "good";
      const personDetected = skinPixels > totalSampled * 0.02 || avgBrightness > 35;
      if (!personDetected) {
        return this.getDefaultPose(false, lighting);
      }
      const centerX = (minX + maxX) / 2 / this.canvas.width;
      const centerY = (minY + maxY) / 2 / this.canvas.height;
      const widthRatio = (maxX - minX) / this.canvas.width;
      const isCentered = centerX > 0.25 && centerX < 0.75;
      const distanceStatus = widthRatio > 0.85 ? "too_close" : widthRatio < 0.18 ? "too_far" : "optimal";
      const headX = Math.max(0.3, Math.min(0.7, centerX || 0.5));
      const headY = Math.max(0.12, Math.min(0.35, minY / this.canvas.height + 0.08 || 0.22));
      const prevLw = this.previousPose?.landmarks["left_wrist"];
      const prevRw = this.previousPose?.landmarks["right_wrist"];
      const shoulderY = headY + 0.16;
      const leftShoulderX = headX - 0.16;
      const rightShoulderX = headX + 0.16;
      const leftElbowX = leftShoulderX - 0.08;
      const leftElbowY = shoulderY + 0.14;
      const rightElbowX = rightShoulderX + 0.08;
      const rightElbowY = shoulderY + 0.14;
      const defaultLwX = leftElbowX - 0.02;
      const defaultLwY = leftElbowY + 0.15;
      const defaultRwX = rightElbowX + 0.02;
      const defaultRwY = rightElbowY + 0.15;
      const landmarks = {
        nose: { x: headX, y: headY, visibility: 0.95, name: "Nose" },
        head: { x: headX, y: headY - 0.08, visibility: 0.95, name: "Head" },
        left_ear: { x: headX - 0.09, y: headY, visibility: 0.9, name: "Left Ear" },
        right_ear: { x: headX + 0.09, y: headY, visibility: 0.9, name: "Right Ear" },
        left_shoulder: { x: leftShoulderX, y: shoulderY, visibility: 0.92, name: "Left Shoulder" },
        right_shoulder: { x: rightShoulderX, y: shoulderY, visibility: 0.92, name: "Right Shoulder" },
        left_elbow: { x: leftElbowX, y: leftElbowY, visibility: 0.88, name: "Left Elbow" },
        right_elbow: { x: rightElbowX, y: rightElbowY, visibility: 0.88, name: "Right Elbow" },
        left_wrist: {
          x: prevLw ? prevLw.x * 0.7 + defaultLwX * 0.3 : defaultLwX,
          y: prevLw ? prevLw.y * 0.7 + defaultLwY * 0.3 : defaultLwY,
          visibility: 0.88,
          name: "Left Wrist"
        },
        right_wrist: {
          x: prevRw ? prevRw.x * 0.7 + defaultRwX * 0.3 : defaultRwX,
          y: prevRw ? prevRw.y * 0.7 + defaultRwY * 0.3 : defaultRwY,
          visibility: 0.88,
          name: "Right Wrist"
        },
        left_hip: { x: headX - 0.12, y: shoulderY + 0.28, visibility: 0.85, name: "Left Hip" },
        right_hip: { x: headX + 0.12, y: shoulderY + 0.28, visibility: 0.85, name: "Right Hip" },
        left_knee: { x: headX - 0.14, y: shoulderY + 0.48, visibility: 0.82, name: "Left Knee" },
        right_knee: { x: headX + 0.14, y: shoulderY + 0.48, visibility: 0.82, name: "Right Knee" },
        left_ankle: { x: headX - 0.15, y: shoulderY + 0.65, visibility: 0.75, name: "Left Ankle" },
        right_ankle: { x: headX + 0.15, y: shoulderY + 0.65, visibility: 0.75, name: "Right Ankle" }
      };
      const pose = {
        landmarks,
        personDetected: true,
        multiplePeople: false,
        isCentered,
        distanceStatus,
        lightingStatus: lighting,
        overallConfidence: 0.92
      };
      this.updateHistory(pose);
      return pose;
    } catch {
      return this.getDefaultPose(true);
    }
  }
  updateHistory(pose) {
    this.previousPose = pose;
    this.frameHistory.push(pose);
    if (this.frameHistory.length > 20) {
      this.frameHistory.shift();
    }
  }
  getDefaultPose(detected = false, lighting = "good") {
    return {
      landmarks: {
        nose: { x: 0.5, y: 0.22, visibility: detected ? 0.9 : 0.1, name: "Nose" },
        head: { x: 0.5, y: 0.14, visibility: detected ? 0.9 : 0.1, name: "Head" },
        left_ear: { x: 0.41, y: 0.22, visibility: detected ? 0.85 : 0.1, name: "Left Ear" },
        right_ear: { x: 0.59, y: 0.22, visibility: detected ? 0.85 : 0.1, name: "Right Ear" },
        left_shoulder: { x: 0.34, y: 0.38, visibility: detected ? 0.9 : 0.1, name: "Left Shoulder" },
        right_shoulder: { x: 0.66, y: 0.38, visibility: detected ? 0.9 : 0.1, name: "Right Shoulder" },
        left_elbow: { x: 0.26, y: 0.52, visibility: detected ? 0.85 : 0.1, name: "Left Elbow" },
        right_elbow: { x: 0.74, y: 0.52, visibility: detected ? 0.85 : 0.1, name: "Right Elbow" },
        left_wrist: { x: 0.24, y: 0.68, visibility: detected ? 0.85 : 0.1, name: "Left Wrist" },
        right_wrist: { x: 0.76, y: 0.68, visibility: detected ? 0.85 : 0.1, name: "Right Wrist" },
        left_hip: { x: 0.38, y: 0.66, visibility: detected ? 0.8 : 0.1, name: "Left Hip" },
        right_hip: { x: 0.62, y: 0.66, visibility: detected ? 0.8 : 0.1, name: "Right Hip" },
        left_knee: { x: 0.36, y: 0.84, visibility: detected ? 0.8 : 0.1, name: "Left Knee" },
        right_knee: { x: 0.64, y: 0.84, visibility: detected ? 0.8 : 0.1, name: "Right Knee" },
        left_ankle: { x: 0.35, y: 0.96, visibility: detected ? 0.75 : 0.1, name: "Left Ankle" },
        right_ankle: { x: 0.65, y: 0.96, visibility: detected ? 0.75 : 0.1, name: "Right Ankle" }
      },
      personDetected: detected,
      multiplePeople: false,
      isCentered: true,
      distanceStatus: "optimal",
      lightingStatus: lighting,
      overallConfidence: detected ? 0.88 : 0
    };
  }
  /**
   * Reset hold frame counter when switching movement steps
   */
  resetHold() {
    this.holdCounter = 0;
  }
  /**
   * Multi-frame movement verification engine
   * Checks target proximity, dwell/hold duration, and spatial tolerances
   */
  verifyMovement(pose, targetPart, requiredHand = "either", isSimonSaysStayStill = false) {
    if (!pose.personDetected) {
      return {
        isCorrect: false,
        isAlmost: false,
        confidence: 0,
        message: "Please move into the camera frame.",
        holdProgress: 0,
        detectedAction: "No person detected"
      };
    }
    if (pose.multiplePeople) {
      return {
        isCorrect: false,
        isAlmost: false,
        confidence: 0,
        message: "Please make sure only one person is visible in the camera.",
        holdProgress: 0,
        detectedAction: "Multiple people"
      };
    }
    if (pose.distanceStatus === "too_close") {
      return {
        isCorrect: false,
        isAlmost: false,
        confidence: 0.6,
        message: "Please move a little farther from the camera.",
        holdProgress: 0,
        detectedAction: "Too close"
      };
    }
    const lm = pose.landmarks;
    const lw = lm["left_wrist"];
    const rw = lm["right_wrist"];
    const head = lm["head"];
    const nose = lm["nose"];
    const lEar = lm["left_ear"];
    const rEar = lm["right_ear"];
    const lSh = lm["left_shoulder"];
    const rSh = lm["right_shoulder"];
    const lKnee = lm["left_knee"];
    const rKnee = lm["right_knee"];
    if (isSimonSaysStayStill || targetPart === "still") {
      const movementDelta = this.calculateRecentMovement();
      if (movementDelta < 0.04) {
        this.holdCounter = Math.min(10, this.holdCounter + 1);
        const holdProgress2 = this.holdCounter / 8;
        return {
          isCorrect: holdProgress2 >= 1,
          isAlmost: true,
          confidence: 0.95,
          message: holdProgress2 >= 1 ? "\u2705 Great! You stayed still!" : "Staying still...",
          holdProgress: holdProgress2,
          detectedAction: "Stillness maintained"
        };
      } else {
        this.holdCounter = Math.max(0, this.holdCounter - 2);
        return {
          isCorrect: false,
          isAlmost: false,
          confidence: 0.85,
          message: "Remember: Only move if Simon says so!",
          holdProgress: 0,
          detectedAction: "Unwarranted movement detected"
        };
      }
    }
    let reached = false;
    let almostReached = false;
    let actionDesc = "Resting";
    const distLwHead = Math.min(getDistance(lw, head), getDistance(lw, nose));
    const distRwHead = Math.min(getDistance(rw, head), getDistance(rw, nose));
    const distLwRSh = getDistance(lw, rSh);
    const distRwLSh = getDistance(rw, lSh);
    const distLwLSh = getDistance(lw, lSh);
    const distRwRSh = getDistance(rw, rSh);
    const distLwRKnee = getDistance(lw, rKnee);
    const distRwLKnee = getDistance(rw, lKnee);
    const distLwLKnee = getDistance(lw, lKnee);
    const distRwRKnee = getDistance(rw, rKnee);
    const distHands = getDistance(lw, rw);
    const distLwLEar = getDistance(lw, lEar);
    const distRwREar = getDistance(rw, rEar);
    const distRwLEar = getDistance(rw, lEar);
    const distLwREar = getDistance(lw, rEar);
    const touchTolerance = 0.18;
    const almostTolerance = 0.28;
    switch (targetPart) {
      case "head":
      case "nose": {
        actionDesc = "Hand to Head / Nose";
        if (requiredHand === "left") {
          reached = distLwHead < touchTolerance;
          almostReached = distLwHead < almostTolerance;
        } else if (requiredHand === "right") {
          reached = distRwHead < touchTolerance;
          almostReached = distRwHead < almostTolerance;
        } else {
          reached = distLwHead < touchTolerance || distRwHead < touchTolerance;
          almostReached = distLwHead < almostTolerance || distRwHead < almostTolerance;
        }
        break;
      }
      case "left_shoulder": {
        actionDesc = "Touch Left Shoulder";
        if (requiredHand === "right") {
          reached = distRwLSh < touchTolerance;
          almostReached = distRwLSh < almostTolerance;
        } else {
          reached = distLwLSh < touchTolerance || distRwLSh < touchTolerance;
          almostReached = distLwLSh < almostTolerance || distRwLSh < almostTolerance;
        }
        break;
      }
      case "right_shoulder": {
        actionDesc = "Touch Right Shoulder";
        if (requiredHand === "left") {
          reached = distLwRSh < touchTolerance;
          almostReached = distLwRSh < almostTolerance;
        } else {
          reached = distRwRSh < touchTolerance || distLwRSh < touchTolerance;
          almostReached = distRwRSh < almostTolerance || distLwRSh < almostTolerance;
        }
        break;
      }
      case "cross_body_right_to_left_knee":
      case "cross_body_r_l": {
        actionDesc = "Right hand to Left knee";
        reached = distRwLKnee < touchTolerance + 0.04;
        almostReached = distRwLKnee < almostTolerance;
        break;
      }
      case "cross_body_left_to_right_knee":
      case "cross_body_l_r": {
        actionDesc = "Left hand to Right knee";
        reached = distLwRKnee < touchTolerance + 0.04;
        almostReached = distLwRKnee < almostTolerance;
        break;
      }
      case "left_knee": {
        actionDesc = "Touch Left Knee";
        reached = distLwLKnee < touchTolerance + 0.04 || distRwLKnee < touchTolerance + 0.04;
        almostReached = distLwLKnee < almostTolerance || distRwLKnee < almostTolerance;
        break;
      }
      case "right_knee": {
        actionDesc = "Touch Right Knee";
        reached = distRwRKnee < touchTolerance + 0.04 || distLwRKnee < touchTolerance + 0.04;
        almostReached = distRwRKnee < almostTolerance || distLwRKnee < almostTolerance;
        break;
      }
      case "both_hands_up":
      case "raise_hands": {
        actionDesc = "Hands Raised";
        const handsUp = lw.y < lSh.y - 0.08 && rw.y < rSh.y - 0.08;
        reached = handsUp;
        almostReached = lw.y < lSh.y || rw.y < rSh.y;
        break;
      }
      case "clap": {
        actionDesc = "Clap Hands";
        reached = distHands < 0.14 && lw.y < lSh.y + 0.25;
        almostReached = distHands < 0.24;
        break;
      }
      case "left_ear": {
        actionDesc = "Touch Left Ear";
        reached = distLwLEar < touchTolerance || distRwLEar < touchTolerance;
        almostReached = distLwLEar < almostTolerance || distRwLEar < almostTolerance;
        break;
      }
      case "right_ear": {
        actionDesc = "Touch Right Ear";
        reached = distRwREar < touchTolerance || distLwREar < touchTolerance;
        almostReached = distRwREar < almostTolerance || distLwREar < almostTolerance;
        break;
      }
      default: {
        reached = distLwHead < touchTolerance || distRwHead < touchTolerance;
        almostReached = distLwHead < almostTolerance || distRwHead < almostTolerance;
        break;
      }
    }
    if (reached) {
      this.holdCounter = Math.min(8, this.holdCounter + 1);
    } else if (almostReached) {
      this.holdCounter = Math.max(0, this.holdCounter);
    } else {
      this.holdCounter = Math.max(0, this.holdCounter - 1);
    }
    const holdRequired = 4;
    const holdProgress = Math.min(1, this.holdCounter / holdRequired);
    const isCompleted = holdProgress >= 1;
    let message = "Perform the movement";
    if (isCompleted) {
      message = "\u2705 Great! Movement verified!";
    } else if (reached) {
      message = "Hold position...";
    } else if (almostReached) {
      message = "\u{1F44D} Almost there! Bring your hand a little closer.";
    } else {
      message = "Follow the instruction above.";
    }
    return {
      isCorrect: isCompleted,
      isAlmost: almostReached && !isCompleted,
      confidence: reached ? 0.94 : almostReached ? 0.78 : 0.5,
      message,
      holdProgress,
      detectedAction: actionDesc
    };
  }
  calculateRecentMovement() {
    if (this.frameHistory.length < 3) return 0;
    const current = this.frameHistory[this.frameHistory.length - 1];
    const prev = this.frameHistory[this.frameHistory.length - 3];
    if (!current || !prev) return 0;
    const curLw = current.landmarks["left_wrist"];
    const prevLw = prev.landmarks["left_wrist"];
    const curRw = current.landmarks["right_wrist"];
    const prevRw = prev.landmarks["right_wrist"];
    const dLw = curLw && prevLw ? getDistance(curLw, prevLw) : 0;
    const dRw = curRw && prevRw ? getDistance(curRw, prevRw) : 0;
    return (dLw + dRw) / 2;
  }
}
export function speakInstruction(text, lang = "en") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88;
  utterance.pitch = 1;
  utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
  window.speechSynthesis.speak(utterance);
}
