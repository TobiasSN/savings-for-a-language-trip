import Vue from 'vue'
import app from './app.vue'
import vuetify from './plugins/vuetify';

import invoiceRow from "./components/invoice-row.vue"

Vue.config.productionTip = false

Vue.component("invoice-row", invoiceRow);

Vue.prototype.format = (n) => {
	return `${Number.parseFloat(n.toFixed(2)).toLocaleString("en")} kr.`;
}

new Vue({
	vuetify,
	render: h => h(app)
}).$mount('#app')
