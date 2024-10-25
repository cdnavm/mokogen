document.getElementById('type').addEventListener('change', function() {
    let type = document.getElementById('type').value;

    if (type === 'series') {
        document.getElementById('watchLink').style.display = 'none'; // Hide movie input
        document.getElementById('seriesLinks').style.display = 'block'; // Show series inputs
        document.getElementById('phaserCodeSection').style.display = 'block'; // Show Phaser code
    } else {
        document.getElementById('watchLink').style.display = 'block'; // Show movie input
        document.getElementById('seriesLinks').style.display = 'none'; // Hide series inputs
        document.getElementById('phaserCodeSection').style.display = 'none'; // Hide Phaser code
    }
});

// Add new episode link input
document.getElementById('addLink').addEventListener('click', function() {
    const linksContainer = document.getElementById('links-container');
    const newLinkInput = document.createElement('input');
    newLinkInput.type = 'text';
    newLinkInput.classList.add('episode-link');
    newLinkInput.placeholder = `Enter Episode ${linksContainer.children.length + 1} Link`;
    linksContainer.appendChild(newLinkInput);
});

// Remove the last episode link input
document.getElementById('removeLink').addEventListener('click', function() {
    const linksContainer = document.getElementById('links-container');
    if (linksContainer.children.length > 1) { // Keep at least one input field
        linksContainer.removeChild(linksContainer.lastChild);
    }
});

// Function to handle the conversion of escaped HTML
function convertEscapedHTML() {
    const inputArea = document.getElementById('inputArea');
    const outputArea = document.getElementById('outputArea');

    const unescapedHTML = inputArea.value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    outputArea.innerHTML = unescapedHTML;
}

document.getElementById('generate').addEventListener('click', function() {
    let tmdbId = document.getElementById('tmdbId').value;
    let type = document.getElementById('type').value;

    if (type === 'movie') {
        let watchLink = document.getElementById('watchLink').value; // Movie watch link
        // Fetch movie details
        fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=c7b50dfee83f6acf6f5ba85291b9e8a7&language=en-US`)
        .then(response => response.json())
        .then(data => {
            // Fetch credits separately
            fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/credits?api_key=c7b50dfee83f6acf6f5ba85291b9e8a7`)
            .then(response => response.json())
            .then(credits => {
                let title = data.title || data.name;
                let posterUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
                let rating = data.vote_average;
                let duration = data.runtime || data.episode_run_time[0];
                let genres = data.genres.map(g => g.name).join(', ');
                let description = data.overview;
                let releaseDate = data.first_air_date;
                let director = credits.crew.find(member => member.job === 'Director')?.name || 'N/A';
                let cast = credits.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A';

                let generatedPost = `
                    <!-- BADGE -->
                    <!-- Add_Badge_Here -->
                    <!-- BADGE -->
                    <div class="rcimg-cover">
                       <button id="toMiddle">
                          <div class="play-video"></div>
                       </button>
                       <span class="bigcover"> </span>
                    </div>
                    <div class="goomsite-movie">
                       <div class="goomsite-left">
                          <div class="rcimg">
                             <div class="rec-image">
                                <div class="separator" style="clear: both;">
                                   <!--Add Your Poster Image Here-->
                                   <div class="separator" style="clear: both;">
                                      <a href="${posterUrl}" style="display: block; text-align: center;">
                                      <img alt="${title}" border="0" height="320" src="${posterUrl}" />
                                      </a>
                                   </div>
                                   <!--End Add Your Poster Image Here-->
                                </div>
                             </div>
                          </div>
                       </div>
                       <div class="goomsite-right">
                          <!--Your Movie Title Here-->
                          <h1>${title}</h1>
                          <!--End Your Movie Title Here-->
                          <fieldset class="rating">
                             <input id="star5" name="rating" type="radio" value="5" />
                             <label class="full"></label>
                             <input checked="" id="star4" name="rating" type="radio" value="4" />
                             <label class="half"></label>
                             <input id="star3" name="rating" type="radio" value="3" />
                             <label class="full"></label>
                             <input id="star2" name="rating" type="radio" value="2" />
                             <label class="full"></label>
                             <input id="star1" name="rating" type="radio" value="1" />
                             <label class="full"></label>
                             <span class="likes">Rating ${rating}</span> <!-- Rating -->
                          </fieldset>
                          <!--Add Your Movies Details Here-->
                          <div class="m-description">
                             <span class="m-des">Type: Movie</span>
                             <span class="m-des">Duration: ${duration} min</span>
                             <span class="m-des">Quality: HD</span>
                             <span class="m-des">Release: ${releaseDate}</span>
                             <span class="m-des">Genre: ${genres}</span>
                             <span class="m-des">Director: ${director}</span>
                             <span class="m-des">Cast: ${cast}</span>
                             <span class="m-des">Upload By Admin</span>
                             <!--End Your Movies Details Here-->
                          </div>
                       </div>
                    </div>
                    <div class="postmovie">
                       <i class="fas fa-fire"></i><b> Description :</b>
                       <!--Movies Description Here-->
                       <p>${description}</p>
                       <!--End Movies Description Here-->
                       <div class="alert info">
                          <b>Notice:</b>
                          Our Website do not own any copyright documents, if Our Website have violated any
                          laws please let me know i will remove that movies.
                       </div>
                       Thank you for support
                       <a href="mokoehbi.blogspot.com"> Mokoehbi</a>
                       <p></p>
                    </div>
                    <!-- Use Embedded movie here ! -->
                    <!--Stream Player by Twinkling Watermelon-->
                    <div class="box_stream">
                       <iframe style="height: 450px;width: 100%;" src="${watchLink}" allowfullscreen></iframe>
                    </div>
                `;
                document.getElementById('output').innerText = generatedPost;
            });
        });
    }  else if (type === 'series') {
        let episodeLinks = [...document.querySelectorAll('.episode-link')].map(input => input.value); // Collect episode links
        // Fetch series details
        fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=c7b50dfee83f6acf6f5ba85291b9e8a7&language=en-US`) // 'tv' for series
        .then(response => response.json())
        .then(data => {
            // Fetch credits separately
            fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/credits?api_key=c7b50dfee83f6acf6f5ba85291b9e8a7`)
            .then(response => response.json())
            .then(credits => {
                let title = data.name;
                let posterUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
                let rating = data.vote_average;
                let duration = data.episode_run_time ? data.episode_run_time[0] : 'N/A';
                let genres = data.genres.map(g => g.name).join(', ');
                let description = data.overview;
                let releaseDate = data.first_air_date;
                let director = credits.crew.find(member => member.job === 'Director')?.name || 'N/A';
                let cast = credits.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A';

                let episodeScript = `
                                        &lt;script&gt;
                        var video_listx = ${JSON.stringify(episodeLinks)};
                    &lt;/script&gt;
                `;

                let generatedPost = `
                    <!-- BADGE -->
                    <!-- Add_Badge_Here -->
                    <!-- BADGE -->
                    <div class="rcimg-cover">
                       <button id="toMiddle">
                          <div class="play-video"></div>
                       </button>
                       <span class="bigcover"> </span>
                    </div>
                    <div class="goomsite-movie">
                       <div class="goomsite-left">
                          <div class="rcimg">
                             <div class="rec-image">
                                <div class="separator" style="clear: both;">
                                   <!--Add Your Poster Image Here-->
                                   <div class="separator" style="clear: both;">
                                      <a href="${posterUrl}" style="display: block; text-align: center;">
                                      <img alt="${title}" border="0" height="320" src="${posterUrl}" />
                                      </a>
                                   </div>
                                   <!--End Add Your Poster Image Here-->
                                </div>
                             </div>
                          </div>
                       </div>
                       <div class="goomsite-right">
                          <!--Your Series Title Here-->
                          <h1>${title}</h1>
                          <!--End Your Series Title Here-->
                          <fieldset class="rating">
                             <input id="star5" name="rating" type="radio" value="5" />
                             <label class="full"></label>
                             <input checked="" id="star4" name="rating" type="radio" value="4" />
                             <label class="half"></label>
                             <input id="star3" name="rating" type="radio" value="3" />
                             <label class="full"></label>
                             <input id="star2" name="rating" type="radio" value="2" />
                             <label class="full"></label>
                             <input id="star1" name="rating" type="radio" value="1" />
                             <label class="full"></label>
                             <span class="likes">Rating ${rating}</span> <!-- Rating -->
                          </fieldset>
                          <!--Add Your Series Details Here-->
                          <div class="m-description">
                             <span class="m-des">Type: Series</span>
                             <span class="m-des">Duration: ${duration} min</span>
                             <span class="m-des">Quality: HD</span>
                             <span class="m-des">Release: ${releaseDate}</span>
                             <span class="m-des">Genre: ${genres}</span>
                             <span class="m-des">Director: ${director}</span>
                             <span class="m-des">Starring: ${cast}</span>
                             <span class="m-des">Upload By Admin</span>
                             <!--End Your Series Details Here-->
                          </div>
                       </div>
                    </div>
                    <div class="postmovie">
                       <i class="fas fa-fire"></i><b> Description :</b>
                       <!--Series Description Here-->
                       <p>${description}</p>
                       <div class="alert info">
                          <b>Notice:</b>
                          Our Website do not own any copyright documents, if Our Website have violated any
                          laws please let me know i will remove that movies.
                       </div>
                       Thank you for support
                       <a href="mokoehbi.blogspot.com"> Mokoehbi</a> <!-- Change "Mokoehbi" to your Website Name -->
                       <p></p>
                    </div>
                    <div class="border-video">
                       <div class="show-video respon-vdo">
                          <a class="button-eps" data-eps="You are watching the episode 1" data-id="0">
                             <div class="play-video"></div>
                          </a>
                          <img class="mybackgroundx" />
                       </div>
                       <span class="video-title">Click Your Episode</span>
                       <div class="tab-eps video-epsx">
                          ${episodeScript} <!-- Series Handler -->
                       </div>
                    </div>
                `;
                document.getElementById('output').innerText = generatedPost;
            });
        });
    }
});
  document.getElementById('copy').addEventListener('click', function() {
    let generatedPost = document.getElementById('output').innerText; // Get the generated post content
    
    navigator.clipboard.writeText(generatedPost).then(function() {
        alert("Post copied to clipboard! & This post generator Made by 'Sy-Equinox' & 'AVM-Themes'");
    }).catch(function(error) {
        alert("Failed to copy: " + error);
    });
});
