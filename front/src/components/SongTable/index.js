import React, { useState, useEffect, useMemo } from "react";
// import { songsData } from "../../data/songs";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { FaRetweet, FaHeart, FaPlay, FaCircle } from "react-icons/fa";
import { orderBy } from "lodash";
import styled from "@emotion/styled";
import "./styles.css";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";

const PositionCell = styled(TableCell)`
  /* display: flex; */
  align-items: center;
  /* flex-direction: column; */
  justify-content: center;
  color: #b3b3b3;
`;

const SongTitleCell = styled(TableCell)`
  font-weight: bold;
  color: #fff;
`;

const TableContainerStyled = styled(TableContainer)`
  background-color: #282828;
  margin-top: 20px;
  border-radius: 15px;
`;

const NewEntryIcon = styled(FaCircle)`
  color: blue;
  font-size: 12px;
  /* margin-right: 8px; */
`;

const SamePosition = styled(FaCircle)`
  color: white;
  font-size: 12px;
  /* margin-right: 8px; */
`;

const UpArrowIcon = styled(AiOutlineArrowUp)`
  color: #1db954;
  font-size: 12px;
  /* margin-left: 4px; */
`;

const DownArrowIcon = styled(AiOutlineArrowDown)`
  color: #f44336;
  font-size: 12px;
  /* margin-left: 4px; */
`;
const LikeIcon = styled(FaHeart)`
  color: #ff5500;
  font-size: 16px;
  margin-right: 4px;
`;

const RepostIcon = styled(FaRetweet)`
  color: #ff5500;
  font-size: 16px;
  margin-right: 4px;
`;

const PlayIcon = styled(FaPlay)`
  color: #ff5500;
  font-size: 16px;
  margin-right: 4px;
`;
const StyledTableCell = styled(TableCell)`
  color: #b3b3b3;
`;

const StyledTableHeadCell = styled(TableCell)`
  color: #b3b3b3;
  font-weight: bold;
`;

const SongTableContainer = styled.div`
  background-color: #121212;
  min-height: 100vh;
  padding: 20px;
`;

const ChartTitle = styled.h1`
  text-align: center;
  color: #fff;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FilterLabel = styled.span`
  color: #fff;
  margin-right: 8px;
`;

const FilterSelect = styled(Select)`
  color: #fff;
  margin-right: 16px;
`;

const IframeContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SongTable = () => {
  const [songsData, setSongsData] = useState([]);
  const [filter, setFilter] = useState("position");
  const [selectedGenre, setSelectedGenre] = useState("hardstyle");
  const [selectedDate, setSelectedDate] = useState("all");

  const currentDate = new Date(); // Get the current date
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const [songList, setSongList] = useState([]);

  const [nFilter, setNFilter] = useState({
    tags: "",
    today: "2023-07-25",
  });

  const handleChange = ({ target: { name, value } }) => {
    setNFilter({ ...nFilter, [name]: value });
  };

  function handleSubmit() {
    return axios
      .get("http://167.99.195.35/api/render", {
        params: { tags: nFilter.tags, today: nFilter.today },
      })

      .then((res) => {
        console.log("new res", res);
        setSongList(res.data.data);
      })
      .catch((err) => {
        console.log("new err", err);
      });
  }
  useEffect(() => {
    handleSubmit();
  }, [nFilter.tags]);

  const getUniqueTags = () => {
    const tagsSet = new Set();
    songsData.forEach((song) => {
      tagsSet.add(song.tags);
    });
    return Array.from(tagsSet);
  };

  const allDates = () => {
    const datesSet = new Set();
    songsData.forEach((song) => {
      datesSet.add(song.today);
    });
    return Array.from(datesSet);
  };

  // Extract all today dates from songsData
  // const allDates = useMemo(() => {
  //   return songsData.map((song) => song.today);
  // }, [songsData]);

  // // Step 2: Get a list of unique dates
  // const uniqueDates = useMemo(() => {
  //   const dateSet = new Set(allDates);
  //   return Array.from(dateSet);
  // }, [allDates]);

  const filteredSongs = useMemo(() => {
    let tempSongs = [...songsData]; // create a copy of songsData

    switch (filter) {
      case "mostPlayed":
        tempSongs = orderBy(tempSongs, ["sound_play"], ["desc"]);
        break;
      case "newlyAdded":
        tempSongs = orderBy(tempSongs, ["sound_release"], ["desc"]);
        break;
      default:
        tempSongs = orderBy(tempSongs, ["current_position"], ["asc"]);
    }

    if (selectedGenre !== "all") {
      tempSongs = tempSongs.filter((song) => song.tags === selectedGenre);
    }

    if (selectedDate !== "all") {
      tempSongs = tempSongs.filter((song) => {
        const songDate = new Date(song.today);
        const filterDate = new Date(selectedDate);
        return (
          songDate.toISOString().slice(0, 10) ===
          filterDate.toISOString().slice(0, 10)
        );
      });
    }

    return tempSongs;
  }, [songsData, filter, selectedGenre, selectedDate]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const getSoundCloudEmbedUrl = (song) => {
    if (!song.link || !song.link.includes("soundcloud.com")) {
      return null;
    }

    const embedUrl = song.link.replace(
      "https://soundcloud.com/",
      "https://w.soundcloud.com/player/?url=https://soundcloud.com/"
    );
    return embedUrl;
  };

  const formatPlays = (plays) => {
    if (plays >= 1000000) {
      return (plays / 1000000).toFixed(1) + "M";
    } else if (plays >= 1000) {
      return (plays / 1000).toFixed(1) + "K";
    } else {
      return plays;
    }
  };

  const uniqueTags = getUniqueTags();
  const uniqueDate = allDates();

  return (
    <SongTableContainer>
      <ChartTitle>Top Chart</ChartTitle>
      <FilterContainer>
        <div>
          <FilterLabel>Sort By:</FilterLabel>
          <FilterSelect value={filter} onChange={handleFilterChange}>
            <MenuItem value={"position"}>Position</MenuItem>
            <MenuItem value={"mostPlayed"}>Most Played</MenuItem>
            <MenuItem value={"newlyAdded"}>Newly Added</MenuItem>
          </FilterSelect>
        </div>
        <div>
          <div>
            <FilterLabel>select tags:</FilterLabel>
            <select className="select" name="tags" onChange={handleChange}>
              <option value="all">All tags</option>
              <option value="hardstyle">Hard Style</option>
              <option value="tekko">Tekko</option>
              <option value="hardtrekk">Hard Trekk</option>
              <option value="tekk">Tekk</option>
              <option value="drill">Drill</option>
              <option value="phonk">Phonk</option>
              <option value="lofi">Lofi</option>
              <option value="lo-fi">Lo-Fi</option>
              <option value="tiktok">TikTok</option>
              <option value="sped-up">Sped Up</option>
              <option value="spedup">spedup</option>
              <option value="slowed">Slowed</option>
              <option value="remix">Remix</option>
              <option value="viral">Viral</option>
              <option value="rap techno">Rap Techno</option>
            </select>
          </div>
        </div>
        <div>
          <FilterLabel>Filter By Date:</FilterLabel>
          <FilterSelect value={selectedDate} onChange={handleDateChange}>
            <MenuItem value="all">All Dates</MenuItem>
            {/* Map through the unique dates and create menu items */}
            {uniqueDate.map((date) => (
              <MenuItem key={date} value={date}>
                {console.log("incoming date", date)}
                {date}
              </MenuItem>
            ))}
          </FilterSelect>
        </div>
      </FilterContainer>
      <TableContainerStyled component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Position</StyledTableHeadCell>
              <StyledTableHeadCell># 7d/ago</StyledTableHeadCell>
              <StyledTableHeadCell>Track-Name</StyledTableHeadCell>

              <StyledTableHeadCell>Soundcloud</StyledTableHeadCell>

              <StyledTableHeadCell>Spotify-Search</StyledTableHeadCell>

              <StyledTableHeadCell>Competitor-Track</StyledTableHeadCell>
              <StyledTableHeadCell>Competitor</StyledTableHeadCell>
              <StyledTableHeadCell></StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log("songs", songList)}
            {songList.map((song) => (
              <TableRow key={song.current_position}>
                <PositionCell>
                  <div
                    style={{
                      // marginLeft: 10,
                      marginTop: 10,
                    }}
                  >
                    {song.current_position}
                  </div>

                  <div>
                    {song.previous_position === null ? (
                      <SamePosition />
                    ) : song.previous_position < song.current_position ? (
                      <DownArrowIcon />
                    ) : song.previous_position > song.current_position ? (
                      <UpArrowIcon />
                    ) : song.previous_position === song.current_position ? (
                      <NewEntryIcon />
                    ) : null}
                  </div>
                </PositionCell>
                <SongTitleCell></SongTitleCell>
                <SongTitleCell>{song.title}</SongTitleCell>

                <StyledTableCell>
                  <div>
                    <span>
                      {song.link && song.link.includes("soundcloud.com") ? (
                        <iframe
                          title={song.title}
                          width="350"
                          height="95"
                          scrolling="no"
                          frameBorder="no"
                          allow="autoplay"
                          src={getSoundCloudEmbedUrl(song)}
                        />
                      ) : null}
                    </span>

                    <div style={{ display: "flex", marginTop: 10 }}>
                      <span style={{ marginRight: 20 }}>
                        <LikeIcon />{" "}
                        <span style={{ color: "#fff", fontWeight: "bold" }}>
                          {formatPlays(song.sound_likes)}
                        </span>
                      </span>

                      <span style={{ marginRight: 20 }}>
                        <RepostIcon />{" "}
                        <span style={{ color: "#fff", fontWeight: "bold" }}>
                          {formatPlays(song.sound_repost)}
                        </span>
                      </span>

                      <span style={{ marginRight: 20 }}>
                        <PlayIcon />{" "}
                        <span style={{ color: "#fff", fontWeight: "bold" }}>
                          {formatPlays(song.sound_play)}
                        </span>
                      </span>

                      <span style={{ fontWeight: "bold", color: "#ff5500" }}>
                        RD:
                      </span>
                      <span style={{ color: "#fff", fontWeight: "bold" }}>
                        {" "}
                        {new Date(song.sound_release).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </StyledTableCell>

                <SongTitleCell>
                  <a
                    href={song.spot_url}
                    target="blank"
                    style={{
                      color: "#ff5500",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    {song.spot_name}
                  </a>
                </SongTitleCell>

                <SongTitleCell>
                  <a
                    href={song.comp_url}
                    target="blank"
                    style={{
                      color: "#ff5500",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    {song.comp_name}
                  </a>
                </SongTitleCell>

                <SongTitleCell>{song.comp_artist}</SongTitleCell>

                <StyledTableCell>{song.song_time}</StyledTableCell>

                {/* <StyledTableCell>{song.likes}</StyledTableCell>
                <StyledTableCell>{song.reposts}</StyledTableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainerStyled>
      <IframeContainer id="player-container"></IframeContainer>
    </SongTableContainer>
  );
};

export default SongTable;
