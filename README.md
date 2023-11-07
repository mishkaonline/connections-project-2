## STEPS TO MAKE COHORT TRIVIA GAME

1. Each Player enters their name

2. (Optional) Each Player is assigned a random color

<!-- 3. There might be a need to initialise a "room" by having each player press start -->

4. A random question is displayed to all players

5. 5 answers are shuffled and displayed to all players, including the correct answer

6. Countdown timer starts

7. Each player selects an answer

8. Once all players have selected or the timer is up, the correct answer is displayed to all players

9. Each player can see what the other players answered (emit)

10. Each player is awarded points for correct answers

11. Scoreboard is updated

12. Repeat from step 4 until five questions have been answered

13. Show a results screen including each player's score

14. The player with the most points wins

## REQUIREMENTS

1. Database of questions and answers (optional: wrong answers for each question) - MongoDB

2. Ability for new client to join the game and pick a name - Socket.io

3. Assign score to client - Socket.io/MongoDB?