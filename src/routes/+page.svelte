<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // For getting query parameters in SvelteKit

  export let room = ""; // Room ID passed as a GET variable
  export let title = "";
  export let time = "";
  export let roomId = 0;

  let interval;
  let error = false;

  // Function to fetch and process schedule
  async function fetchSchedule() {
    try {
      const response = await fetch("https://pretalx.riat.at/38c3/schedule/v/0.10/widgets/schedule.json");
      if (!response.ok) {
        throw new Error(`Error fetching schedule: ${response.statusText}`);
      }
      const data = await response.json();

      // Extract upcoming events for the specified room
      let now = new Date();
      //now = Date.parse('27 Dec 2024 18:00:00 GMT');

     const events = data.talks
        .filter(talk => talk.room === parseInt(roomId))
        .filter(talk => Date.parse(talk.start) > now)
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

      // Set title and time for the next upcoming event
      if (events.length > 0) {
        title = events[0].title;
        time = new Date(events[0].start).toLocaleTimeString('en-De', { hour: '2-digit', minute: '2-digit' });
      } else {
        title = "No upcoming events";
        time = "";
      }
    } catch (error) {
      console.error("Failed to fetch or process schedule:", error);
      title = "Error fetching schedule";
      time = "";
    }
  }

  onMount(() => {

    // Extract room query parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    roomId = parseInt(queryParams.get("room"), 10);

    if (!roomId) {
      title = "Please specify ?room=X in the url";
      console.error("Room ID not provided or invalid");
      return;
    }

    // Initial fetch
    fetchSchedule();

    // Set interval to fetch every minute
    interval = setInterval(fetchSchedule, 60000);

    // Cleanup interval on component destroy
    return () => clearInterval(interval);
  });
</script>

<div class="wrapper">
  <div class="main">
    <div class="header">
      <div>
        Up Next
        <div class="time">{time}</div>
      </div>
      <div class="logo"><img src="/images/cdc.png" /></div>
    </div>
    {#if error}
    <div class="title">{error}</div>
    {:else}
    <div class="title">{title}</div>
    {/if}
  </div>
</div>

<style>
  @font-face {
    font-family: 'pilowlava';
    src: URL('/fonts/pilowlava/Fonts/webfonts/Pilowlava-Regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'spacegrotesk';
    src: URL('/fonts/space-grotesk-1.1.4/webfont/SpaceGrotesk-Regular.woff2') format('woff2');
    src: URL('/fonts/space-grotesk-1.1.4/webfont/SpaceGrotesk-Bold.woff2') format('woff2');
    src: URL('/fonts/space-grotesk-1.1.4/webfont/SpaceGrotesk-Light.woff2') format('woff2');
    src: URL('/fonts/space-grotesk-1.1.4/webfont/SpaceGrotesk-Medium.woff2') format('woff2');
    src: URL('/fonts/space-grotesk-1.1.4/webfont/SpaceGrotesk-SemiBold.woff2') format('woff2');
  }

  @font-face {
    font-family: 'space-mono';
    src: URL('/fonts/space-mono/SpaceMono-Regular.ttf') format('truetype');
  }

  @font-face {
    font-family: 'uncut-sans';
    src: URL('/fonts/uncut-sans/Webfonts/UncutSans-Regular.woff2') format('woff2');
  }

  .wrapper {
    padding: 3vh;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100vh;
    background-color: #0F000A; /* Background color from guide */
    color: #FEF2FF; /* Highlight color from guide */
    font-family: 'spacegrotesk', Arial, sans-serif;
  }
  .main {
    margin: 5vh;
    height: 82vh;
    display: flex;
    gap: 4vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #0F000A; /* Example background color */
    color: #FEF2FF; /* Example text color */
    font-family: Arial, sans-serif;

    /* Aspect Ratio Constraint */
    aspect-ratio: 16 / 9; /* Modern browsers */
    max-height: 100vh; /* Ensure it doesn’t overflow */
    max-width: 100vw;

    /* For browsers that don't support aspect-ratio */
    position: relative;
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensures time and logo align properly */
    width: 100%;
    text-align: left;
    font-size: 4vh;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #6A5FDB; /* Accent B from guide */
    margin: 10px 0;
    font-family: 'pilowlava';
  }

  .time {
    color: #FF5053; /* Primary color from guide */
    margin-left: 10px;
    font-family: 'uncut-sans';
    font-size: 6vh;
  }

  .logo {
    display: flex;
    justify-content: flex-end; /* Align the logo to the right */
    align-items: center;
  }

  .logo img {
    width: 20vw;
    max-height: 20vh;
  }

  .header + .time {
    display: inline-block;
    position: relative;
    left: 0;
    top: -20px;
  }

  .title {
    font-size: 9vh;
    line-height: 1.1;
    color: #FEF2FF; /* Highlight color from guide */
    text-align: center;
    margin: 0;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-family: 'space-mono';
    margin-top: -3rem;
  }

</style>

