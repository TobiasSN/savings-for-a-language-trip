<template>
	<v-app dark>
		<v-content>
			<v-container>
				<v-layout justify-center>
					<v-card>
						<v-card-text>
							<!-- Trip options -->
							<div>
								<v-select :items="countryNames" v-model="countryName">
									<template v-slot:label>
										Country
									</template>
								</v-select>
									<v-container col-12 col-sm-4 d-inline-block v-if="hasHotel">
										<v-radio-group v-model="atHotel">
											<v-radio label="Host family or dormitory" :value="false"></v-radio>
											<v-radio label="Hotel" :value="true"></v-radio>
										</v-radio-group>
									</v-container>
									<v-container :col-sm-8="hasHotel" :col-sm-12="!hasHotel" d-inline-block>
										<v-slider
											min="2"
											max="4"
											ticks="always"
											:tick-labels="weekOptions"
											v-model="weeks"
										>
											<template v-slot:label>
												Weeks
											</template>
										</v-slider>
									</v-container>
								<v-checkbox
									:label="`Do you want a ${country.extraOption.name} while there? (${country.extraOption.price} ${country.extraOption.currency})`"
									v-model="extraOption"
								>
								</v-checkbox>
							</div>
							<!-- Invoice -->
							<div>
								<v-simple-table>
									<caption>Invoice</caption>
									<thead>
										<tr>
											<th>Item</th>
											<th>Price</th>
										</tr>
									</thead>
									<tbody>
										<invoice-row
											v-for="item in invoiceItems"
											:key="item.id"
											:label="item.name"
											:desc="item.desc"
											:amount="item.price"
										></invoice-row>
										<invoice-row
											class="font-weight-bold"
											label="Total"
											:amount="total"
										></invoice-row>
										<invoice-row
											class="font-weight-bold"
											label="You need to pay"
											desc="Half of total"
											:amount="needToPay"
										></invoice-row>
									</tbody>
								</v-simple-table>
							</div>
							<div>
								<p>
									<h2 class="display-2">Results</h2>
								</p>
								<v-simple-table>
									<caption>Job schedule</caption>
									<thead>
										<tr>
											<th>Weekday</th>
											<th>Where</th>
										</tr>
									</thead>
									<tr v-for="i in 7" :key="'weekday-' + i">
										<td>{{ weekdays[i - 1] }}</td>
										<td>{{ firstUpper(jobDays[i - 1] ? jobDays[i - 1] : "Day off") }}</td>
									</tr>
								</v-simple-table>
								<p>
									You'll need to work <b>{{ avgDailyHours.toFixed(2) }}</b> hours a day on average, except when you have a day off.
								</p>
								<p>
									This will earn you <b>{{ format(avgPayPerHour) }}</b> per hour on average (Taking into account labor market contributions).
								</p>
								<p>
									That means you'll earn <b>{{ format(avgPayPerWeek) }}</b> on average per week.
								</p>
								<p>
									This way, you'll earn <b>{{ format(totalPay) }}</b> during the school year after interest.
								</p>
							</div>
						</v-card-text>
					</v-card>
				</v-layout>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import data from "./assets/data.json"

export default {
	name: 'app',
	data() {
		return {
			...data,
			countryNames: Object.keys(data.countries),
			weekOptions: [2, 3, 4],
			countryName: "England",
			atHotel: false,
			weeks: 2,
			extraOption: false,
			maxHours: 3,
			weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			workWeeks: {
				beforeNewYear: 20,
				afterNewYear: 26
			}
		}
	},
	computed: {
		country() {
			return data.countries[this.countryName];
		},
		hasHotel() {
			return !!this.country && !!this.country.hotel;
		},
		invoiceItems() {
			let items = [
				this.hasHotel && this.atHotel ? {
					id: "stay",
					name: `${this.weeks} weeks at a hotel`,
					price: this.country.hotel[this.weeks]
				} : {
					id: "stay",
					name: `${this.weeks} weeks at a host family or in a dormitory`,
					price: this.country.prices[this.weeks]
				},
				{
					id: "ticket",
					name: "Plane ticket",
					price: this.country.ticket
				}
			];
			if (this.extraOption) {
				let { name, price, currency, rate } = this.country.extraOption
				let converted = price * rate / 100
				items.push({
					id: "extraOption",
					name: this.firstUpper(name),
					desc: `${price} ${currency}`,
					price: converted
				});
				console.log(items);
			}
			items.push(
				{
					id: "insurance",
					name: "Insurance",
					price: 800
				},
				{
					id: "pocketMoney",
					name: "Pocket money",
					desc: `500 kr. a week`,
					price: 500 * this.weeks
				}
			);
			return items;
		},
		total() {
			return this.invoiceItems.reduce((a, item) => {
				console.log({a, item});
				return a + item.price;
			}, 0);
		},
		needToPay() {
			return this.total / 2;
		},
		jobDays() {
			let jobDays = []

			Object.keys(this.jobs).forEach(name => {
				this.jobs[name].weekdays.forEach(weekday => {
					jobDays[weekday] = name;
				});
			});

			return jobDays;
		},
		workDaysPerWeek() {
			return this.jobDays.filter(v => !!v).length
		},
		avgDailyHours() {
			return this.needToPay / 46 / this.workDaysPerWeek / this.avgPayPerHourAfterInterest
		},
		avgPayPerHour() {
			return this.jobDays.reduce((a, name) => a + this.jobs[name].pay, 0) / this.jobDays.length * 0.92 ;
		},
		avgPayPerHourAfterInterest() {
			return this.avgPayPerHour * 20 / 46 * 1.05 + this.avgPayPerHour * 26 / 46
		},
		avgPayPerWeek() {
			return this.avgPayPerHour * this.avgDailyHours * this.workDaysPerWeek
		},
		totalPay() {
			return this.avgPayPerHourAfterInterest * this.avgDailyHours * this.workDaysPerWeek * 46
		}
	},
	methods: {
		firstUpper(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
	},
	created() {
		// Make it dark.
		this.$vuetify.theme.dark = true;
	}
};
</script>
