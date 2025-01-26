const moment = require("moment");

class Movie {
  constructor(id, title, description, genre, duration, release, stars, screening, hallno, rating, lang, poster) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.genre = genre;
    this.duration = duration;
    this.release = release;
    this.stars = stars;
    this.screening = screening;
    this.hallno = hallno;
    this.rating = rating;
    this.lang = lang;
    this.poster = poster;
  }

  // Static method to map database row to Movie model
  // mapper to map the datafields from database to our movie Model
  static fromRow(row) {
    return new Movie(
      row.movie_id,         // Map movie_id to id
      row.movie_title,
      row.movie_desc,       
      row.movie_genre,
      row.movie_duration,
      row.movie_release,
      row.movie_stars,
      row.movie_screeningtime,
      row.movie_hallno,
      row.movie_rating,
      row.movie_lang,
      row.movie_poster,
    );
  }
}

module.exports = Movie;
