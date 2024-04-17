<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
    import { enhance } from '$app/forms';

	export let data;
	
</script>

<main>
	<div>
		<form action="/login?/logout" method="post">
			<button type="submit" class="btn variant-ghost-primary">Logga ut</button>
		</form>
	</div>
	<a href="/admin-panel" class="btn">Admin</a>
	<div class="mainContainer flex flex-col justify-center">
		<div>
			<h1 class="h1">Föreslå Tjänst</h1>
			<p class="p">För att föreslå en tjänst, vänligen fyll i formuläret nedan.</p>
			<form action="?/createOrderRecomendation" method="post" class="flex flex-col gap-5">
				<div>
					<label for="titel">Tittel</label>
					<input type="text" name="titel" class="input p-2">
				</div>
				<div>
					<label for="desc">Beskrivning</label>
					<input type="text" name="desc" class="input p-2">
				</div>
				<button type="submit" class="btn variant-ghost-primary">Skicka</button>
			</form>
			{#each data.orders as order}
				<div class="order">
					<h2>{order.titel}</h2>
					<p>{order.description}</p>
					<p>{order.totalVotes} röster</p>
					<p>Har röstat: {order.hasVoted}</p>
					<form action="?/voteOrder" method="post">
						<input type="hidden" name="id" value="{order.id}">
						<button type="submit" class="btn-icon variant-ghost-primary"><i class="{order.hasVoted ? "fa-regular" : "fa-light"} fa-circle-heart fa-xl"></i></button>
					</form>
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
	form {
		display: flex;
		flex-direction: column;
		max-width: 20%;
	}
</style>
