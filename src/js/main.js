import m from 'mithril';


import card from 'polythene/card/card';
import slider from 'polythene/slider/slider';
import textfield from 'polythene/textfield/textfield';
import button from 'polythene/button/button';

import headerPanel from 'polythene/header-panel/header-panel';


import 'polythene/theme/theme';

var model = {};
model.meetlatten = m.prop([
	{
		title: "Mate waarop in invloed heb op de samenstelling van mijn team",
		score: 5
	},
	{
		title: "Mate waarin ik mij prettig voel binnen mijn team",
		score: 5
	}
]);

var model = {
	indicators: m.prop([]),
	handshake: m.prop({
		identity_id: "",
		session_id: ""
	})
};
var endpoint = "http://localhost:8080/api";

function xhrConfig(xhr) {
	xhr.setRequestHeader("Content-Type", "application/json");
}

function GET(url){
	return m.request({method: "GET", url: endpoint+url});
}

function POST(url, data){
	return m.request({method: "POST", url: endpoint+url, data: data});
}

POST("/handshake").then(model.handshake);
GET("/indicators").then(model.indicators);

window.setInterval(function () {
	GET("/indicators").then(model.indicators);
}, 2000);


const app = {
	controller:() => {
	},

	view:(ctrl) => {
		return m('div', {class:"page"}, [
			m.component(add_card),
			m('div', model.indicators().map((indicator)=>{
				return m.component(indicator_card, indicator);
			}))
		]);
	}
};

const add_card = {
	controller: () => {
		var title = "";
		return {
			get: () => {
				return title;
			},
			set: (t) => {
				title = t;
			},
			send: () => {
				console.log(title);
				POST("/indicator", {
					title: title
				}).then(()=> {
					title = "";
					GET("/indicators").then(model.indicators);
				});
			}
		};
	},
	view: (ctrl) => {
		return m.component(card, {
			content: [{
				text: {
					content: [
						m.component(textfield, {
							label: 'Nieuwe Meetlat',
							floatingLabel: true,
							help: 'Voer de omschrijing van je nieuwe meetlat in',
							events: {
								oninput: () => {}, // only update on blur
								onchange: (e) => {ctrl.set(e.target.value);}
							},
							value: () => (ctrl.get())
						}),
						m.component(button, {
							label: 'Inzenden',
							raised: true,
							events: {
								onclick: () => {ctrl.send()}
							}
						})
					]
				}
			}]
		});
	}
};

const indicator_card = {
	controller:() => {
		return {
			update: (id,score) => {
				POST("/score", {
					indicator_id: id,
					session_id: model.handshake().session_id,
					score: score
				});
			}
		};
	},

	view:(ctrl, indicator) => {
		if(!indicator.score){
			indicator.score = 5;
		}
		return m.component(card, {
			content: [{
				text: {
					content: [
						m("div", {class: "omschrijving"}, indicator.title),
						m.component(slider, {
							min: 0,
							max: 10,
							value: indicator.score,
							step: 1,
							ticks: true,
							pin: true,
							getValue: (v) => {
								if(v !== indicator.score){
									indicator.score = v;
									ctrl.update(indicator.id, v);
								}
							}
						})
					]
				}
			}]
		});
	}
};

m.mount(document.getElementById("app"), app);
