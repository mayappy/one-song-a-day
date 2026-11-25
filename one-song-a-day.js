//日付ごとの曲データ
//キーは「月-日」の形式で登録する


let songs = {};

// CSVの1行を正しく読み取る関数
function parseCSVLine(line) {
    const result = [];
    let value = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                value += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === "," && !inQuotes) {
            result.push(value);
            value = "";
        } else {
            value += char;
        }
    }

    result.push(value);
    return result;
}

// CSVを読み込む
async function loadSongs() {
    try {
        const response = await fetch("./hit_songs_366-v2.csv");

        if (!response.ok) {
            throw new Error("CSVファイルを読み込めませんでした");
        }

        const csvText = await response.text();
        const lines = csvText.trim().split(/\r?\n/);

        lines.slice(1).forEach(line => {
            const values = parseCSVLine(line);

            const date = values[0];
            const title = values[1];
            const artist = values[2];
            const genre = values[3];

            songs[date] = {
                title: title,
                artist: artist,
                genre: genre,
                url: ""
            };
        });

        const today = getToday();

        document.getElementById("date-picker").value = today;
        showSong(today);

        console.log("読み込んだ曲数:", Object.keys(songs).length);

    } catch (error) {
        console.error("エラー:", error);
    }
}

// CSVの読み込みを開始
loadSongs();

//曲名を表示する回数
function showSong(dateValue) {
  const date = new Date(dateValue + "T12:00:00");

//月と日を取得
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");

//曲を探すための番号
const key = month + "-" + day;

//該当する曲を表示
const song = songs [key];

//日付を表示
document.getElementById("display-date").textContent =
month + "月" + day + "日";

//曲が登録されていない場合
if (!song) {
  document.getElementById("song-title").textContent =
  "この日の曲は準備中です";

  document.getElementById("artist").textContent =
  "また見に来てね。";

  document.getElementById("genre").textContent = "";

  document.getElementById("music-link").style.display = "none";

  return;
}

//曲の情報を表示
document.getElementById("song-title").textContent = song.title;
document.getElementById("artist").textContent = song.artist;
document.getElementById("genre").textContent = song.genre;

//YouTubeなどのリンクを設定
const link = document.getElementById("music-link");

link.href = song.url ||
 "https://www.youtube.com/results?search_query=" +
 encodeURIComponent(song.title + " " + song.artist);

 link.style.display = "inline-block";
}

//今日の日付を取得する
function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

//サイトを開いたときに今日の曲を表示
const datePicker = document.getElementById("date-picker");

datePicker.value = getToday();
showSong(datePicker.value);

//選んだ日付の曲を表示
document.getElementById("search-button").addEventListener("click", function(){

  if (datePicker.value === ""){
    alert("日付を選択してください。");
    return;
  }

  showSong(datePicker.value);
});

//今日の曲に戻る
document.getElementById("today-button").addEventListener("click", function(){

  datePicker.value = getToday();
  showSong(datePicker.value);

});