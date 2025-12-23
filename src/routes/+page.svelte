<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // For getting query parameters in SvelteKit
  import { typeMotions } from "$lib/type-motions";
  export let title = "";
  export let time = "";
  export let roomId = 0;
  export let roomSpan = '';
  export let next_events = [];
  // signup is disable by default, it get enabled if a query parameter "signup_enable" is set to any value 
  export let signup_enable = false;

  let upcomingTalk 
  let interval;
  let error = false;
  let status;
  // 2024 rooms
  // const ROOMS = [
  //   "CDC Mini-Stage",
  //   "CDC Pentagon",
  //   "CDC Circle",
  //   ]
  // 2025 rooms
  const ROOMS = [
    "CDC Triangle",
    "CDC Circle",
    ]

  // this is hardcoded with the grid layout
  const next_events_to_display = 3;

  async function fetchSchedule() {
    try {
      const response = await fetch("https://pretalx.riat.at/39c3/schedule/widgets/schedule.json");
      if (!response.ok) {
        throw new Error(`Error fetching schedule: ${response.statusText}`);
      }
      const data = await response.json();
  
      // Extract upcoming events for the specified room
      let now = new Date();
      // now = Date.parse('28 Dec 2024 14:16:00 GMT');
  
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

  // helper function to split a string into spans for the type motion design
  function splitStringToSpans(str) {
    return str.split('').map(letter => `<span>${letter}</span>`).join('');
  }

  onMount(() => {
    // Extract room query parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    roomId = parseInt(queryParams.get("room"), 10);
    
    // setting the query param "signup_enable" to any value activate the signup
    signup_enable = queryParams.get("signup_enable")?true:false;

    if (!roomId) {
      title = "Please specify ?room=X in the url";
      console.error("Room ID not provided or invalid");
      return;
    }
    roomSpan.innerHTML = splitStringToSpans(ROOMS[roomId-1].toUpperCase());

    // Initial fetch
    fetchSchedule();

    // calling our type motions design js script
    typeMotions();

    // Set interval to fetch every minute
    interval = setInterval(fetchSchedule, 60000);

    // Cleanup interval on component destroy
    return () => clearInterval(interval);

  });
</script>

<div class="container">
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
        </p>
        <p class="cdc-type anim7">
          <span>39C3</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>39C3</span>
          <span>&lt;&lt;CCC</span>
        </p>
      </div>
    </div>
  </div>
  {#each next_events as event, idx}
  {#if (event)}
  <div class="event{idx}_time">
      {#if event.status == "current" }
            What's happening 
            <div class="time">{event.time}</div>
      {:else if event.status == "upcoming" }
            Coming up 
            <div class="time">{event.time}</div>
      {/if}
  </div>
  <div class="event{idx}_title">
    {#if error}
      {error}
    {:else}
      <div class="cdc-embed">
        <div class="cdc-type anim1">
            <span>
             {event.title}
            </span>
        </div>
      </div>
    {/if}
  </div>
  {/if}
  {/each}
  <div class="logo">
    {#if signup_enable}
    <img src="/images/qr_signup.png" alt="https://pretalx.riat.at/39c3/cfp?access_code=LASTMINUTESUBMISSIONS8XPRLFLT8"/>
    <div>Submit an Event</div>
    {:else}
    <div class="cdc-embed">
      <p class="cdc-type anim1 anim11">
        <span>&lt;&lt;toggle</span>
      </p>
    </div>
    {/if}
  </div>
  <div class="room">
    <div class="cdc-embed">
      <div class="cdc-type anim1 anim1_5" bind:this={roomSpan}> </div> 
    </div>

    <div>Room</div>
  </div>
  <div class="qr">
    <img src="/images/qr_schedule.png" alt="https://pretalx.riat.at/39c3/schedule/"/>
    <div>Events Schedule</div>
  </div>
</div>

<style>
@import '$lib/type-motions.css';

:global(body) {
  background-color: #000;
  color: #fff;
}

.container {  

  aspect-ratio: 16 / 9; /* Modern browsers */
  max-height: 100vh; /* Ensure it doesn’t overflow */  
  max-width: 100vw;
  font-family: 'KarioDuplexVar';
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 2vh;
  grid-auto-flow: row;
  background-color: #000;
  color: #fff;
  text-align: left;
  grid-template-areas:
    "header header header header"
    "event0_time event0_title event0_title event0_title"
    "event1_time event1_title event1_title event1_title"
    "event2_time event2_title event2_title event2_title"
    "logo room room qr";
}

.header { 
  grid-area: header; 
  text-align: center;
  margin: 1vh;
}

.event0_title { 
  grid-area: event0_title; 
  font-size: 3vh;
  text-transform: uppercase;
}

.event0_title span {
  font-size: 5vh;
  margin-right: 1vw;
}

.event0_time { 
  grid-area: event0_time; 
  text-align: center;
  font-size: 3vh;
}

.event1_title { 
  grid-area: event1_title; 
  font-size: 3vh;
  text-transform: uppercase;
}

.event1_title span {
  font-size: 5vh;
  margin-right: 1vw;
}

.event1_time { 
  grid-area: event1_time; 
  text-align: center;
  font-size: 3vh;
}

.event2_title { 
  grid-area: event2_title; 
  font-size: 3vh;
  text-transform: uppercase;
}

.event2_title span {
  font-size: 5vh;
  margin-right: 1vw;
}

.event2_time { 
  grid-area: event2_time; 
  text-align: center;
  font-size: 3vh;
}

.logo {
  grid-area: logo; 
  text-align: center;
  margin-bottom: 2vh;
}

.logo img { 
  height: 15vh;
  border-radius: 5px;
  margin-bottom: 2vh;
}

.room { 
  grid-area: room; 
  text-align: center;
  margin: 1vh;
}

.qr {
  grid-area: qr; 
  text-align: center;
  margin-bottom: 2vh;
}

.qr img { 
  height: 15vh;
  border-radius: 5px;
  margin-bottom: 2vh;
}
 
</style>

