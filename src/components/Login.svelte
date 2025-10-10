<script>
    import {onMount} from 'svelte';

    let {onlogin, theme} = $props();

    let username = $state('');
    let password = $state('');
    let mode = $state('signin'); // 'signin' | 'signup'
    let loading = $state(false);
    let error = $state('');
    let success = $state('');

    let usernameInput;

    async function submit(e) {
        e?.preventDefault()
        if (loading) return // prevent double submit issues
        error = ''
        success = ''
        if (!username || !password) {
            error = 'Username and password are required'
            usernameInput?.focus()
            return
        }
        loading = true
        try {
            const endpoint = mode === 'signup' ? '/register' : '/login'
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            })
            const data = await res.json()
            if (!res.ok) {
                error = data?.message || (mode === 'signup' ? 'Sign up failed' : 'Login failed')
                // focus on redoing username
                usernameInput?.focus()
            } else {
                // success
                onlogin(data)
                success = mode === 'signup' ? 'Account created. Signed in.' : 'Signed in successfully'
                // hide success message after 1.5s
                setTimeout(() => success = '', 1500)
            }
        } catch (err) {
            error = 'Network error'
        } finally {
            loading = false
        }
    }

    function toggleMode() {
        if (loading) return
        mode = mode === 'signin' ? 'signup' : 'signin'
        error = ''
        success = ''
        // keep username value; clear password for safety
        password = ''
        // refocus username field for quick typing
        setTimeout(() => usernameInput?.focus(), 0)
    }

    onMount(() => usernameInput?.focus());
</script>

<form onsubmit={submit} aria-live="polite"
      class="{theme === 'light' ? 'bg-gray-100 text-black' : theme === 'high-contrast' ? 'bg-black text-white border-2 border-white' : 'bg-gray-900 text-white'} shadow-md rounded px-8 pt-6 pb-8">
    <h2 class="text-lg font-bold mb-4">{mode === 'signup' ? 'Create account' : 'Sign in'}</h2>
    <div class="mb-4">
        <label for="username">Username</label>
        <input id="username"
               class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
               bind:this={usernameInput} bind:value={username} autocomplete="username" disabled={loading}
               placeholder="Username">
    </div>

    <div class="mb-4">
        <label for="password">Password</label>
        <input id="password"
               class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
               type="password"
               bind:value={password} autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
               disabled={loading} placeholder="Password">
    </div>

    {#if error}
        <div role="alert" style="color:crimson">{error}</div>
    {/if}
    {#if success}
        <div role="status" style="color:green">{success}</div>
    {/if}

    <button type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}>{loading ? (mode === 'signup' ? 'Creating...' : 'Signing in...') : (mode === 'signup' ? 'Create account' : 'Sign in')}</button>

    <div class="mt-3 text-sm">
        {#if mode === 'signin'}
            <span>Don't have an account?</span>
            <button type="button" class="text-blue-600 hover:underline ml-1" onclick={toggleMode} disabled={loading}>
                Create one
            </button>
        {:else}
            <span>Already have an account?</span>
            <button type="button" class="text-blue-600 hover:underline ml-1" onclick={toggleMode} disabled={loading}>
                Sign in
            </button>
        {/if}
    </div>
</form>


