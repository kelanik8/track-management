import moment from "moment";

export const MORNING_SESSION_LENGTH: number = 180;
export const AFTERNOON_SESSION_LENGTH: number = 240;

interface Track {
  morning: Array<TrackData>;
  afternoon: Array<TrackData>;
  talks: TrackData[];
  duration: number;
  sessions: TrackData[];
}

interface TrackData {
  time?: string;
  talk: String;
  duration: number;
  id: number;
}

export function generateTracks(data: String): Track[] {
  const tracks: Track[] = [];
  let sessions = parseData(data);

  while (sessions.length > 0) {
    let newTrack: Track = {
      morning: [],
      afternoon: [],
      talks: [],
      duration: 0,
      sessions: []
    };

    let morningSession = groupTracks(sessions, MORNING_SESSION_LENGTH);
    newTrack.morning = morningSession;

    let morningSessionIds = morningSession.map((session) => session && session.id);

    sessions = sessions.filter(
      (session: TrackData) => !morningSessionIds.includes(session.id)
    );

    let afternoonSession = groupTracks(sessions, AFTERNOON_SESSION_LENGTH);
    newTrack.afternoon = afternoonSession;

    let afternoonSessionIds = afternoonSession.map((session) => session && session.id);

    sessions = sessions.filter(
      (session: TrackData) => !afternoonSessionIds.includes(session.id)
    );

    // sessions.length = 0
    tracks.push(newTrack);
  }

  return formatTracksData(tracks);
}

function parseData(data: any): any {
  if (!data)
    return;

  let result = data.split("\n").map((value: string, index: number) => {
    value = value.trim();
    if (value) {
      let sessionTime: String = String(value.split(" ").pop());
      const sessionTalk = value.slice(0, value.lastIndexOf(" "));

      if (sessionTime !== "lightning") {
        sessionTime = sessionTime.split("min")[0];
      }
      return {
        id: index,
        talk: sessionTalk,
        duration: sessionTime === "lightning" ? 5 : Number(sessionTime),
      };
    }
    return value;
  });

  return result.filter((value: string) => value !== '');
}

function groupTracks(
  events: TrackData[],
  target: number,
  partial: TrackData[] = [],
  count = 0
): TrackData[] {
  let sum, event, remaining;

  partial = partial || [];

  sum = partial.reduce(function (total: Number, b: TrackData) {
    return Number(+total + +b.duration);
  }, 0);

  if (sum === target) {
    return partial;
  }

  if (sum >= target) {
    partial.pop();
    return partial;
  }

  for (let i = count; i < events.length; i++) {
    event = events[i];
    remaining = events.slice(i + 1);

    return groupTracks(remaining, target, [...partial, event], i);
  }
  return partial;
}

const formatTracksData = (tracks: Track[]) => {
  tracks.forEach((track: Track) => {
    let morningPrevDuration: number;
    let morningPrevTime: string = "9:00 AM";
    // let startTime: string = "9:00";

    track.morning.forEach((session: TrackData, i: number) => {
      if (i === 0) {
        session.time = morningPrevTime;

        morningPrevTime = session.time;
        morningPrevDuration = session.duration;
      } else {
        session.time = moment
          .utc(morningPrevTime, "hh:mm A")
          .add(String(morningPrevDuration), "minutes")
          .format("hh:mm A");

          morningPrevTime = session.time;
          morningPrevDuration = session.duration;
      }

      if (i === track.morning.length - 1) {
        track.morning.push({
          talk: "Lunch",
          duration: 60,
          time: "12:00 PM",
          id: Number.MAX_SAFE_INTEGER,
        })
      }
    });

    let afternoonPrevDuration: number;
    let afternoonPrevTime: string = "1:00 PM";
    track.afternoon.forEach((session: TrackData, i: number) => {
      if (i === 0) {
        session.time = afternoonPrevTime;

        afternoonPrevTime = session.time;
        afternoonPrevDuration = session.duration;
      } else {
        session.time = moment
          .utc(afternoonPrevTime, "hh:mm")
          .add(String(afternoonPrevDuration), "minutes")
          .format("hh:mm A");

          afternoonPrevTime = session.time;
          afternoonPrevDuration = session.duration;
      }

      if (i === track.afternoon.length - 1) {
        track.afternoon.push({
          talk: "Networking Event",
          duration: 60,
          time: "5:00 PM",
          id: Number.MAX_SAFE_INTEGER,
        })
      }

      track.sessions = [...track.morning, ...track.afternoon]
    });
  });

  return tracks;
};
