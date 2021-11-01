"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTracks = exports.AFTERNOON_SESSION_LENGTH = exports.MORNING_SESSION_LENGTH = void 0;
const moment_1 = __importDefault(require("moment"));
exports.MORNING_SESSION_LENGTH = 180;
exports.AFTERNOON_SESSION_LENGTH = 240;
function generateTracks(data) {
    const tracks = [];
    let sessions = parseData(data);
    while (sessions.length > 0) {
        let newTrack = {
            morning: [],
            afternoon: [],
            talks: [],
            duration: 0,
            sessions: []
        };
        let morningSession = groupTracks(sessions, exports.MORNING_SESSION_LENGTH);
        newTrack.morning = morningSession;
        let morningSessionIds = morningSession.map((session) => session.id);
        sessions = sessions.filter((session) => !morningSessionIds.includes(session.id));
        let afternoonSession = groupTracks(sessions, exports.AFTERNOON_SESSION_LENGTH);
        newTrack.afternoon = afternoonSession;
        let afternoonSessionIds = afternoonSession.map((session) => session.id);
        sessions = sessions.filter((session) => !afternoonSessionIds.includes(session.id));
        tracks.push(newTrack);
    }
    return formatTracksData(tracks);
}
exports.generateTracks = generateTracks;
const parseData = (data) => {
    if (!data)
        return;
    let result = data.split("\n").map((value, index) => {
        value = value.trim();
        if (value) {
            let sessionTime = String(value.split(" ").pop());
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
        return;
    });
    return result;
};
function groupTracks(events, target, partial = [], count = 0) {
    let sum, event, remaining;
    partial = partial || [];
    sum = partial.reduce(function (total, b) {
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
const formatTracksData = (tracks) => {
    tracks.forEach((track) => {
        let morningPrevDuration;
        let morningPrevTime = "9:00 AM";
        track.morning.forEach((session, i) => {
            if (i === 0) {
                session.time = morningPrevTime;
                morningPrevTime = session.time;
                morningPrevDuration = session.duration;
            }
            else {
                session.time = moment_1.default
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
                });
            }
        });
        let afternoonPrevDuration;
        let afternoonPrevTime = "1:00 PM";
        track.afternoon.forEach((session, i) => {
            if (i === 0) {
                session.time = afternoonPrevTime;
                afternoonPrevTime = session.time;
                afternoonPrevDuration = session.duration;
            }
            else {
                session.time = moment_1.default
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
                });
            }
            track.sessions = [...track.morning, ...track.afternoon];
        });
    });
    console.log(moment_1.default.utc("10:00", "hh:mm").add(1, "hour").format("hh:mm"));
    return tracks;
};
//# sourceMappingURL=TrackGenerator.js.map