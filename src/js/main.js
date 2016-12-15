import m from 'mithril';
import button from 'polythene/button/button';

import card from 'polythene/card/card';
import slider from 'polythene/slider/slider';
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

function GET(url){
	return m.request({method: "GET", url: endpoint+url});
}

function POST(url, data){
	return m.request({method: "POST", url: endpoint+url, data: data});
}

POST("/handshake").then(model.handshake);
GET("/indicators").then(model.indicators);

const app = {
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

	view:(ctrl) => {
		return m('div', {class:"page"}, model.indicators().map((indicator)=>{
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
										ctrl.update(indicator.id, v);
									}
								}
							})
						]
					}
				}]
			});
		}));
	}
};

m.mount(document.getElementById("app"), app);
