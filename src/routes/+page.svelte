<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // For getting query parameters in SvelteKit
  import { typeMotions } from "$lib/type-motions";
  export let title = "";
  export let time = "";
  export let roomId = 0;
  export let roomSpan = '';
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
      // TODO: change the url bellow for the new one (39c3)
      // const response = await fetch("https://pretalx.riat.at/39c3/schedule/widgets/schedule.json");
      const response = await fetch("https://pretalx.riat.at/38c3/schedule/widgets/schedule.json");
      if (!response.ok) {
        throw new Error(`Error fetching schedule: ${response.statusText}`);
      }
      const data = await response.json();
  
      // Extract upcoming events for the specified room
      let now = new Date();
      // TODO: comment the line bellow
      now = Date.parse('28 Dec 2024 14:16:00 GMT');
  
      const events = data.talks
        .filter(talk => talk.room === parseInt(roomId))
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  
      next_events = [];
      // Set default values
      title = "No upcoming events";
      time = "";
      status = "free";
  
      // Determine the status
      if (events.length > 0) {
        for (const talk of events) {
          let event = {};
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

  function splitStringToSpans(str) {
    return str.split('').map(letter => `<span>${letter}</span>`).join('');
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
    roomSpan.innerHTML = splitStringToSpans(ROOMS[roomId-1].toUpperCase());

    // Initial fetch
    fetchSchedule();

    typeMotions();
    // Set interval to fetch every minute
    interval = setInterval(fetchSchedule, 60000);

    // Cleanup interval on component destroy
    return () => clearInterval(interval);

  });


</script>

<div class="wrapper">
  <div class="main">
    <div class="header">
      <div class="cdc-embed">
        <div class="black">
          <p class="cdc-type anim7">
            <span>&lt;&lt;CCC</span>
            <span>39C3</span>
            <span>&lt;&lt;CCC</span>
            <span>CDC</span>
            <span>&lt;&lt;CCC</span>
            <span>39C3</span>
            <!-- <span>&lt;&lt;CCC</span> -->
            <!-- <span>39C3</span> -->
          </p>
          <p class="cdc-type anim7">
            <span>39C3</span>
            <span>&lt;&lt;CCC</span>
            <span>CDC</span>
            <span>&lt;&lt;CCC</span>
            <span>39C3</span>
            <span>&lt;&lt;CCC</span>
            <!-- <span>39C3</span> -->
            <!-- <span>&lt;&lt;CCC</span> -->
          </p>
        </div>
      </div>
    </div>
  {#each next_events as event, idx}
    {#if (event)}
      <div class="event{idx}">
      {#if event.status == "current" }
          <div class="left">
            What's happening 
            <div class="time">{event.time}</div>
          </div>
        {#if error}
        <div class="title">{error}</div>
        {:else}
        <div class="cdc-embed">
          <div class="cdc-type anim1">
            <div class="title">
              <span>
               {event.title}
              </span>
            </div>
          </div>
        </div>
        {/if}
      {:else if event.status == "upcoming" }
          <div class="left">
            Coming up 
            <div class="time">{event.time}</div>
          </div>
          <div class="cdc-embed">
            <div class="cdc-type anim1">
              <div class="title">
              <span>
               {event.title}
              </span>
            </div>
          </div>
        </div>
      {/if}
      </div>
    {/if}
  {/each}
   <div class="footer">
     <div class="qr">
     <div class="cdc-embed">
       <div class="cdc-type anim1 anim1_5" bind:this={roomSpan}> </div> 
     </div>
     Room
</div>
     <div class="qr">
      <img src="/images/qr_schedule.png" />
      Events Schedule
     </div>
    </div>
  </div>
</div>

<style>
/* TODO: make sure the css allow for a clean display on any size of screen */

  @import '$lib/type-motions.css';

  .wrapper {
    padding: 2vh;
    position: relative;
    z-index: 1;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    width: 97%;
  }

  :global(body) {
    background-color: #000; /* Background color from guide */ 
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    color: #fff; /* Highlight color from guide */ 
    font-family: 'KarioDuplexVar';
  }
  .main {
    margin: 2vh;
    height: 82vh;
    display: flex;
    gap: 1vh;
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
  .left {
    width: 10vw;
  }

  .event0 {
    width: 100%;
    text-transform: uppercase;
    text-align: center;
    margin: 0;
    gap: 2vw;
    display: flex;
    flex-direction: row;
  }

  .event1, .event2, .event3 {
    width: 100%;
    text-transform: uppercase;
    text-align: center;
    margin: 0;
    gap: 2vw;
    display: flex;
    flex-direction: row;
  }

  .header {
    align-items: center;
    justify-content: space-between; /* Ensures time and logo align properly */
    width: 100%;
    text-align: center;
    font-size: 3vh;
    text-transform: uppercase;
    margin: 0;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensures time and logo align properly */
    width: 100%;
    text-align: left;
    margin-top: 2vh;
  }

   .qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1vh;
    text-align: left;
    font-size: 2vh;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .qr img {
    height: 10vh;
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

  /* .header + .time { */
  /*   display: inline-block; */
  /*   position: relative; */
  /*   left: 0; */
  /*   top: 0; */
  /* } */

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

