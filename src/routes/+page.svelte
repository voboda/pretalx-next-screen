<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // For getting query parameters in SvelteKit
  import { typeMotions } from "$lib/type-motions";
  export let title = "";
  export let time = "";
  export let roomId = 0;
  export let next_events = [];

  let upcomingTalk 
  let interval;
  let error = false;
  let status;
  const ROOMS = [
    "CDC Mini-Stage",
    "CDC Pentagon",
    "CDC Circle",
    ]
  const next_events_to_display = 3;

  async function fetchSchedule() {
  try {
    const response = await fetch("https://pretalx.riat.at/38c3/schedule/widgets/schedule.json");
    if (!response.ok) {
      throw new Error(`Error fetching schedule: ${response.statusText}`);
    }
    const data = await response.json();

    // Extract upcoming events for the specified room
    let now = new Date();
    now = Date.parse('28 Dec 2024 14:16:00 GMT');

    const events = data.talks
      .filter(talk => talk.room === parseInt(roomId))
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    next_events = [];
    let event = {};
    // Set default values
    title = "No upcoming events";
    time = "";
    status = "free";

    // Determine the status
    if (events.length > 0) {
      for (const talk of events) {
        const talkStart = new Date(talk.start);
        const talkEnd = new Date(talk.end);

        if (talkStart <= now && now <= talkEnd) {
          // Current talk
          title = talk.title;
          time = new Date(talk.start).toLocaleTimeString('en-De', { hour: '2-digit', minute: '2-digit' });
          status = "current";
          event = {title, time, status};
          next_events.push(event);

        } else if (talkStart > now) {
          // Upcoming talk
          title = talk.title;
          time = talkStart.toLocaleTimeString('en-De', { hour: '2-digit', minute: '2-digit' });
          if (talkStart - now <= 360000000) {
            status = "upcoming";
          }
          event = {title, time, status};
          next_events.push(event);
        }
        if (next_events.length >= next_events_to_display) {
          break;
        }
      }
    }

    console.log(next_events);
  } catch (error) {
    console.error("Failed to fetch or process schedule:", error);
    title = "Error fetching schedule";
    time = "";
    status = "free";
  }
}


  

  onMount(() => {

    typeMotions();
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
      <div class="room"> {ROOMS[roomId-1]} </div>
        <div class="cdc-embed">
          <p class="cdc-type anim9"><span>39C3</span></p>
        </div>
        <div class="cdc-embed">
          <p class="cdc-type anim6"><span>C</span><span>D</span><span>C</span></p>
        </div>
    </div>
  {#each next_events as event, idx}
    <div class="event{idx}">
    {#if event.status == "current" }
        <div>
          What's happening 
          <div class="time">{event.time}</div>
        </div>
      {#if error}
      <div class="title">{error}</div>
      {:else}
      <div class="title">{event.title}</div>
      {/if}
    {:else if event.status == "upcoming" }
        <div>
          Coming up 
          <div class="time">{event.time}</div>
        </div>
      <div class="title">{event.title}
      </div>
    {/if}
    </div>
  {/each}
   <div class="footer">
     <div> {ROOMS[roomId-1]} </div>
     <div class="qr">
      <img src="/images/qr_schedule.png" />
      Events Schedule
     </div>
    </div>
  </div>
</div>

<style>
/* include design from https://l5yth.github.io/39c3-cdc/39C3-Embeds/39C3-TypeMotions.css */
  @font-face {
    font-family: 'KarioDuplexVar';
    src: URL('/fonts/Kario/Kario39C3VarWEB-Roman.woff2') format('woff2');
    src: URL('/fonts/Kario/Kario39C3VarWEB-Roman.woff') format('woff');
    src: URL('/fonts/Kario/Kario39C3Var-Roman.ttf') format('truetype');
  }

  @keyframes font_weight_wave {
    from {
      font-weight: 10;
    }
    to {
      font-weight: 100;
    }
  }

  .cdc-embed {
    display: inline-flex;
    flex-direction: column;
    gap: 2.5rem;
  }
  
  .cdc-type {
    font-family: 'KarioDuplexVar', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 52pt;
    font-weight: 10;
    font-kerning: none;
    margin: 0;
    line-height: 1.05;
  }
  
  .cdc-type span {
    display: inline-block;
  }
  .anim1 span,
  .anim1_5 span,
  .anim2 span,
  .anim3 span,
  .anim4 span,
  .anim5 span,
  .anim6 span,
  .anim7 span,
  .anim8 span,
  .anim9 span,
  .anim10 span,
  .anim11 span {
    animation: font_weight_wave 3s ease-in-out 0s infinite alternate both;
  }
  
  .anim2,
  .anim3,
  .anim10 {
    display: inline-block;
    text-align: left;
  }
  
  .anim10 :not(:first-child) {
    font-size: 48pt;
    display: inline-block;
    margin-top: 0.8em;
    transform: scale(1, 2);
  }
  
  .anim10 span:first-child {
    font-size: 36pt;
    font-height: 150%;
    margin-bottom: 0.1em;
    display: inline-block;
    transform: scale(1, 2.5);
  }
  
  .anim1 span:nth-child(1) { animation-delay: -0.1s; }
  .anim1 span:nth-child(2) { animation-delay: -0.2s; }
  .anim1 span:nth-child(3) { animation-delay: -0.3s; }
  .anim1 span:nth-child(4) { animation-delay: -0.4s; }
  .anim1 span:nth-child(5) { animation-delay: -0.5s; }
  .anim1 span:nth-child(6) { animation-delay: -0.6s; }
  .anim1 span:nth-child(7) { animation-delay: -0.7s; }
  .anim1 span:nth-child(8) { animation-delay: -0.8s; }
  .anim1 span:nth-child(9) { animation-delay: -0.9s; }
  .anim1 span:nth-child(10) { animation-delay: -1.0s; }
  .anim1 span:nth-child(11) { animation-delay: -1.1s; }
  .anim1 span:nth-child(12) { animation-delay: -1.2s; }
  .anim1 span:nth-child(13) { animation-delay: -1.3s; }
  .anim1 span:nth-child(14) { animation-delay: -1.4s; }
  .anim1 span:nth-child(15) { animation-delay: -1.5s; }
  .anim1 span:nth-child(16) { animation-delay: -1.6s; }
  .anim1 span:nth-child(17) { animation-delay: -1.7s; }
  .anim1 span:nth-child(18) { animation-delay: -1.8s; }
  .anim1 span:nth-child(19) { animation-delay: -1.9s; }
  .anim1 span:nth-child(20) { animation-delay: -2.0s; }
  .anim1 span:nth-child(21) { animation-delay: -2.1s; }
  .anim1 span:nth-child(22) { animation-delay: -2.2s; }
  .anim1 span:nth-child(23) { animation-delay: -2.3s; }
  .anim1 span:nth-child(24) { animation-delay: -2.4s; }
  .anim1 span:nth-child(25) { animation-delay: -2.5s; }
  .anim1 span:nth-child(26) { animation-delay: -2.6s; }
  .anim1 span:nth-child(27) { animation-delay: -2.7s; }
  .anim1 span:nth-child(28) { animation-delay: -2.8s; }
  .anim1 span:nth-child(29) { animation-delay: -2.9s; }
  .anim1 span:nth-child(30) { animation-delay: -3.0s; }
  .anim1 span:nth-child(31) { animation-delay: -3.1s; }
  .anim1 span:nth-child(32) { animation-delay: -3.2s; }
  .anim1 span:nth-child(33) { animation-delay: -3.3s; }
  .anim1 span:nth-child(34) { animation-delay: -3.4s; }
  .anim1 span:nth-child(35) { animation-delay: -3.5s; }
  .anim1 span:nth-child(36) { animation-delay: -3.6s; }
  .anim1 span:nth-child(37) { animation-delay: -3.7s; }
  .anim1 span:nth-child(38) { animation-delay: -3.8s; }
  
  .anim10 span:nth-child(2) { animation-delay: -0.2s; }
  .anim10 span:nth-child(3) { animation-delay: -0.3s; }
  .anim10 span:nth-child(4) { animation-delay: -0.4s; }
  .anim10 span:nth-child(5) { animation-delay: -0.5s; }
  .anim10 span:nth-child(6) { animation-delay: -0.6s; }
  .anim10 span:nth-child(7) { animation-delay: -0.7s; }
  .anim10 span:nth-child(8) { animation-delay: -0.8s; }
  .anim10 span:nth-child(9) { animation-delay: -0.9s; }
  .anim10 span:nth-child(10) { animation-delay: -1.0s; }
  .anim10 span:nth-child(11) { animation-delay: -1.1s; }
  .anim10 span:nth-child(12) { animation-delay: -1.2s; }
  .anim10 span:nth-child(13) { animation-delay: -1.3s; }
  .anim10 span:nth-child(14) { animation-delay: -1.4s; }
  
  .anim6 span:nth-child(1) { animation-delay: -0.5s; }
  .anim6 span:nth-child(2) { animation-delay: -1.0s; }
  .anim6 span:nth-child(3) { animation-delay: -1.5s; }
  .anim6 span:nth-child(4) { animation-delay: -2.0s; }
  .anim6 span:nth-child(5) { animation-delay: -2.5s; }
  .anim6 span:nth-child(6) { animation-delay: -3.0s; }
  .anim6 span:nth-child(7) { animation-delay: -3.5s; }
  .anim6 span:nth-child(8) { animation-delay: -4.0s; }
  .anim6 span:nth-child(9) { animation-delay: -4.5s; }
  .anim6 span:nth-child(10) { animation-delay: -5.0s; }
  .anim6 span:nth-child(11) { animation-delay: -5.5s; }
  .anim6 span:nth-child(12) { animation-delay: -6.0s; }
  .anim6 span:nth-child(13) { animation-delay: -6.5s; }
  .anim6 span:nth-child(14) { animation-delay: -7.0s; }
  .anim6 span:nth-child(15) { animation-delay: -7.5s; }
  .anim6 span:nth-child(16) { animation-delay: -8.0s; }
  
  .anim7 span:nth-child(odd) { animation-delay: -3.0s; }
  .anim7 span:nth-child(even) { animation-delay: 0.0s; }
  
  .anim8 span:nth-child(2n)   { animation-delay: -3.0s; }
  .anim8 span:nth-child(2n+1) { animation-delay: -1.5s; }
  .anim8 span:nth-child(2n+2) { animation-delay:  0.0s; }
  
  .black {
    background-color: #000;
    color: #fff;
    width: 100%;
    min-height: 4em;
    padding: 1.5rem;
    border-radius: 20px;
  }
  /* end include */

  .wrapper {
    padding: 3vh;
    position: relative;
    z-index: 1;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    width: 97%;
  }

  .wrapper::before {
    content: '';
    position: absolute;
    z-index: 0; /* Ensure it stays below the content */
  }

  /* Rotation animation */
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  :global(body) {
    background-color: #000; /* Background color from guide */
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100vh;
    color: #fff; /* Highlight color from guide */
    font-family: 'KarioDuplexVar';
  }
  .main {
    margin: 5vh;
    /* height: 82vh; */
    display: flex;
    gap: 4vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    /* Aspect Ratio Constraint */
    aspect-ratio: 16 / 9; /* Modern browsers */
    max-height: 100vh; /* Ensure it doesn’t overflow */
    max-width: 100vw;

    /* For browsers that don't support aspect-ratio */
    position: relative;
    overflow: hidden;
  }

  .event0 {
    width: 100%;
    text-transform: uppercase;
    margin: 0;
  }

  .event1, .event2, .event3 {
    width: 100%;
    text-transform: uppercase;
    margin: 0;
  }

  .header {
    align-items: center;
    justify-content: space-between; /* Ensures time and logo align properly */
    width: 100%;
    text-align: left;
    font-size: 3vh;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin: 0;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensures time and logo align properly */
    width: 100%;
    text-align: left;
  }

   .qr {
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Ensures time and logo align properly */
    align-items: center;
    gap: 2vh;
    text-align: left;
    font-size: 2vh;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin: 10px 0;
  }

  .qr img {
    height: 14vh;
    border-radius: 5px;
  }

  .time {
    margin-left: 10px;
    font-size: 3vh;
  }

  .logo {
    display: flex;
    justify-content: flex-end; /* Align the logo to the right */
    align-items: center;
  }

  .logo img {
    width: 10;
    max-height: 5vh;
  }

  .header + .time {
    display: inline-block;
    position: relative;
    left: 0;
    top: 0;
  }

  .signup {
    font-size: 7vh;
    line-height: 1.1;
    text-align:center;
  }

  .footer .room, .signup > div:first-child {
    font-size: 4vh;
    text-transform: uppercase;
  }
  .signup img {
    margin-top: 3vh;
    height: 70%;
  }

  .title {
    font-size: 4vh;
    line-height: 1.1;
    text-align: center;
    margin: 0;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 0.5rem;
  }

</style>

