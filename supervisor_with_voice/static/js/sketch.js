// let inc = 0.01;
// let yoff = 0;
// let mic;

let waves = [];
const colors = [
  { offset: 0.42, color: "#FF84DD" },
  { offset: 0.4277, color: "#90A2FF" },
  { offset: 0.4338, color: "#D253E7" },
  { offset: 0.4421, color: "#FFC700" }
];

const waveSketch = (p) => {
  p.setup = () => {
    let style = getComputedStyle(document.body);
    let containerHeight = style.getPropertyValue('--chat-footer-height');
    containerHeight = (containerHeight) ? containerHeight.slice(0, -2): 300;
    const canvas = p.createCanvas(p.windowWidth, p.min(p.windowHeight, containerHeight));
    canvas.parent('waveform');
    p.pixelDensity(2);
    
    for (let i = 0; i < 2; i++) {
      let points = [];
      for (let j = 0; j < 20; j++) {
        points.push({
          x: 0,
          y: 0,
          fixedY: p.height / 2,
          speed: 0.05,
          cur: (i + j) / 3,
          max: p.random(40)
        });
      }
      waves.push({ index: i, points: points });
    }
    p.windowResized();
  };

  p.draw = () => {
    p.clear();
    waves.forEach(wave => drawWave(wave));
  };

  function drawWave(wave) {
    p.noFill();
    let speed = speechStarted ? 8 : 2;
    wave.points.forEach((point, i, points) => {
      point.cur += point.speed * Math.random(40) * speed;
      point.y = point.fixedY + p.sin(point.cur) * point.max;
    });

    // Draw the top half of the wave with gradient
    const gradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height);
    colors.forEach(colorStop => {
      gradient.addColorStop(colorStop.offset, p.color(colorStop.color).toString());
    });
    p.drawingContext.strokeStyle = gradient;
    p.strokeWeight(4);

    p.beginShape();
    wave.points.forEach((point, i) => {
      if (i == 0) {
        p.vertex(point.x, point.y);
      } else {
        const prevX = wave.points[i - 1].x;
        const prevY = wave.points[i - 1].y;
        const cx = (prevX + point.x) / 2;
        const cy = (prevY + point.y) / 2;
        p.quadraticVertex(prevX, prevY, cx, cy);
      }
    });
    p.endShape();
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.min(p.windowHeight, 300));
    waves.forEach(wave => {
      wave.points.forEach((point, i) => {
        point.x = i * (p.width / (wave.points.length - 2));
        point.fixedY = p.height / 2;
        point.y = point.fixedY;
      });
    });
  };
};

new p5(waveSketch);


// working p5js wave 

// let waves = [];
// const colors = [
//   { offset: 0.42, color: "#FF84DD" },
//   { offset: 0.4277, color: "#90A2FF" },
//   { offset: 0.4338, color: "#D253E7" },
//   { offset: 0.4421, color: "#FFC700" }
// ];
  
// function setup() {
//   const canvas = createCanvas(windowWidth, min(windowHeight, 300));
//   canvas.parent('waveform');
//   pixelDensity(2);
  
//   for (let i = 0; i < 2; i++) {
//     let points = [];
//     for (let j = 0; j < 20; j++) {
//       points.push({
//         x: 0,
//         y: 0,
//         fixedY: height / 2,
//         speed: 0.05,
//         cur: (i + j) / 3,
//         max: random(40)
//       });
//     }
//     waves.push({ index: i, points: points });
//   }
//   windowResized();
// }

// function draw() {
//   clear();
//   waves.forEach(wave => drawWave(wave));
// }

// function drawWave(wave) {
//   noFill();
//   let speed = speechStarted ? 8: 2;
//   wave.points.forEach((point, i, points) => {
//     point.cur += point.speed * Math.random(40) * speed;
//     point.y = point.fixedY + sin(point.cur) * point.max;
//   });

//   // Draw the top half of the wave with gradient
//   const gradient = drawingContext.createLinearGradient(0, 0, 0, height);
//   colors.forEach(colorStop => {
//     gradient.addColorStop(colorStop.offset, color(colorStop.color).toString());
//   });
//   drawingContext.strokeStyle = gradient;
//   strokeWeight(4);

//   beginShape();
//   wave.points.forEach((point, i) => {
//     if (i == 0) {
//       vertex(point.x, point.y);
//     } else {
//       const prevX = wave.points[i - 1].x;
//       const prevY = wave.points[i - 1].y;
//       const cx = (prevX + point.x) / 2;
//       const cy = (prevY + point.y) / 2;
//       quadraticVertex(prevX, prevY, cx, cy);
//     }
//   });
//   endShape();
// }

// function windowResized() {
//   resizeCanvas(windowWidth, min(windowHeight, 300));
//   waves.forEach(wave => {
//     wave.points.forEach((point, i) => {
//       point.x = i * (width / (wave.points.length - 2));
//       point.fixedY = height / 2;
//       point.y = point.fixedY;
//     });
//   });
// }


// working code on top 


// custom code 

// (function() {
//     const container = document.getElementById("chat-screen__footer");
//     const canvas = document.getElementById('waveform');
//     const ctx = canvas.getContext("2d");
//     const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

//     const colors = [
//         { offset: 0.42, color: "#FF84DD" },
//         { offset: 0.4277, color: "#90A2FF" },
//         { offset: 0.4338, color: "#D253E7" },
//         { offset: 0.4421, color: "#FFC700" }
//     ];

//     const waves = Array.from({ length: 2 }, (_, i) => ({
//         index: i,
//         points: Array.from({ length: 20 }, (_, j) => ({
//             x: 0,
//             y: 0,
//             fixedY: 0,
//             speed: 0.05,
//             cur: (i + j) / 3,
//             max: Math.random() * 40
//         }))
//     }));

//     function resize() {
//         const stageWidth = container.clientWidth;
//         const stageHeight = container.clientHeight;

//         canvas.width = stageWidth * pixelRatio;
//         canvas.height = stageHeight * pixelRatio;
//         ctx.scale(pixelRatio, pixelRatio);

//         waves.forEach(wave => {
//             wave.points.forEach((point, i) => {
//                 point.x = i * (stageWidth / (wave.points.length - 2));
//                 point.fixedY = stageHeight / 2;
//                 point.y = point.fixedY;
//             });
//         });
//     }

//     function drawWave(wave) {
//         ctx.beginPath();
//         const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height / pixelRatio);
//         colors.forEach(colorStop => {
//             gradient.addColorStop(colorStop.offset, colorStop.color);
//         });
//         ctx.strokeStyle = gradient;
//         ctx.lineWidth = 4;

//         ctx.moveTo(wave.points[0].x, wave.points[0].y);

//         wave.points.forEach((point, i, points) => {
//             point.cur += point.speed;
//             point.y = point.fixedY + Math.sin(point.cur) * point.max;
//             const prevX = points[i - 1] ? points[i - 1].x : point.x;
//             const prevY = points[i - 1] ? points[i - 1].y : point.y;
//             const cx = (prevX + point.x) / 2;
//             const cy = (prevY + point.y) / 2;
//             ctx.quadraticCurveTo(prevX, prevY, cx, cy);
//         });

//         ctx.stroke();
//         ctx.closePath();
//     }

//     function animate() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         waves.forEach(drawWave);
//         requestAnimationFrame(animate);
//     }

//     window.addEventListener("resize", resize);
//     resize();
//     animate();
// })();



// (function() {
//     const canvas = document.getElementById('microphone-circle');
//     const ctx = canvas.getContext('2d');
//     const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
//     const colors = ["#FF84DD", "#90A2FF", "#D253E7", "#FFC700"];
    
//     const waves = Array.from({ length: 1 }, (_, i) => ({
//         points: Array.from({ length: 360 }, (_, j) => ({
//             angle: (j * Math.PI) / 180,
//             speed: 0.02 + Math.random() * 0.02,
//             amplitude: Math.random() * 10
//         }))
//     }));

//     function resizeCanvas() {
//         const size = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
//         canvas.width = size * pixelRatio + 100;
//         canvas.height = size * pixelRatio + 100;
//         ctx.scale(pixelRatio, pixelRatio);
//     }

//     function drawWave() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         const centerX = canvas.width / (2 * pixelRatio);
//         const centerY = canvas.height / (2 * pixelRatio);

//         waves.forEach((wave, waveIndex) => {
//             ctx.beginPath();
//             const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height / pixelRatio);
//             colors.forEach((color, i) => {
//                 gradient.addColorStop(i / (colors.length - 1), color);
//             });
//             ctx.strokeStyle = gradient;
//             ctx.lineWidth = 2;

//             wave.points.forEach((point, i, points) => {
//                 point.angle += point.speed;
//                 const radius = 150 + point.amplitude * Math.sin(point.angle);
//                 const x = centerX + radius * Math.cos((i * Math.PI) / 180);
//                 const y = centerY + radius * Math.sin((i * Math.PI) / 180);
//                 if (i === 0) {
//                     ctx.moveTo(x, y);
//                 } else {
//                     const prevPoint = points[i - 1];
//                     const prevX = centerX + (50 + prevPoint.amplitude * Math.sin(prevPoint.angle)) * Math.cos((i - 1) * Math.PI / 180);
//                     const prevY = centerY + (50 + prevPoint.amplitude * Math.sin(prevPoint.angle)) * Math.sin((i - 1) * Math.PI / 180);
//                     const controlX = (prevX + x) / 2;
//                     const controlY = (prevY + y) / 2;
//                     ctx.quadraticCurveTo(prevX, prevY, controlX, controlY);
//                 }
//             });

//             const lastPoint = wave.points[wave.points.length - 1];
//             const lastX = centerX + (100 + lastPoint.amplitude * Math.sin(lastPoint.angle)) * Math.cos(0);
//             const lastY = centerY + (100 + lastPoint.amplitude * Math.sin(lastPoint.angle)) * Math.sin(0);
//             ctx.quadraticCurveTo(lastX, lastY, wave.points[0].x, wave.points[0].y);

//             ctx.closePath();
//             ctx.stroke();
//         });
//     }

//     function animate() {
//         drawWave();
//         requestAnimationFrame(animate);
//     }

//     window.addEventListener('resize', resizeCanvas);
//     resizeCanvas();
//     animate();
// })();






