import React, { useState, useEffect, useMemo } from "react";
// import { songsData } from "../../data/songs";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { FaRetweet, FaHeart, FaPlay, FaCircle } from "react-icons/fa";
import { orderBy } from "lodash";
import styled from "@emotion/styled";
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
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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

const Discovery = () => {
  const [songsData, setSongsData] = useState([]);
  const [filter, setFilter] = useState("position");
  const [selectedGenre, setSelectedGenre] = useState("pop");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("us");

  // useEffect(() => {
  //   fetch("http://167.99.195.35/api/render2")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("firs Staa", data); // Logging the data
  //       setSongsData(data.data);
  //     });
  // }, []);

  //create a list of songsTag

  const [nfilter, setNfilter] = useState({
    tags: "pop",
    today: "2023-07-25",
    country: "United States",
  });

  const [songList, setSongList] = useState([]);

  const handleChanges = ({ target: { name, value } }) => {
    setNfilter({ ...nfilter, [name]: value });
  };

  function queryReq() {
    return axios
      .get("http://167.99.195.35/api/render2", {
        params: {
          tags: nfilter.tags,
          today: nfilter.today,
          country: nfilter.country,
        },
      })

      .then((res) => {
        console.log("resjs", res);
        setSongList(res.data.data);
      })
      .catch((err) => {
        console.log("new esrr", err);
      });
  }

  useEffect(() => {
    queryReq();
  }, [nfilter.tags, nfilter.country, nfilter.today]);

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

  const allContires = () => {
    const countiresSet = new Set();
    songsData.forEach((song) => {
      countiresSet.add(song.country);
    });
    return Array.from(countiresSet);
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

    if (selectedCountry !== "all") {
      tempSongs = tempSongs.filter((song) => song.country === selectedCountry);
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
  }, [songsData, filter, selectedGenre, selectedDate, selectedCountry]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
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
  const uniqueContires = allContires();
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
          <FilterLabel>Country:</FilterLabel>
          <select name="country" onChange={handleChanges}>
            <option value="United States">United States</option>
            <option value="Germany">Germany</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Netherlands">Netherlands</option>
            <option value="France">France</option>
            <option value="Australia">Australia</option>
            <option value="Brazil">Brazil</option>
            <option value="Poland">Poland</option>
            <option value="Sweden">Sweden</option>
            <option value="Austria">Austria</option>
            <option value="India">India</option>
            <option value="Canada">Canada</option>
            <option value="Turkey">Turkey</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Norway">Norway</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Mexico">Mexico</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Belgium">Belgium</option>
            <option value="Ireland">Ireland</option>
            <option value="Italy">Italy</option>
            <option value="Portugal">Portugal</option>
            <option value="Spain">Spain</option>
            <option value="Denmark">Denmark</option>
            <option value="Finland">Finland</option>
          </select>
        </div>
        <div>
          <div>
            <FilterLabel>Chart Type:</FilterLabel>
            <select name="tags" onChange={handleChanges}>
              <option value="pop">Pop</option>
              {/* <option value="hardstyle">Hard Style</option> */}
              <option value="electronic">Electronic</option>
              <option value="house">House</option>
              <option value="rock">Rock</option>
              <option value="danceedm">Danceedm</option>
              <option value="techno">Techno</option>
              <option value="rbsoul">Rbsoul</option>
              <option value="deephouse">Deephouse</option>
              <option value="ambient">Ambient</option>
              <option value="soundtrack">Soundtrack</option>
              <option value="drumbass">Drumbass</option>
              <option value="trance">Trance</option>
              <option value="country">Country</option>
              <option value="alternativerock">Alternative Rock</option>
              <option value="indie">Indie</option>
              <option value="piano">Piano</option>
            </select>
          </div>
        </div>
        <div>
          <FilterLabel>Filter By Date:</FilterLabel>
          <select name="today" onChange={handleChanges}>
          <option value="2023-07-26">2023-07-26</option>
            {/* Map through the unique dates and create menu items */}
            {/* {uniqueDate.map((date) => (
              <MenuItem key={date} value={date}>
                {console.log("incoming date", date)}
                {date}
              </MenuItem>
            ))} */}
             <option value="2023-07-25">2023-07-25</option>
          </select>
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

export default Discovery;
