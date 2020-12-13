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
			let val = 0;
			if (v) val = v[i];
			this.neurons.push(new Neuron(val, w[i]));
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



class NeuralNetwork {
	constructor(cl, nc, w) {
		this.lays = []
		this.lays.push(new Lay(nc[0], null, w[0]));
		for (let i = 1; i < cl - 1; i++) {
			this.lays.push(new Lay(nc[i], null, w[i]));
		}
		this.lays.push(new Lay(nc[nc.length-1], null, w[w.length-1]));
	}

	set_weights(w) {
		for (let i = 0; i < this.lays.length; i++) {
			this.lays[i] = new Lay(this.lays[i].neurons.length, null, w[i]);
		}
	}

	run(id) {
		let w = []
		for (let i of this.lays[0].neurons) {
			w.push(i.weights);
		}
		this.lays[0] = new Lay(this.lays[0].neurons.length, id, w);

		var last_lay = this.lays[0];
		for (let l = 1; l < this.lays.length; l++) {
			this.lays[l].count(last_lay);
			last_lay = this.lays[l];
		}

		let res = []
		for (let n of last_lay.neurons) {
			res.push(n.value);
		}

		return res;
	}
}