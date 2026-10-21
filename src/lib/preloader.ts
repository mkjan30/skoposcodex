// Kept out of the "use client" Preloader so the server layout can inline the script.
export const PRELOADER_KEY = "sc-preloaded";

/**
 * Runs before first paint (inlined in <head>):
 * - repeat visit in this session → `no-preloader` (overlay hidden, no flash);
 * - first visit with motion allowed → `preloading`, which pauses the hero entrances until
 *   the overlay lifts. A 3 s timeout releases them even if hydration never happens.
 */
export const preloaderSkipScript = `try{var d=document.documentElement;if(sessionStorage.getItem("${PRELOADER_KEY}"))d.classList.add("no-preloader");else if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("preloading");setTimeout(function(){d.classList.remove("preloading")},3000)}}catch(e){}`;
