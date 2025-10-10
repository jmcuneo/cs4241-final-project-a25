<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Login from './components/Login.svelte';

    // simple auth state
    let authUser = $state(null);
    let showLoginPanel = $state(false);

    // userData
    let playedGames = $state(0);
    let wonGames = $state(0);
    let streak = $state(0);

    async function setAuth(tkn, user) {
        authUser = user;
        if (tkn) {
            localStorage.setItem('jwt', tkn);
            await fetchUserData();
        } else { localStorage.removeItem('jwt'); }
    }

    async function handleLogin(evtOrData) {
        const data = evtOrData?.detail ?? evtOrData;
        if (data?.token) {
            await setAuth(data.token, data.user);
            showLoginPanel = false;
        }
    }

    function logout() {
        setAuth(null, null);
    }

    let characterMaps = $state(Array.from({length: 8}, () => ({})));
    let guesses = $state([]);
    let input = $state('');
    let announcement = $state('');

    // Track game finished state.
    let gameOver = $derived(guesses.length === 5 || gameWon);
    let gameWon = $state(false);
    $effect(async () => {
        if (gameOver) {
            await gameFinished();
        }
    })

    let showToast = $state(false);
    let toast = $state('');

    // Show toasts with a max of 4 seconds.
    let toastTimeout;
    $effect(() => {
        if (toast.length) {
            clearTimeout(toastTimeout);

            showToast = true;
            toastTimeout = setTimeout(() => { showToast = false; toast = ''; }, 4000);
        }
    });

    // Settings
    let theme = $state('dark');
    let fontSize = $state('medium');
    let spacing = $state('normal');
    let colorBlindMode = $state('none');
    let showSettingsPanel = $state(false);

    function getLetterColor(letter, position) {
        let status = '';
        if (position === "ALL") {
            status = getOverallLetterStatus(letter);
        } else {
            status = getLetterStatus(letter, position);
        }

        const colorMap = {
            dark: {
                absent: 'bg-gray-800',
                present: 'bg-yellow-600',
                correct: 'bg-green-700',
                unused: 'bg-gray-500'
            },
            light: {
                absent: 'bg-gray-400',
                present: 'bg-yellow-500',
                correct: 'bg-green-600',
                unused: 'bg-gray-300'
            },
            'high-contrast': {
                absent: 'bg-black border-2 border-white',
                present: 'bg-yellow-300 text-black',
                correct: 'bg-blue-600',
                unused: 'bg-gray-700 border-2 border-gray-400'
            }
        };

        // colorblind overrides
        if (colorBlindMode !== 'none' && status === 'correct') {
            if (colorBlindMode === 'protanopia' || colorBlindMode === 'deuteranopia') {
                return 'bg-blue-600';
            } else if (colorBlindMode === 'tritanopia') {
                return 'bg-pink-600';
            }
        }

        if (colorBlindMode !== 'none' && status === 'present') {
            if (colorBlindMode === 'protanopia') {
                return 'bg-orange-500';
            } else if (colorBlindMode === 'deuteranopia') {
                return 'bg-orange-600';
            } else if (colorBlindMode === 'tritanopia') {
                return 'bg-cyan-500 text-black';
            }
        }

        return colorMap[theme][status];
    }

    function getLetterStatus(letter, position) {
        const posMap = characterMaps[position] || {};
        const value = posMap[letter];

        if (value === -1) return 'absent';
        if (value === 0) return 'present';
        if (value === 1) return 'correct';
        return 'unused';
    }

    function getOverallLetterStatus(letter) {
        let highest = null;
        for (const map of characterMaps) {
            if (map[letter] === 1) return 'correct'; // highest priority
            if (map[letter] === 0) highest = 'present';
            if (map[letter] === -1 && !highest) highest = 'absent';
        }
        return highest || 'unused';
    }

    async function guess() {
        if (gameOver) return;
        if (input.length !== 8) {
            announcement = `Word must be 8 letters. Current word has ${input.length} letters.`;
            return;
        }

        try {
            const res = await fetch('/valid', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({word: input})
            })
            if (!res.ok) {
                const err = await res.json()
                announcement = err.error || 'Error submitting guess'
                return;
            }

            const isValid = await res.json()
            if (!isValid.feedback) {
                announcement = 'Current word is not a valid English word.';
                toast = 'Current word is not a valid English word.';
                return;
            }
        } catch {
            announcement = 'Network error while validating guess'
        }

        try {
            const res = await fetch('/guess', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({word: input})
            })

            if (!res.ok) {
                const err = await res.json()
                announcement = err.error || 'Error submitting guess'
                return;
            }

            const data = await res.json()
            const feedback = data.feedback

            input.split('').forEach((letter, i) => {
                characterMaps[i][letter] = feedback[i];
            });
            guesses.push(input);

            // Announce the guess result
            const guessNumber = guesses.length;

            if (feedback.every(x => x === 1)) {
                gameWon = true;
                announcement = `Guess ${guessNumber} was correct: ${input}.`;
                toast = `You won in ${guessNumber} guesses!`;
            } else if (guessNumber === 5) {
                announcement = 'Guess was incorrect, no more guesses remaining.';
                toast = 'Game over, no more guesses.';
            } else {
                announcement = `Guess ${guessNumber} submitted: ${input}. ${5 - guessNumber} guesses remaining.`;
            }

            input = '';
        } catch (err) {
            console.error(err)
            announcement = 'Network error while submitting guess'
        }
    }

    function inputLetter(key) {
        if (gameOver) return;
        if (input.length === 8) {
            announcement = 'Word is complete. Press Enter to submit or Backspace to edit.';
            return;
        }
        input += key;
    }

    function undoLetter() {
        if (gameOver) return;
        if (input.length > 0) {
            const removed = input[input.length - 1];
            input = input.slice(0, input.length - 1);
            announcement = `Removed letter ${removed}. ${input.length} of 8 letters entered.`;
        }
    }

    function cycleTheme() {
        const themes = ['dark', 'light', 'high-contrast'];
        const current = themes.indexOf(theme);
        theme = themes[(current + 1) % themes.length];
        announcement = `Theme changed to ${theme.replace('-', ' ')}`;
    }

    function cycleFontSize() {
        const sizes = ['small', 'medium', 'large', 'x-large'];
        const current = sizes.indexOf(fontSize);
        fontSize = sizes[(current + 1) % sizes.length];
        announcement = `Font size changed to ${fontSize}`;
    }

    function cycleSpacing() {
        const spacings = ['narrow', 'normal', 'wide'];
        const current = spacings.indexOf(spacing);
        spacing = spacings[(current + 1) % spacings.length];
        announcement = `Spacing changed to ${spacing}`;
    }

    function cycleColorBlindMode() {
        const modes = ['none', 'protanopia', 'deuteranopia', 'tritanopia'];
        const current = modes.indexOf(colorBlindMode);
        colorBlindMode = modes[(current + 1) % modes.length];
        const modeName = colorBlindMode === 'none' ? 'standard colors' : colorBlindMode;
        announcement = `Color blind mode: ${modeName}`;
    }

    let spacingClasses = $derived({
        board: spacing === 'narrow' ? 'gap-0.5 sm:gap-1 md:gap-1.5' : spacing === 'wide' ? 'gap-1.5 sm:gap-3 md:gap-4' : 'gap-1 sm:gap-2 md:gap-3',
        row: spacing === 'narrow' ? 'gap-0.5 sm:gap-1 md:gap-1.5' : spacing === 'wide' ? 'gap-1 sm:gap-2 md:gap-3' : 'gap-0.5 sm:gap-1 md:gap-2',
        keyboard: spacing === 'narrow' ? 'gap-0.5 sm:gap-1 md:gap-1.5' : spacing === 'wide' ? 'gap-1 sm:gap-2 md:gap-3' : 'gap-1 sm:gap-1.5 md:gap-2',
        keyboardRow: spacing === 'narrow' ? 'gap-0.5 sm:gap-1 md:gap-1.5' : spacing === 'wide' ? 'gap-1 sm:gap-2 md:gap-3.5' : 'gap-0.5 sm:gap-1.5 md:gap-2.5'
    });

    let fontSizeClass = $derived(fontSize === 'small' ? 'text-[10px] sm:text-sm' : fontSize === 'large' ? 'text-xs sm:text-lg' : fontSize === 'x-large' ? 'text-sm sm:text-xl' : 'text-[11px] sm:text-base');

    let themeClasses = $derived(theme === 'dark'
        ? 'bg-gray-950 text-white'
        : theme === 'light'
            ? 'bg-white text-black'
            : 'bg-black text-white');

    async function fetchUserData() {
        const stored = localStorage.getItem('jwt');
        const res = await fetch('/userData', { headers: { 'Authorization': `Bearer ${stored}` } });
        const userData = await res.json();
        if (userData) {
            playedGames = userData.playedGames;
            wonGames = userData.wonGames;
            streak = userData.currentStreak;
        }
    }

    // call this when the game is done
    async function gameFinished() {
        const stored = localStorage.getItem('jwt');

        if (stored) {
            await fetch('/UpdateUserData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${stored}` },
                body: JSON.stringify({ won: gameWon })
            })

            await fetchUserData();
        }
    }

    onMount(async () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        if (!prefersDark.matches) theme = 'light';

        // load saved settings
        const savedTheme = localStorage.getItem('wordle-theme');
        const savedFontSize = localStorage.getItem('wordle-font-size');
        const savedSpacing = localStorage.getItem('wordle-spacing');
        const savedColorBlindMode = localStorage.getItem('wordle-colorblind-mode');

        if (savedTheme) theme = savedTheme;
        if (savedFontSize) fontSize = savedFontSize;
        if (savedSpacing) spacing = savedSpacing;
        if (savedColorBlindMode) colorBlindMode = savedColorBlindMode;

        announcement = 'Wordle game started. Guess the 8-letter word. You have 5 attempts.';

        document.onkeydown = (event) => {
            // If an input/textarea/contenteditable is focused, do not intercept keys
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                return;
            }

            if (event.code === 'Backspace') {
                event.preventDefault();
                undoLetter();
            } else if (event.code === 'Enter') {
                event.preventDefault();
                guess();
            } else if (event.key.length === 1 && event.key.match(/[a-zA-Z]/) && !(event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                inputLetter(event.key.toUpperCase());
            }
        }

        // On mount, check for stored token and validate with /me
        const stored = localStorage.getItem('jwt');
        if (stored) {
            fetch('/me', {headers: {'Authorization': `Bearer ${stored}`}})
                .then(r => r.json())
                .then(d => {
                    if (d?.success && d.user) {
                        setAuth(stored, d.user)
                    } else {
                        setAuth(null, null)
                    }
                }).catch(() => setAuth(null, null))
        }
    });

    // save settings to localStorage
    $effect(() => {
        localStorage.setItem('wordle-theme', theme);
        localStorage.setItem('wordle-font-size', fontSize);
        localStorage.setItem('wordle-spacing', spacing);
        localStorage.setItem('wordle-colorblind-mode', colorBlindMode);
    });
</script>

<div class="{themeClasses} {fontSizeClass} transition-colors duration-300">
    <!-- Accessibility Toolbar -->
    <div class="fixed top-2 right-2 sm:top-4 sm:right-4 z-50" role="complementary" aria-label="Accessibility settings">
        <button
            class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 {theme === 'light' ? 'bg-white text-black border-black' : theme === 'high-contrast' ? 'bg-white text-black border-white' : 'bg-black/80 text-white border-white'} flex items-center justify-center hover:scale-110 transition-transform focus:outline-4 focus:outline-green-600"
            onclick={() => showSettingsPanel = !showSettingsPanel}
            aria-label="Toggle accessibility settings panel"
            aria-expanded={showSettingsPanel}
            title="Accessibility Settings"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="sm:w-6 sm:h-6">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m5.2-15.8l-4.2 4.2m0 5.2l-4.2 4.2m11.2-5.2l-6-6m-6 6l-6 6"></path>
            </svg>
            <span class="sr-only">Settings</span>
        </button>

        {#if showSettingsPanel}
            <div class="absolute top-12 sm:top-16 right-0 w-64 sm:w-72 {theme === 'light' ? 'bg-white border-gray-300' : theme === 'high-contrast' ? 'bg-black border-white border-4' : 'bg-gray-900 border-gray-700'} border-2 rounded-lg p-4 sm:p-6 shadow-2xl" role="dialog" aria-label="Accessibility settings">
                <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-2 {theme === 'light' ? 'border-gray-300' : 'border-gray-700'}">
                    Accessibility Settings
                </h2>

                <div class="space-y-2 sm:space-y-3">
                    <button
                        onclick={cycleTheme}
                        class="w-full flex items-center gap-3 sm:gap-4 p-2 sm:p-3 {theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 border-gray-300' : theme === 'high-contrast' ? 'bg-black border-white border-2' : 'bg-gray-800 hover:bg-gray-700 border-gray-700'} border rounded-lg transition-colors focus:outline-2 focus:outline-green-600"
                        aria-label="Change theme, currently {theme}"
                    >
                        <span class="text-xl sm:text-2xl">🎨</span>
                        <div class="flex-1 text-left">
                            <div class="font-semibold text-xs sm:text-sm">Theme</div>
                            <div class="text-xs opacity-70 capitalize">{theme.replace('-', ' ')}</div>
                        </div>
                    </button>

                    <button
                        onclick={cycleFontSize}
                        class="w-full flex items-center gap-3 sm:gap-4 p-2 sm:p-3 {theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 border-gray-300' : theme === 'high-contrast' ? 'bg-black border-white border-2' : 'bg-gray-800 hover:bg-gray-700 border-gray-700'} border rounded-lg transition-colors focus:outline-2 focus:outline-green-600"
                        aria-label="Change font size, currently {fontSize}"
                    >
                        <span class="text-xl sm:text-2xl">Aa</span>
                        <div class="flex-1 text-left">
                            <div class="font-semibold text-xs sm:text-sm">Font Size</div>
                            <div class="text-xs opacity-70 capitalize">{fontSize}</div>
                        </div>
                    </button>

                    <button
                        onclick={cycleSpacing}
                        class="w-full flex items-center gap-3 sm:gap-4 p-2 sm:p-3 {theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 border-gray-300' : theme === 'high-contrast' ? 'bg-black border-white border-2' : 'bg-gray-800 hover:bg-gray-700 border-gray-700'} border rounded-lg transition-colors focus:outline-2 focus:outline-green-600"
                        aria-label="Change spacing, currently {spacing}"
                    >
                        <span class="text-xl sm:text-2xl">↔️</span>
                        <div class="flex-1 text-left">
                            <div class="font-semibold text-xs sm:text-sm">Spacing</div>
                            <div class="text-xs opacity-70 capitalize">{spacing}</div>
                        </div>
                    </button>

                    <button
                        onclick={cycleColorBlindMode}
                        class="w-full flex items-center gap-3 sm:gap-4 p-2 sm:p-3 {theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 border-gray-300' : theme === 'high-contrast' ? 'bg-black border-white border-2' : 'bg-gray-800 hover:bg-gray-700 border-gray-700'} border rounded-lg transition-colors focus:outline-2 focus:outline-green-600"
                        aria-label="Change color blind mode, currently {colorBlindMode}"
                    >
                        <span class="text-xl sm:text-2xl">👁️</span>
                        <div class="flex-1 text-left">
                            <div class="font-semibold text-xs sm:text-sm">Color Mode</div>
                            <div class="text-xs opacity-70 capitalize">{colorBlindMode === 'none' ? 'Standard' : colorBlindMode}</div>
                        </div>
                    </button>
                </div>

                <button
                    class="w-full mt-3 sm:mt-4 p-2 sm:p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors focus:outline-2 focus:outline-white focus:outline-offset-2 text-sm sm:text-base"
                    onclick={() => showSettingsPanel = false}
                    aria-label="Close settings panel"
                >
                    Close
                </button>
            </div>
        {/if}
    </div>

    <main aria-label="Wordle game" class="max-w-3xl mx-auto min-h-screen px-1 relative sm:px-4 py-2 sm:py-8">
        <!-- Skip link for keyboard users -->
        <a href="#keyboard-section" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-black focus:text-white focus:p-3 focus:rounded focus:z-50 focus:font-bold">
            Skip to keyboard
        </a>

        <!-- Login section -->
        {#if authUser}
            <div class="mt-6 flex items-center justify-between">
                <div>
                    Signed in as <strong>{authUser.username}</strong>
                </div>
                <button class="cursor-pointer hover:underline" onclick={logout}>Logout</button>
            </div>
        {:else}
            <div class="flex justify-end px-3">
                <button class="cursor-pointer hover:underline" onclick={() => showLoginPanel = true}>Login</button>
            </div>
        {/if}

        {#if showLoginPanel }
            <div class="bg-gray-700/70 absolute flex items-center justify-center top-0 left-0 bottom-0 right-0 z-20">
                <button class="absolute text-white top-0 left-0 ms-6 py-2 sm:py-8 cursor-pointer" onclick={() => showLoginPanel = false}>&#x2715;</button>
                <Login onlogin={handleLogin} theme={theme} />
            </div>
        {/if}

        <!-- Toast messages -->
        {#if showToast}
            <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none z-10" transition:fade>
                <div class="{theme === 'high-contrast' ? 'bg-white border-2 text-black border-blue-600' : 'bg-gray-800/90'} max-w-72 text-center font-bold {fontSizeClass} px-6 py-2 shadow-md rounded">
                    {toast}
                </div>
            </div>
        {/if}

        <h1 class="text-xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-6">Octurdle</h1>

        <!-- Instructions -->
        <section aria-labelledby="instructions-heading" class="mb-2 sm:mb-8 text-center">
            <h2 id="instructions-heading" class="sr-only">Game Instructions</h2>
            <p class="mb-1 sm:mb-4 opacity-80 text-xs sm:text-base">Guess the 8-letter word in 5 tries</p>
            <div class="flex justify-center gap-1.5 sm:gap-4 flex-wrap text-[10px] sm:text-sm mb-1 sm:mb-4">
                <div class="flex items-center gap-1 sm:gap-2">
                    <span class="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 {
                        colorBlindMode === 'protanopia' || colorBlindMode === 'deuteranopia' ? 'bg-blue-600' :
                        colorBlindMode === 'tritanopia' ? 'bg-pink-600' :
                        theme === 'high-contrast' ? 'bg-blue-600 border-2 border-white' : 'bg-green-700'
                    } inline-block rounded" aria-hidden="true"></span>
                    <span>Correct position</span>
                </div>
                <div class="flex items-center gap-1 sm:gap-2">
                    <span class="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 {
                        colorBlindMode === 'protanopia' ? 'bg-orange-500' :
                        colorBlindMode === 'deuteranopia' ? 'bg-orange-600' :
                        colorBlindMode === 'tritanopia' ? 'bg-cyan-500' :
                        theme === 'high-contrast' ? 'bg-yellow-300 border-2 border-white' : 'bg-yellow-600'
                    } inline-block rounded" aria-hidden="true"></span>
                    <span>Wrong position</span>
                </div>
                <div class="flex items-center gap-1 sm:gap-2">
                    <span class="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 {theme === 'high-contrast' ? 'bg-black border-2 border-white' : theme === 'light' ? 'bg-gray-400' : 'bg-gray-800'} inline-block rounded" aria-hidden="true"></span>
                    <span>Not in word</span>
                </div>
            </div>
        </section>

        <!-- Game board -->
        <div
            class="grid grid-rows-5 {spacingClasses.board} mb-1 sm:mb-3 max-w-2xl mx-auto"
            role="region"
            aria-label="Game board"
            aria-live="polite"
            aria-atomic="false"
        >
            {#each Array(5) as _, guessIndex}
                {@const isEmpty = guessIndex > guesses.length }
                {@const isPastGuess = guessIndex < guesses.length }

                <div
                    class="grid grid-cols-8 {spacingClasses.row}"
                    role="group"
                    aria-label="Row {guessIndex + 1} of 5"
                >
                    {#each Array(8) as _, charIndex}
                        {@const letter = isPastGuess ? guesses[guessIndex][charIndex] : input[charIndex] }
                        {@const status = isPastGuess ? getLetterStatus(letter, charIndex) : 'empty'}


                        <div
                            class="aspect-square flex items-center justify-center text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold uppercase rounded relative transition-colors {isPastGuess ? getLetterColor(letter, charIndex) + ' text-white' : theme === 'high-contrast' ? 'border-4 border-white' : theme === 'light' ? 'border-2 border-gray-300' : 'border-2 border-gray-700'}"
                            role="img"
                            aria-label="{isEmpty ? 'Empty cell' : letter + (isPastGuess ? ', ' + status : ', current guess')}"
                        >
                            {isEmpty ? '' : letter}
                            {#if colorBlindMode !== 'none' && isPastGuess}
                                <span class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-xs opacity-50" aria-hidden="true">
                                    {status === 'correct' ? '✓' : status === 'present' ? '?' : status === 'absent' ? '✕' : ''}
                                </span>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>

        <!-- Current guess status -->
        <div class="text-center mb-1 sm:mb-3 opacity-80 min-h-4 sm:min-h-6 text-xs sm:text-base" aria-live="polite" aria-atomic="true">
            {#if input.length > 0}
                <span class="sr-only">Current guess: {input}, {input.length} of 8 letters</span>
                <span aria-hidden="true">Letters: {input.length}/8</span>
            {:else if guesses.length > 0}
                <span>Guesses used: {guesses.length}/5</span>
            {/if}
        </div>

        <!-- Keyboard section -->
        <section id="keyboard-section" aria-label="On-screen keyboard" class="flex flex-col {spacingClasses.keyboard} max-w-2xl mx-auto mt-auto">
            <h2 class="sr-only">Keyboard</h2>

            <div class="flex justify-center {spacingClasses.keyboardRow}">
                {#each ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'] as letter}
                    <button
                        class="min-w-10 py-2 sm:py-3 md:py-5 px-0.5 sm:px-1 md:px-2 rounded font-bold text-white relative transition-all hover:brightness-110 hover:scale-105 active:scale-95 focus:outline-4 focus:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed {getLetterColor(letter, 'ALL')} {fontSizeClass}"
                        onclick={() => inputLetter(letter)}
                        aria-label="{letter}, {getOverallLetterStatus(letter)}"
                        type="button"
                        disabled={gameOver}
                    >
                        {letter}
                        {#if colorBlindMode !== 'none'}
                            <span class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-xs opacity-50" aria-hidden="true">
                                {getOverallLetterStatus(letter) === 'correct' ? '✓' : getOverallLetterStatus(letter) === 'present' ? '?' : getOverallLetterStatus(letter) === 'absent' ? '✕' : ''}
                            </span>
                        {/if}
                    </button>
                {/each}
            </div>

            <div class="flex justify-center {spacingClasses.keyboardRow}">
                {#each ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'] as letter}
                    <button
                        class="min-w-10 py-2 sm:py-3 md:py-5 px-0.5 sm:px-1 md:px-2 rounded font-bold text-white relative transition-all hover:brightness-110 hover:scale-105 active:scale-95 focus:outline-4 focus:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed {getLetterColor(letter, 'ALL')} {fontSizeClass}"
                        onclick={() => inputLetter(letter)}
                        aria-label="{letter}, {getOverallLetterStatus(letter)}"
                        type="button"
                        disabled={gameOver}
                    >
                        {letter}
                        {#if colorBlindMode !== 'none'}
                            <span class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-xs opacity-50" aria-hidden="true">
                                {getOverallLetterStatus(letter) === 'correct' ? '✓' : getOverallLetterStatus(letter) === 'present' ? '?' : getOverallLetterStatus(letter) === 'absent' ? '✕' : ''}
                            </span>
                        {/if}
                    </button>
                {/each}
            </div>

            <div class="flex justify-center {spacingClasses.keyboardRow}">
                <button
                    class="flex-shrink-0 py-2 sm:py-3 md:py-5 px-1 sm:px-2 md:px-3 rounded font-bold {theme === 'light' ? 'bg-gray-300 text-black' : theme === 'high-contrast' ? 'bg-white text-black border-2 border-white' : 'bg-gray-600 text-white'} transition-all hover:brightness-90 focus:outline-4 focus:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] sm:text-xs md:text-sm"
                    onclick={guess}
                    aria-label="Submit guess"
                    type="button"
                    disabled={input.length !== 8 || gameOver}
                >
                    ENTER
                </button>
                {#each ['Z', 'X', 'C', 'V', 'B', 'N', 'M'] as letter}
                    <button
                        class="min-w-10 py-2 sm:py-3 md:py-5 px-0.5 sm:px-1 md:px-2 rounded font-bold text-white relative transition-all hover:brightness-110 hover:scale-105 active:scale-95 focus:outline-4 focus:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed {getLetterColor(letter, 'ALL')} {fontSizeClass}"
                        onclick={() => inputLetter(letter)}
                        aria-label="{letter}, {getOverallLetterStatus(letter)}"
                        type="button"
                        disabled={gameOver}
                    >
                        {letter}
                        {#if colorBlindMode !== 'none'}
                            <span class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-xs opacity-50" aria-hidden="true">
                                {getOverallLetterStatus(letter) === 'correct' ? '✓' : getOverallLetterStatus(letter) === 'present' ? '?' : getOverallLetterStatus(letter) === 'absent' ? '✕' : ''}
                            </span>
                        {/if}
                    </button>
                {/each}
                <button
                    class="flex-shrink-0 min-w-10 py-2 sm:py-3 md:py-5 px-1 sm:px-2 md:px-3 rounded font-bold {theme === 'light' ? 'bg-gray-300 text-black' : theme === 'high-contrast' ? 'bg-white text-black border-2 border-white' : 'bg-gray-600 text-white'} transition-all hover:brightness-90 focus:outline-4 focus:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-xl md:text-2xl"
                    onclick={undoLetter}
                    aria-label="Delete last letter"
                    type="button"
                    disabled={input.length === 0}
                >
                    ‹
                </button>
            </div>

            {#if authUser}
                <div class="flex gap-2 mt-2 justify-center">
                    <p>Played Games: {playedGames}</p>
                    <p>Won Games: {wonGames}</p>
                    <p>Current Streak: {streak}</p>
                </div>
            {/if}

            <!-- Keyboard shortcuts help -->
            <div class="text-center mt-2 sm:mt-4 text-xs sm:text-sm opacity-70">
                <details>
                    <summary class="cursor-pointer p-2 inline-block hover:opacity-100 focus:outline-2 focus:outline-green-600 focus:rounded">
                        Keyboard shortcuts
                    </summary>
                    <ul class="list-none p-0 mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                        <li>
                            <kbd class="{theme === 'light' ? 'bg-gray-300 text-black' : theme === 'high-contrast' ? 'bg-white text-black border-2' : 'bg-gray-700'} px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-mono text-xs sm:text-sm mr-2">A-Z</kbd>
                            Type letters
                        </li>
                        <li>
                            <kbd class="{theme === 'light' ? 'bg-gray-300 text-black' : theme === 'high-contrast' ? 'bg-white text-black border-2' : 'bg-gray-700'} px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-mono text-xs sm:text-sm mr-2">Enter</kbd>
                            Submit guess
                        </li>
                        <li>
                            <kbd class="{theme === 'light' ? 'bg-gray-300 text-black' : theme === 'high-contrast' ? 'bg-white text-black border-2' : 'bg-gray-700'} px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-mono text-xs sm:text-sm mr-2">Backspace</kbd>
                            Delete letter
                        </li>
                    </ul>
                </details>
            </div>
        </section>

        <!-- Live region for announcements (screen readers only) -->
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            class="sr-only"
        >
            {announcement}
        </div>
    </main>
</div>

<style>
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            animation: none !important;
            transition: none !important;
        }
    }
</style>