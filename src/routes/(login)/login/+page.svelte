<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types.js";

    export let form: ActionData;
    // export let data;
</script>

<!-- Enhance enhancear formuläret -->
<body>
    <div class="login-container flex flex-col h-[100vh] w-[100%]">
        <div class="login-div flex flex-col m-auto w-[40%] gap-5 bg-surface-500 p-[25px] rounded-2xl">
            <h1>Login</h1>
            <form method="post" action="?/login" use:enhance>
                <label>Email: <input type="email" name="email" class="input p-2" /></label>
                <label
                    >Password: <input type="password" name="password" class="input p-2" /></label
                >

                <button class="main-btn"
                    ><span class="text">Log In</span></button
                >
                {#if form?.userName}
                    <span style="color: red;">{form.userName}</span>
                {/if}
            </form>
            
            <div>
                <span>Don't have an account? </span>
                <a href="/register" class="link"
                    >Register here!</a
                >
            </div>
        </div>
    </div>
</body>