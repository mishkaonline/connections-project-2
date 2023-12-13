### To Do

- [x] Get it working on Glitch!!!
- [x] Move the database of fun facts to Mongo DB so that people can add questions directly to the game
  - [x] Create a submission form to do the above
- [x] Switch from each question having an array of answers to dynamically generating “wrong” answers from the answers to other questions (this will scale better if more people get added)
- [x] Figure out the async thing—each player should get a unique instance of the game without influencing others’ questions, BUT the scoreboard should be visible to other players
  - [x] Easiest way is to use express fetch for all the quiz stuff instead of sockets, and only use sockets to broadcast the user id and store whenever someone joins, leaves, or has a new score
- [x] Get the score updating correctly (get the user object by id and update the score ++ on correct answer)
- [x] Full-screen Menu
- [ ] Add a leaderboard?
- [x] End the game! Doesn’t quite work right now.
  - [ ] Styling this screen
- [ ] Design a footer, about page or other context section
- [x] Audio?
- [ ] New Avatars for folks who submitted
- [x] Find a way to use a mystery/silhouette avatar for anybody who doesn’t have one
- [x] Environment variables locally and on Github
- [x] Add question number before each question (to be updated to progress bar later?)