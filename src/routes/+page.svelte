<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // For getting query parameters in SvelteKit
  import { typeMotions } from "$lib/type-motions";
  export let title = "";
  export let time = "";
  export let roomId = 0;
  export let roomSpan = '';
  export let room;
  export let roomName = '';
  export let next_events = [];
  export let current_version = "";

  let upcomingTalk 
  let interval;
  let error = false;
  let status;
  const next_events_to_display = 3;

  async function fetchSchedule() {
    try {

      // we refresh the page on a new version deployed
      // const version_url = "http://localhost:5173/version";
      const version_url = "https://pretalx-next-screen.vercel.app/version";
      const version_response = await fetch(version_url);
      if (!version_response.ok) {
        throw new Error(`Error fetching schedule: ${version_response.statusText}`);
      }
      const version_json = await version_response.json();
      const version = version_json.version;
      if (current_version == "") {
        current_version = version;
      } else if (current_version != version) {
        current_version = version;
        window.location.reload();
      }
      console.log(current_version);

      const response = await fetch("https://pretalx.riat.at/39c3/schedule/widgets/schedule.json");
      if (!response.ok) {
        throw new Error(`Error fetching schedule: ${response.statusText}`);
      }
      const data = await response.json();
  
      console.log('data', data)
      // Extract upcoming events for the specified room
      let now = new Date();
      // now = Date.parse('28 Dec 2024 14:16:00 GMT');
  
      room = data.rooms
         .filter(room => room.id == parseInt(roomId)).pop()

      roomName = room?.name?.en;

      console.log('room', room)
      const events = data.talks
        .filter(talk => talk.room === parseInt(roomId))
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  
      console.log('events', events)
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

    if (!roomId) {
      title = "Please specify ?room=X in the url";
      console.error("Room ID not provided or invalid");
      return;
    }
    //roomSpan.innerHTML = splitStringToSpans(ROOMS[roomId-1].toUpperCase());
    document.body.style.backgroundColor = "#000000";

    // Initial fetch
    fetchSchedule();

    // calling our type motions design js script
    typeMotions();

    // Set interval to fetch every minute
    //interval = setInterval(fetchSchedule, 60000);
    interval = setInterval(() => window.location.reload(), 60000);

    // Cleanup interval on component destroy
    return () => clearInterval(interval);

  });
</script>

<div class="container">
  <div class="header">
 </div>
  {#each next_events as event, idx}
  {#if (event)}
  <div class="event{idx}_title">
    {#if error}
      {error}
    {:else}
      <div class="cdc-embed">
        <div class="cdc-type anim1_5 event_title">
             <span>
             {event.title}
             </span>
        </div>
        <div class="time"><span>{event.time}</span></div>
      </div>
    {/if}
  </div>
  {/if}
  {/each}
    <div class="cdc-embed">
      <div class="black">
      </div>
    </div>
 
  <div class="logo">
        <p class="cdc-type anim7">
        </p>
  </div>
  <div class="room">
      <div class="roomname">{roomName} 
      </div>
  </div>
  <div class="qr">
    <img src="/images/qr_schedule.png" alt="https://pretalx.riat.at/39c3/schedule/"/>
    <div class="supporting">Full Schedule</div>
  </div>
</div>

<style>
@import '$lib/type-motions.css';

:global(body) {
  background-color: #000;
  background-color: #fff;
  color: #fff;
}

.container {  

  aspect-ratio: 16 / 9; /* Modern browsers */
  max-height: 95vh; /* Ensure it doesn’t overflow */  
  max-width: 95vw;
  font-family: 'KarioDuplexVar';
  display: grid;
  grid-template-columns: 1fr 1fr 1fr ;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 2vh;
  grid-auto-flow: row;
  background-color: #000;
  color: #fff;
  text-align: left;
  grid-template-areas:
    "event0_title event0_title event0_title "
    "event1_title event1_title event1_title "
    "event2_title event2_title event2_title "
    "room room qr";
}

.header { 
  grid-area: header; 
  text-align: center;
  margin: 1vh;
}

.event_title {
  font-size: 5vh;
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

.time {
    padding: 0px;
    margin: 0px;
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
  margin: 1vh;
}

.room { 
  grid-area: room; 
  text-align: left;
  margin: 1vh;

}
.roomname {
  margin-top: 6vh;
  font-size: 7vh ;
  text-transform: uppercase;
}

.supporting {
  font-weight: 300;
  font-size: 2vh;
  }
.qr {
  grid-area: qr; 
  text-align: right;
  margin-bottom: 2vh;

}

.qr img { 
  height: 15vh;
  border-radius: 5px;
  margin-bottom: 2vh;
}
 
 .cdc-type {
    margin-top: 5vh;
  }
</style>

