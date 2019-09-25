<template>
	<tr>
		<td>
			<div>{{ label }}</div>
			<div class="grey--text darken-1">{{ desc }}</div>
		</td>
		<td>{{ format(amount) }}</td>
	</tr>
</template>
<script>
export default {
	name: "invoice-row",
	props: {
		label: String,
		desc: String,
		amount: Number
	}
}
</script>

<style>

</style>