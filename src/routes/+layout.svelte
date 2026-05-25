<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    import '../app.css';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,0..100;1,9..144,300..900,0..100&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
        rel="stylesheet"
    />
</svelte:head>

{@render children()}
