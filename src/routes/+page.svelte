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

  let upcomingTalk 
  let interval;
  let error = false;
  let status;

  export let events;

  let rooms = {};
  const next_events_to_display = 3;

  async function fetchSchedule() {
  try {
    const response = await fetch("https://pretalx.riat.at/39c3/schedule/widgets/schedule.json");
    if (!response.ok) {
      throw new Error(`Error fetching schedule: ${response.statusText}`);
    }
    const data = await response.json();
    
    const now = new Date();
    

    console.log('data',data);

    // Process each room
    const rooms = data.rooms.map(room => {
      // Get all talks for this room, sorted by start time
      const roomTalks = data.talks
        .filter(talk => talk.room === room.id)
        .sort((a, b) => new Date(a.start) - new Date(b.start));
      
      // Get next talks (current or upcoming)
      const nextTalks = [];
      for (const talk of roomTalks) {
        const talkStart = new Date(talk.start);
        const talkEnd = new Date(talk.end);
        
        // Include if currently happening or starts in the future
        if (talkEnd >= now) {
          const isCurrent = talkStart <= now && now <= talkEnd;
          nextTalks.push({
            title: talk.title,
            time: talkStart.toLocaleTimeString('en-DE', { hour: '2-digit', minute: '2-digit' }),
            status: isCurrent ? "current" : "upcoming"
          });
          
          if (nextTalks.length === next_events_to_display) break;
        }
      }
      
      return {
        id: room.id,
        name: room.name.en,
        talks: nextTalks
      };
    });

    console.log('rooms',rooms)
    
    return rooms;
    
  } catch (error) {
    console.error("Failed to fetch or process schedule:", error);
    throw error;
  }
}

  // helper function to split a string into spans for the type motion design
  function splitStringToSpans(str) {
    return str.split('').map(letter => `<span>${letter}</span>`).join('');
  }

  onMount(async () => {
    // Initial fetch
    events = await fetchSchedule();

    console.log('events',events)

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
  <div class="grid">
    {#each events as room, idx}
      <div class="room{idx}">
        {#if error}
          {error}
        {:else}
          <div class="room">
              <div class="roomname">{room.name} 
              </div>
          </div>
        {/if}
        {#each room.talks as talk }
          {#if error}
            {error}
          {:else}
            <div class="cdc-embed">
              <div class="cdc-type anim1_5 event_title">
                  <span>
                  {talk.title}
                  </span>
              </div>
              <div class="time"><span>{talk.time}</span></div>
            </div>
          {/if}
        {/each}
      </div>
      {/each}
      <div class="qr qr_schedule">
        <img src="/images/qr_signup.png" alt="https://pretalx.riat.at/39c3/schedule/"/>
        <div class="supporting">Submit talk</div>
      </div>
      <div class="qr qr_signup">
        <img src="/images/qr_schedule.png" alt="https://pretalx.riat.at/39c3/schedule/"/>
        <div class="supporting">Full Schedule</div>
      </div>

      <div class="logo">
        <div class="cdc-embed">
          <p class="togglething cdc-type anim1 anim1_5">
            <span>enshittify</span>
            <span class="toggle">&lt;&lt;toggle</span>
            <span>decentralise</span>

          </p>
          <div>decentral.community</div>

        </div>
      </div>
    </div>
  </div>

    <div class="background">
      <div class="cdc-embed">
      <div class="black">
        <p class="cdc-type anim7">
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
 <p class="cdc-type anim1">
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
         <p class="cdc-type anim7">
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
        <p class="cdc-type anim7">
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
  <p class="cdc-type anim1">
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
          <p class="cdc-type anim7">
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>39C3</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
        <p class="cdc-type anim7">
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          </p>
        <p class="cdc-type anim7">
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>39C3</span>
          <span>&lt;&lt;CCC</span>
        </p>
        <p class="cdc-type anim7">
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
        <p class="cdc-type anim7">
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CHAOS</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
         <p class="cdc-type anim7">
          <span>C</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>39C3</span>
          <span>&lt;&lt;CCC</span>
        </p>
        <p class="cdc-type anim7">
          <span>39C3</span>
          <span>39C3</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
        </p>
         <p class="cdc-type anim7">
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>CDC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>&lt;&lt;CCC</span>
          <span>39C3</span>
          <span>&lt;&lt;CCC</span>
        </p>
           </div>
    </div>
    </div>

<style>
@import '$lib/type-motions.css';

:global(body) {
  color: #fff;
  background: #000;
  position: relative;
  overflow: hidden;

}

.container {  
  aspect-ratio: 16 / 9; /* Modern browsers */
  max-height: 93cqh; /* Ensure it doesn’t overflow */  
  /* Stop growing locally if the resulting height would exceed the screen height */
  max-width: calc(100vh * 16 / 9);
  overflow: hidden;
  font-family: 'KarioDuplexVar';
  margin: 0 auto;

  container-type: size;
  container-name: main-container;
  display: grid;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: auto minmax(0, 1fr) auto; 
  gap: 2vh;
  grid-auto-flow: row;
  color: #fff; 
  text-align: left; 
  overflow-y: auto; 
  min-height: 0;
  font-size: 3cqh;
  grid-template-areas:
    "room0 room0 center room1 room1 "
    "room0 room0 center room1 room1 "
    "room0 room0 center room1 room1 "
    "logo logo logo qr_schedule qr_signup"
}

.event_title {
  font-size: 4cqh;
  text-transform: uppercase;
}

.event0_title { 
  grid-area: event0_title; 
  font-size: 3vh;
  text-transform: uppercase;
}

.event0_title span {
  font-size: 3cqh;
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
  font-size: 3cqh;
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
  font-size: 3cqh;
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
  font-size: 6cqh;
}
.logo .toggle {
  font-size: 8cqh;
}
.logo span {
  font-size: 3cqh;

  }
.togglething {
  display: flex;
  flex-direction: row;
  align-items: center;
    justify-content: center;

  gap: 2cqw;

}

.room0 { 
  grid-area: room0; 
}

.room1 {
  grid-area: room1; 
  }

.room0, .room1 {
  text-align: left;
  margin: 1cqh;
  overflow-y: hidden;
}
.roomname {
  font-size: 2cqh ;
  text-transform: uppercase;
}

.supporting {
  font-weight: 300;
  font-size: 2vh;
  }

.qr_schedule, .qr_signup {
  text-align: center;
  margin-bottom: 2vh;
}
.qr_signup{
  grid-area: qr_signup; 
}

.qr_schedule {
  grid-area: qr_schedule; 
}

.qr img { 
  height: 13cqh; border-radius: 5px;
  margin-bottom: 2vh;
}

.background {
  position: absolute;
  top: -10vh;
  left: -10vw;
  z-index: -100;
  width: 200vw;
  height: 200vh;
  overflow: hidden;
}
  .background div {
  font-size: 10vh;
  color: #222;
  }
    .background .cdc-type {
    line-height: 0.5;
    }

 .cdc-type {
    margin-top: 3cqh;
  }
</style>

