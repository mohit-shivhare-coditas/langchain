let baseRadius = 90;
let points = 360; // Number of points in the shape
let angleOffset = 0;
let c1, c2;

const circleSketch = (p) => {
  let style = getComputedStyle(document.body);
  let containerHeight = style.getPropertyValue('--chat-footer-height');
  containerHeight = (containerHeight) ? containerHeight.slice(0, -2): 300;
  baseRadius = Math.abs(containerHeight / 3 - 10);
  p.setup = () => {
    p.createCanvas(containerHeight, containerHeight).parent('microphone-circle');
    p.frameRate(30); // Slow down the animation

    // Define gradient colors
    c1 = p.color(210,83,231); // Start color
    c2 = p.color(144,162,255); // End color
  };

  p.draw = () => {
    p.clear();
    p.translate(p.width / 2, p.height / 2);

    // Draw three overlapping circles
    drawCircle(0, 0, baseRadius, true, true);  // Circle with dents, reversed gradient
    drawCircle(2, 0, baseRadius, true, false);  // Circle with dents, reversed gradient
    // drawCircle(0, 2, baseRadius, true, false);  // Circle with dents, normal gradient
    drawCircle(0, 0, baseRadius, false, false);  // Circle without dents

    angleOffset += speechStarted ? 0.9 : 0.2; // Adjust for smooth animation
  };

  function drawCircle(x, y, radius, withDents, inner) {
    p.push();
    p.translate(x, y);
    drawGradientOutline(radius, withDents, inner);
    p.pop();
  }

  function drawGradientOutline(radius, withDents, inner) {
    let angleStep = p.TWO_PI / points;

    for (let i = 0; i < p.TWO_PI; i += angleStep) {
      let r1 = radius;
      let r2 = radius;

      if (withDents) {
        let offset1, offset2;
        if (inner) {
          offset1 = p.map(p.sin(i * 6 + angleOffset), -1, 4, -1, 1 + (Number(speechStarted) * 6) );
          r1 = radius + offset1 + 5;
          offset2 = p.map(p.sin((i + angleStep) * 6 + angleOffset), -1, 4, -1, 1 + (Number(speechStarted) * 6));
          r2 = radius + offset2 + 5;
        } else {
          offset1 = p.map(p.sin(i * 4 + angleOffset), -1, 1, -2, 2);
          r1 = radius + offset1 + 4;
          offset2 = p.map(p.sin((i + angleStep) * 4 + angleOffset), -1, 1, -2, 2);
          r2 = radius + offset2 + 4;
        }
      }

      let x1 = r1 * p.cos(i);
      let y1 = r1 * p.sin(i);
      let x2 = r2 * p.cos(i + angleStep);
      let y2 = r2 * p.sin(i + angleStep);

      let inter = p.map(i, 0, p.TWO_PI, 0, 1);
      let c = p.lerpColor(inner ? c2 : c1, inner ? c1 : c2, inter); // Reverse gradient if inner is true
      p.stroke(c);
      p.strokeWeight(2);
      p.line(x1, y1, x2, y2);
    }
  }
};

new p5(circleSketch);






// working code 

// function draw() {
//     // background(200)
//     clear();
//     translate(width / 2, height / 2)
//     // Draw three overlapping circles
//         drawCircle(0, 0, baseRadius, true, true);  // Circle with dents
//         drawCircle(0, 0, baseRadius, true, false);  // Circle with dents
//         drawCircle(0, 0, baseRadius, false, false);  // Circle without dents
  
//         angleOffset += 0.2; // Adjust for smooth animation
//       }
  
//       function drawCircle(x, y, radius, withDents, inner) {
//         push();
//         translate(x, y);
//         let angleStep = TWO_PI / points;
  
//         // beginShape();
//         // for (let i = 0; i < TWO_PI; i += angleStep) {
//         //   let r = radius;
//         //   if (withDents) {
//         //     let offset;
//         //     if (inner) {
//         //       offset = map(sin(i * 2 + angleOffset), -1, 0.7, -200, 200);
//         //     }
//         //     offset = map(sin(i * 4 + angleOffset), -1, 1, -2, 2); // Sine wave for smooth curves
//         //     r = radius + offset + (Number(inner) * 4); // Add offset to radius for "dent" effect
//         //   }
//         //   let x = r * cos(i);
//         //   let y = r * sin(i);
//         //   vertex(x, y);
//         // }
//         // endShape(CLOSE);
  
//         drawGradientOutline(radius, withDents, inner);
//         pop();
//       }
  
//       function drawGradientOutline(radius, withDents, inner) {
//         let c1 = color(255, 0, 150); // Start color
//         let c2 = color(0, 150, 255); // End color
//         let angleStep = TWO_PI / points;
  
//         for (let i = 0; i < TWO_PI; i += angleStep) {
//           let r1 = radius;
//           let r2 = radius;
  
//           if (withDents) {
//             let offset1, offset2;
//              if (inner) {
//               offset1 = map(sin(i * 5 + angleOffset), -1, 1, -5, 5);
//               r1 = radius + offset1 + (Number(inner) * 5);
//               offset2 = map(sin((i + angleStep) * 5 + angleOffset), -1, 1, -5, 5);
//               r2 = radius + offset2 + (Number(inner) * 5);
//             } else {
//               offset1 = map(sin(i * 4 + angleOffset), -1, 1, -2, 2);
//               r1 = radius + offset1 + 5;
//               offset2 = map(sin((i + angleStep) * 4 + angleOffset), -1, 1, -2, 2);
//               r2 = radius + offset2 + 5;
//             }
            
//           }
  
//           let x1 = r1 * cos(i);
//           let y1 = r1 * sin(i);
//           let x2 = r2 * cos(i + angleStep);
//           let y2 = r2 * sin(i + angleStep);
  
//           let inter = map(i, 0, TWO_PI, 0, 1);
//           let c = lerpColor(c1, c2, inter);
//           stroke(c);
//           strokeWeight(2);
//           line(x1, y1, x2, y2);
//         }
//       }