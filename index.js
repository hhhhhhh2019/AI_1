function in_array(arr, v) {
	for (let i of arr) {
		if (i == v) return true;
	}

	return false;
}


function f(x) {
	return 1 / (1 + Math.E ** -x);
}


class Neuron {
	constructor(v, w) {
		this.value = v;
		this.weights = w;
	}
}


class Lay {
	constructor(nc, v, w) {
		this.neurons = []

		for (let i = 0; i < nc; i++) {
			this.neurons.push(new Neuron(v[i], w[i]));
		}
	}

	count(lay) {
		for (let i = 0; i < this.neurons.length; i++) {
			let v = 0;
			for (let n of lay.neurons) {
				v += f(n.value);
				v *= n.weights[i];
			}
			this.neurons[i].value = v;
		}
	}
}


var cnv = document.getElementById('cnv');
var ctx = cnv.getContext('2d');


class Bird {
	constructor(parent) {
		this.count = 0;

		this.dy = 0;
		this.y = 150;

		this.w1 = [];

		if (parent) {
			for (let w of parent.w1) {
				let a = []
				for (let i of w) {
					a.push(i + (Math.random() - 0.5));
				}
				this.w1.push(a);
			}
		}
		else {
			this.w1.push([Math.random() * 2, Math.random() * 2], [Math.random() * 2, Math.random() * 2]);
		}

		this.w2 = [];

		if (parent) {
			for (let w of parent.w2) {
				let a = []
				for (let i of w) {
					a.push(i + (Math.random() - 0.5));
				}
				this.w2.push(a);
			}
		}
		else {
			this.w2.push([Math.random() * 2], [Math.random() * 2]);
		}
	}

	think(p) {
		let is_up = this.y <= p.h ? 1 : 0;
		let is_down = this.y + 10 >= p.h + 49 ? 1 : 0;

		let l1 = new Lay(2, [is_up, is_down], this.w1);
		let l2 = new Lay(2, [0, 0], this.w2);
		let l3 = new Lay(1, [0], [0]);

		l2.count(l1);
		l3.count(l2);

		//console.log(l3.neurons[0].value);

		if (l3.neurons[0].value > 1.2) this.up();
	}

	up() {
		this.dy -= 1.5 + this.dy;
	}

	move() {
		this.y += this.dy;
	}

	draw() {
		ctx.fillStyle = 'yellow';
		ctx.fillRect(20, this.y, 10, 10);
	}

	collision(p) {
		if (25 >= p.x && 30 <= p.x + 30) {
			if (this.y >= p.h && this.y + 10 <= p.h + 51) {}
				else {return true;}
		}

		return false;
	}
}


class Pipe {
	constructor(h) {
		this.h = h;
		this.x = 330;
	}

	draw() {
		ctx.fillStyle = 'red';
		ctx.fillRect(this.x, 0, 30, 300);

		ctx.fillStyle = 'gray';
		ctx.fillRect(this.x, this.h, 30, 50);	
	}

	move() {
		this.x -= 1;
		if (this.x < -35) {this.x = 320; this.h = Math.floor(Math.random() * 260);}
	}
}


birds = []

for (let i = 0; i < 50; i++) {
	birds.push(new Bird());
}

dead_birds = [];

var pipe = new Pipe(Math.floor(Math.random() * 260))

run = true;
draw = true;

frames = 0;

speed = 0;

function respawn_birds(bb) {
	for (let i = 0; i < 50; i++) {
		if (bb)
			birds[i] = new Bird(bb[Math.floor(Math.random() * bb.length)]);
		else
			birds[i] = new Bird();
		birds[i].dy = 0;
	}
}

function update() {
	ctx.clearRect(0, 0, 200, 300);

	pipe.move();
	if (draw)
		pipe.draw();

	for (let i = 0; i < birds.length; i++) {
		let b = birds[i];
		b.dy += 0.1;
		//if (frames % 40 == 0) b.up();
		b.think(pipe);
		b.move();
		if (draw)
			b.draw();
		if (b.y <= 0 || b.y >= 290 || b.collision(pipe)) {dead_birds.push(b); birds.splice(i, 1);}

		//if (pipe.x <= -34) 
			b.count++; 
	}

	if (birds.length == 0) {run = false;};

	frames++;
}


function engine() {
	update();
	if (run) setTimeout(engine, speed);
	else reload()
}


function start() {
	run = true;
	frames = 0;
	engine();
}

respawn_birds();
start();

function reload() {
	let best_birds = [dead_birds[0], dead_birds[1], dead_birds[2], dead_birds[3], dead_birds[4], dead_birds[5]]

	for (let b of dead_birds) {
		for (let i = 0; i < best_birds.length; i++) {
			best_birds[i] = b.count > best_birds[i].count ? b : best_birds[i]
		}
		//console.log(b);
	}

	for (let i of best_birds) {
		for (let j of best_birds) {
			if (j != i) {
				for (let w = 0; w < i.w1.length; w++) {
					j.w1[w][0] = (j.w1[w][0] + i.w1[w][0]) / 2;
					j.w1[w][1] = (j.w1[w][1] + i.w1[w][1]) / 2;
				}
			}
		}
	}

	//console.log(best_birds);

	pipe = new Pipe(Math.floor(Math.random() * 260));

	respawn_birds(best_birds);
	start();
}