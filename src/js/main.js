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

const app = {};
app.view = function() {
	return m('div', {class:"page"}, model.meetlatten().map((meetlat)=>{
		return m.component(card, {
			content: [{
				text: {
					content: [
						m("div", {class: "omschrijving"}, meetlat.title),
						m.component(slider, {
							min: 0,
							max: 10,
							value: meetlat.score,
							step: 1,
							ticks: true,
							pin: true
						})
					]
				}
			}]
		});
	}));
};

m.mount(document.getElementById("app"), app);
