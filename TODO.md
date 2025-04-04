### To Do

- [x] Get it working on Glitch!!!
- [x] Move the database of fun facts to Mongo DB so that people can add questions directly to the game
  - [x] Create a submission form to do the above
- [x] Switch from each question having an array of answers to dynamically generating “wrong” answers from the answers to other questions (this will scale better if more people get added)
- [x] Figure out the async thing—each player should get a unique instance of the game without influencing others’ questions, BUT the scoreboard should be visible to other players
  - [x] Easiest way is to use express fetch for all the quiz stuff instead of sockets, and only use sockets to broadcast the user id and store whenever someone joins, leaves, or has a new score
- [x] Get the score updating correctly (get the user object by id and update the score ++ on correct answer)
- [x] Full-screen Menu
- [x] Add a leaderboard?
- [x] End the game! Doesn’t quite work right now.
  - [x] Styling this screen
- [x] Design a footer, about page or other context section
- [x] Audio?
- [x] New Avatars for folks who submitted
- [x] Find a way to use a mystery/silhouette avatar for anybody who doesn’t have one
- [x] Environment variables locally and on Github
- [x] Add question number before each question (to be updated to progress bar later?)

JAN 3, 2024
[] Responsive flex answers
[] Responsive font sizing with media queries (question, names)


JAN 24, 2024
[x] Design leaderboard
[x] Add timer (starts when name submitted, stops when final question answered)
[x] Create new DB to push final scores
[x] Push name, score, play time and date to DB
[x] When leaderboard called, sort by score then play time, display top 10

OCT 18, 2024
[x] Update Glitch!
[x] Fix Github Issue (likely caused because Drive offlined some files)
[] Leaderboard toggle between last [30 days] and all-time

APR 2, 2025
[x] Laderboard dates to include year (because this thing is now that old)
[x] Back up questions added to MongoDB (via Github Actions?)