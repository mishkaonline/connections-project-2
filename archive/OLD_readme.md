## STEPS TO MAKE COHORT TRIVIA GAME

1. Each Player enters their name

2. (Optional) Each Player is assigned a random color

<!-- 3. There might be a need to initialise a "room" by having each player press start -->

4. A random question is displayed to each player

5. 5 answers are shuffled and displayed, including the correct answer
OK, for now I just added "wrong answers" to the JSON file but I think there's a way to do this on the fly...
- put every possible answer into an array
- in the question object, instead of the answer being a string, it'd be answers[n] where n is the index of that particular answer in the array
- then we'd add 4 more answers with random(answers.length)—could use a for loop here
- we'd need to make sure no answers repeat, possibly by popping them from the array as we go
- Still need to figure out how to shuffle them, that could be a separate function that takes the result of this function as a 0-4 array and scrambles them?

6. Countdown timer starts

7. Player selects an answer

8. Display the correct answer + the one the player chose

<!-- 9. Each player can see what the other players answered (emit) -->

10. Each player is awarded a point for a correct answer
- there should be a score variable attached to player ID
- if answer is correct, score++

11. Scoreboard is updated
(The implementation we have right now should mean this is always being emitted live?)

12. Repeat from step 4 until five questions have been answered

13. Show a results screen including each player's score

14. The player with the most points wins

## REQUIREMENTS

1. Database of questions and answers (optional: wrong answers for each question) - MongoDB (local JSON for now)

2. Ability for new client to join the game and pick a name - socket.io

3. Assign score to client - Socket.io/MongoDB? (Mongo if we want a leaderboard)