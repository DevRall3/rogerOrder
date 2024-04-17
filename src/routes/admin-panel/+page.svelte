<script lang="ts">
  import { popup } from "@skeletonlabs/skeleton";
  import type { PopupSettings } from "@skeletonlabs/skeleton";

  import type { PageData } from "./$types";
  export let data: PageData;

  const popupHover: PopupSettings = {
    event: "hover",
    target: "popupHover",
    placement: "top",
  };
</script>

<main>
  <h1 class="h1">Admin Panel</h1>

  <div class="flex justify-center">
    <div>
      <h2 class="h2">Icket Godkända Förslag</h2>
      <div
        class="unApprovedOrders bg-surface-500 w-[400px] flex flex-col items-center p-[25px] rounded-2xl"
      >
        {#if data.unApprovedOrders.length === 0}
          <h3 class="h3">Inga icke godkända förslag för tillfället.</h3>
        {:else}
          {#each data.unApprovedOrders as order}
            <div class="order flex flex-col gap-2">
              <h2 class="h2">{order.title}</h2>
              <p>Beskrivning: {order.description}</p>
              <p>Totalt Antal Röster: {order.totalVotes}</p>
              <form action="?/approveTask" method="post" class="w-full">
                <input type="hidden" name="orderId" value={order.id} />
                <button type="submit" class="btn variant-ghost-primary w-full"
                  >Godkänn Förslaget</button
                >
              </form>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    <div>
      <h2 class="h2">Godkända Förslag</h2>
      <div
        class="bg-surface-500 w-[400px] flex flex-col items-center p-[25px] rounded-2xl"
      >
        {#if data.approvedOrders.length === 0}
          <h3 class="h3">Inga godkända förslag för tillfället.</h3>
        {:else}
          {#each data.approvedOrders as order}
            <div class="order">
              <h2 class="h2">{order.title}</h2>
              <p>Beskrivning: {order.description}</p>
              <p>Totalt Antal Röster: {order.totalVotes}</p>
              <p>Admin Röster: {order.adminVotes}</p>
              <form
                action="?/adminVotes"
                method="post"
                class="flex flex-col gap-2"
              >
                <label for="adminVotes"
                  >Lägg till admin röster: <input
                    type="number"
                    name="adminVotes"
                    id="adminVotes"
                    class="input p-2 w-[200px]"
                    min={-order.adminVotes}
                    value="0"
                  /></label
                >
                <input type="hidden" name="orderId" value={order.id} />
                <div class="flex justify-between">
                  <button class="btn variant-ghost-primary" type="submit"
                    >Verkställ Antal Röster</button
                  >
                  <form action="?/resetAdminVotes" method="post">
                    <input type="hidden" name="orderId" value={order.id} />
                    <button
                      name="resetAdminVotes"
                      type="submit"
                      class="btn-icon variant-ghost-primary"
                    >
                      <span
                        ><i class="fa-solid fa-rotate-right fa-flip-horizontal"
                        ></i></span
                      >
                    </button>
                  </form>
                </div>
              </form>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</main>
