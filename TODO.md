### To Do

- [x] Get it working on Glitch!!!
- [x] Move the database of fun facts to Mongo DB so that people can add questions directly to the game
  - [x] Create a submission form to do the above
- [x] Switch from each question having an array of answers to dynamically generating “wrong” answers from the answers to other questions (this will scale better if more people get added)
- [x] Figure out the async thing—each player should get a unique instance of the game without influencing others’ questions, BUT the scoreboard should be visible to other players
  - [x] Easiest way is to use express fetch for all the quiz stuff instead of sockets, and only use sockets to broadcast the user id and store whenever someone joins, leaves, or has a new score
- [x] Get the score updating correctly (get the user object by id and update the score ++ on correct answer)
- [ ] Full-screen Menu
- [ ] Add a leaderboard?
- [x] End the game! Doesn’t quite work right now.
  - [ ] Design this screen
- [ ] Design a footer, about page or other context section
- [ ] Audio?
- [ ] New Avatars for folks who submitted
- [x] Find a way to use a mystery/silhouette avatar for anybody who doesn’t have one
- [x] Environment variables locally and on Github
