var canvas, gl;
var numVertices = 36;
var points = [];
var colors = [];

var vertices = [
  [-0.5, -0.5, 0.5],
  [-0.5, 0.5, 0.5],
  [0.5, 0.5, 0.5],
  [0.5, -0.5, 0.5],
  [-0.5, -0.5, -0.5],
  [-0.5, 0.5, -0.5],
  [0.5, 0.5, -0.5],
  [0.5, -0.5, -0.5],
];

var vertexColors = [
  [0.0, 0.0, 0.0, 1.0], // black
  [1.0, 0.0, 0.0, 1.0], // red
  [1.0, 1.0, 0.0, 1.0], // yellow
  [0.0, 1.0, 0.0, 1.0], // green
  [0.0, 0.0, 1.0, 1.0], // blue
  [1.0, 0.0, 1.0, 1.0], // magenta
  [0.0, 1.0, 1.0, 1.0], // cyan
  [1.0, 1.0, 1.0, 1.0], // white
];

function quad(a, b, c, d) {
  var indices = [a, b, c, a, c, d];
  for (var i = 0; i < indices.length; ++i) {
    points.push(...vertices[indices[i]]);
    colors.push(...vertexColors[indices[i]]);
  }
}

function colorCube() {
  quad(0, 3, 2, 1);
  quad(2, 3, 7, 6);
  quad(0, 4, 7, 3);
  quad(1, 2, 6, 5);
  quad(4, 5, 6, 7);
  quad(0, 1, 5, 4);
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

window.onload = function init() {
  canvas = document.getElementById("canvas");
  gl = canvas.getContext("webgl");

  if (!gl) {
    throw new Error("WebGL not supported!");
  }

  colorCube();
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  //  Load shaders and initialize attribute buffers

  var program = createProgram(
    gl,
    createShader(
      gl,
      gl.VERTEX_SHADER,
      document.getElementById("vertex-shader-3d").innerText
    ),
    createShader(
      gl,
      gl.FRAGMENT_SHADER,
      document.getElementById("fragment-shader-3d").innerText
    )
  );

  gl.useProgram(program);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  const colorAttribLocation = gl.getAttribLocation(program, "a_color");

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(colorAttribLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  size = 4;
  gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 36);
};
