window.addEventListener('load', () => {

    // fetch the leaderboard data
    fetch('/getLeaderboard')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let leaderboard = data.leaderboard;

            // sort first by score, then by fastest time
            leaderboard.sort((a, b) => {
                if (a.score === b.score) {
                    return a.time - b.time;
                }
                return b.score - a.score;
            });

            // create a div for all entries
            // let index = document.createElement('div');


            // create an entry for each player, only the top 10
            leaderboard.slice(0, 10).forEach((player, index) => {
                let entry = document.createElement('div');
                entry.setAttribute('class', 'lb-entry');

                let rank = document.createElement('p');
                rank.setAttribute('class', 'lb-rank');
                rank.textContent = index + 1;
                entry.appendChild(rank);

                let name = document.createElement('p');
                name.setAttribute('class', 'lb-name');
                name.textContent = player.name;
                entry.appendChild(name);

                let score = document.createElement('p');
                score.setAttribute('class', 'lb-score');
                score.textContent = player.score;
                entry.appendChild(score);

                let time = document.createElement('p');
                time.setAttribute('class', 'lb-time');
                time.textContent = player.time / 1000 + 's';
                entry.appendChild(time);


                let date = document.createElement('p');
                date.setAttribute('class', 'lb-date');
                // format date as "Month DD"
                let dateObj = new Date(player.date);
                let month = dateObj.toLocaleString('default', { month: 'short' });
                date.textContent = month + ' ' + dateObj.getDate();

                entry.appendChild(date);

                document.getElementById('leaderboard').appendChild(entry);

            });

            // append the index to the leaderboard div
            // document.getElementById('leaderboard').appendChild(index);

            // leaderboard.sort((a, b) => b.score - a.score);
            // console.log(leaderboard);

            // // create a table element
            // let table = document.createElement('table');
            // table.setAttribute('class', 'table table-striped');

            // // create a header row
            // let headerRow = document.createElement('tr');
            // let headerName = document.createElement('th');
            // headerName.textContent = 'Name';
            // headerRow.appendChild(headerName);
            // let headerScore = document.createElement('th');
            // headerScore.textContent = 'Score';
            // headerRow.appendChild(headerScore);
            // table.appendChild(headerRow);

            // // create a row for each player
            // leaderboard.forEach((player, index) => {
            //     let row = document.createElement('tr');
            //     let name = document.createElement('td');
            //     name.textContent = player.name;
            //     row.appendChild(name);
            //     let score = document.createElement('td');
            //     score.textContent = player.score;
            //     row.appendChild(score);
            //     table.appendChild(row);
            // });

            // // append the table to the leaderboard div
            // document.getElementById('leaderboard').appendChild(table);
        });
}
);