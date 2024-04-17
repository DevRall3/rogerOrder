<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    
    export let form: ActionData;
    // export let data: PageData;
</script>
<div class="register-container">
    <div class="register-div">
        <h1>Register account</h1>
        <form action="?/register" method="post" use:enhance class="flex flex-col gap-2">
            <label for="email">E-mail: <input type="email" name="email" class="input p-2"></label>
            <label for="fullName">Namn: <input type="text" name="fullName" class="input p-2"></label>
            <label for="gender">Kön: <select name="gender" id="gender" class="select p-2"><option value="male">Man</option><option value="woman">Kvinna</option><option value="other">Annat</option></select></label>
            <label for="age">Ålder: <select name="age" id="age" class="select p-2"><option value="0-35">0-35</option><option value="36-55">36-55</option><option value="56+">56+</option></select></label>
            <label for="password">Lösenord: <input type="password" name="password" class="input p-2"></label>
            <label for="password-repeat">Repitera Lösenord: <input type="password" name="password-repeat" class="input p-2"></label>
            <button class="main-btn"><span class="text">Registrera</span></button>
            {#if form?.msg}
                <span style="color: red;">{form.msg}</span>
            {/if}
        </form>
        <span>Already have an account? </span><a href="/login">Log in here</a>
    </div>
</div>

<style>
    .register-div {
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        justify-content: center;
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        gap: 10px;
    }
</style>