//Point 2D contstuctor
const Point2D = function (x, y) {
  this.x = x;
  this.y = y;
};

//Point 3D constructor
const Point3D = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

//Cube Constructor that sets 8 points and faces for the cube to be drawn
const Cube = function (x, y, z, size) {
  Point3D.call(this, x, y, z);
  size *= 0.5;

  this.vertices = [
    new Point3D(x - size, y - size, z - size),
    new Point3D(x + size, y - size, z - size),
    new Point3D(x + size, y + size, z - size),
    new Point3D(x - size, y + size, z - size),
    new Point3D(x - size, y - size, z + size),
    new Point3D(x + size, y - size, z + size),
    new Point3D(x + size, y + size, z + size),
    new Point3D(x - size, y + size, z + size),
  ];

  this.faces = [
    [0, 1, 2, 3],
    [0, 4, 5, 1],
    [1, 5, 6, 2],
    [3, 2, 6, 7],
    [0, 3, 7, 4],
    [4, 7, 6, 5],
  ];
};

//Applies Cube Rotation about X and Y axis
Cube.prototype = {
  rotateX: function (radian) {
    var cosine = Math.cos(radian);
    var sine = Math.sin(radian);

    for (i = 0; i < this.vertices.length; i++) {
      let point = this.vertices[i];

      let y = (point.y - this.y) * cosine - (point.z - this.z) * sine;
      let z = (point.y - this.y) * sine + (point.z - this.z) * cosine;

      point.y = y + this.y;
      point.z = z + this.z;
    }
  },

  rotateY: function (radian) {
    var cosine = Math.cos(radian);
    var sine = Math.sin(radian);

    for (i = 0; i < this.vertices.length; i++) {
      let point = this.vertices[i];

      let x = (point.z - this.z) * sine + (point.x - this.x) * cosine;
      let z = (point.z - this.z) * cosine - (point.x - this.x) * sine;

      point.x = x + this.x;
      point.z = z + this.z;
    }
  },
};

//HTML media queries and canvas setters
var context = document.querySelector("canvas").getContext("2d");
var cube = new Cube(0, 0, 400, 250);
var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;
var ySlider = document.getElementById("yRotation");
var xSlider = document.getElementById("xRotation");

//Projects Cube to 3D space onto the canvas with adjustable focal length
function projectCube(verts3D, width, height) {
  var verts2D = new Array(verts3D.length);
  var focalLength = 200;

  for (i = 0; i < verts3D.length; i++) {
    let verts = verts3D[i];
    let x = verts.x * (focalLength / verts.z) + width * 0.5;
    let y = verts.y * (focalLength / verts.z) + height * 0.5;

    verts2D[i] = new Point2D(x, y);
  }

  return verts2D;
}

//Draws Cube and applies rotation based on slider values on the page.
//Allowing the user to apply cube roation at varying speeds. Preforms math calcuations
//to see which faces need to drawn in front for the canvas to see.
function animationLoop() {
  window.requestAnimationFrame(animationLoop);

  //Canvas height and width setters
  height = document.documentElement.clientHeight;
  width = document.documentElement.clientWidth;

  //Set canvas height and width
  context.canvas.height = height;
  context.canvas.width = width;

  //Fill canvas background color
  context.fillStyle = "#222831";
  context.fillRect(0, 0, width, height);

  //Cube outline color
  context.strokeStyle = "#ffffff";

  //Cube Rotation slider values getter
  cube.rotateY(ySlider.value * 0.001);
  cube.rotateX(xSlider.value * 0.001);

  //Cube faces color
  context.fillStyle = "#00ADB5";

  //Project cube and check which faces are in front
  var verts = projectCube(cube.vertices, width, height);

  for (i = 0; i < cube.faces.length; i++) {
    let face = cube.faces[i];

    //Check which faces are in front
    let point1 = cube.vertices[face[0]];
    let point2 = cube.vertices[face[1]];
    let point3 = cube.vertices[face[2]];

    let vert1 = new Point3D(
      point2.x - point1.x,
      point2.y - point1.y,
      point2.z - point1.z
    );
    let vert2 = new Point3D(
      point3.x - point1.x,
      point3.y - point1.y,
      point3.z - point1.z
    );
    let n = new Point3D(
      vert1.y * vert2.z - vert1.z * vert2.y,
      vert1.z * vert2.x - vert1.x * vert2.z,
      vert1.x * vert2.y - vert1.y * vert2.x
    );

    //Draw lines and fill faces
    if (-point1.x * n.x + -point1.y * n.y + -point1.z * n.z <= 0) {
      context.beginPath();
      for (j = 0; j <= 3; j++) {
        if (j == 0) {
          context.moveTo(verts[face[j]].x, verts[face[j]].y);
        }
        context.lineTo(verts[face[j]].x, verts[face[j]].y);
      }
      context.closePath();
      context.fill();
      context.stroke();
    }
  }
}

//Animate Cube
animationLoop();
