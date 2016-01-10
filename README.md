# README (Manual WebHooks)


## Time Taken

Exceed 4 hours, Approx: 6 hours


## Installation (Prereq: npm, node, express4)

1. git clone
2. npm install
3. npm start


## Assumptions

1. The user(s) would only give good and meaningful input(s) (no injections)
2. WebHook push would only contain action and issue, while repository and sender information would be neglected due to bring trivial
3. Non-authenticated api requests limit is enough for the demo purpose (60 request/hr without basic auth or OAuth)
4. For others, please see the comments in index.js


## Justifications

1. Github Issue events do not seem to have an event which indicates a description change, so to make it simple, I will just get the issues and do checking for updates manually without considering events
2. Periodic update should be made in a reasonably long period, say 15 minutes, but the exact period should be discussed with customer. Also, please consider that authenticated api request to github is 5000 requests/hr, while non-authenticated ones are 60 requests/hr. They are hard constraints that should be considered, so a very short period is impossible.


## Notes

1. Tune your computer time to sync with the real time, otherwise the application can go wrong (e.g. your computer clock faster than the real one would make the "since" variable always faster than any update time as recorded by github.
