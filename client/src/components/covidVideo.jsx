/**
 * Purpose: Display Covid-19 related videos in YouTube.
 *
 */

//Imports
import React, { useState, useEffect } from "react";
import Header from "./Header";
import {
  alpha,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
  InputBase,
  makeStyles,
  Modal,
  Typography,
  Collapse,
} from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";

//const playlistId = 'PLogA9DP2_vSekxHP73PXaKD6nbOK56CJw';

//Styling
const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  gridContainer: {
    minHeight: "100vh",
    paddingBottom: theme.spacing(10),
  },
  card: {
    height: "400 px",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid orange",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  modal:{
    position: 'absolute',
    verticalAlign:"middle",
    paddingLeft:"25%",
    paddingRight:"25%",
    paddingTop:"25%",
    border: '2px solid #000'
  },
  modalCard:{
    flexDirection:'row',
    display:'flex',
    alignItems:'stretch',
    height:"75%",
  },
  modalMedia:{
    flexGrow: 1,
  }

}));


export default function CovidVideos() {
  //Consructors
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [notFound, setNotFound] = useState(false);

  //set Video Data
  const [videoInfo, setVideoInfo] = useState({
    'title': "",
    'src': ""
  });
  const [hideVideo, setHideVideo] = useState(false);

  //403 Error Msg
  const timeOutMsg =
    "403 Error: The maximum number of Requests to be made for the Day, has been reached." +
    "Please try again tommorrow. ";

  //If app loads or reloads: Populate either from API or from Session Storage.
  useEffect(() => {
    const stored = sessionStorage.getItem("covidVidData");
    if (stored && data.length === 0) {
      console.log("GETTING FROM COVID SESSION STORED");
      const resData = JSON.parse(stored);
      setData(resData);
    } else if (data.length === 0 && !stored) {
      async function getCovidVids() {
        // console.log("IN COVID method!");
        await fetch('api/getCovidVideos')
        .then((res)=>res.json())
        .then((items) =>{
          //console.log("RESJSON:",items);
          sessionStorage.setItem("covidVidData", JSON.stringify(items));
          setData(items);
        })
        .catch(function(error){
          console.error(error)
          if(error['code'] === 403){
            setAlert(true);
          }
        });
      }
      getCovidVids();
    }
  }, [data, alert]);

  const classes = useStyles();

  const keyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const keywords = event.target.value;
      let filteredVids = data.filter((item) =>
        item.snippet.title.toLowerCase().includes(keywords.toLowerCase())
      );
      if (filteredVids.length === 0) {
        setNotFound(true);
        const item = JSON.parse(sessionStorage.getItem("covidVidData"));
        setData(item);
      } else {
        setData(filteredVids);
      }
    }
  };
  const handleBlank = (event) => {
    if (event.target.value === "") {
      const item = JSON.parse(sessionStorage.getItem("covidVidData"));
      setData(item);
    }
  };

  const closeVideo = ()=>{
    setHideVideo(false);  
  };
  return (
    <div className={classes.container}>
      <Header />
      {/*Show alert */}
      <Collapse in={notFound}>
        <Alert
          variant="filled"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setNotFound(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Video not found in this list, please Make this search in Non-Covid
          Video. Otherwise, this video may no longer exist in the HCA Healthcare
          Channel.
        </Alert>
      </Collapse>
      <Collapse in={alert}>
        <Alert
          variant="filled"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {timeOutMsg}
        </Alert>
      </Collapse>

      {/*Create space between grid & app bar*/}
      <div className={classes.toolbar}> </div>

      {/*Render YouTube Videos in Components*/}
      <Grid
        container
        direction="row"
        spacing={3}
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Videos..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              fullWidth={true}
              onKeyDown={keyPress}
              onChange={handleBlank}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Grid>
        {/**Take Json input from search term and display items in Card. */}
        {data.length > 0 ? (
          data.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              component={Card}
              className={classes.card}
            >
              <CardActionArea onClick={() => {
                console.log('Title:', item.snippet.title);
                setVideoInfo({
                  'title': item.snippet.title,
                  'src': `https://www.youtube.com/embed/${item.id.videoId}`
                });
                setHideVideo(true);
              }}>
                  <CardMedia
                    component="img"
                    title={item.snippet.title}
                    //src={`https://www.youtube.com/embed/${item.snippet.}`}
                    src={item['snippet']['thumbnails']['medium']['url']}
                    
                  />
                  <CardContent>
                    <Typography
                      align="center"
                      gutterBottom
                      variant="h5"
                      component="h2"
                    >
                      {item.snippet.title}
                    </Typography>
                    <Typography align="left" variant="subtitle">
                      Description:
                      {item.snippet.description !== ""
                        ? item.snippet.description
                        : "Not Available"}
                    </Typography>
                    <Typography align="left" paragraph>
                      Date: {item.snippet.publishedAt.substring(0, 10)}
                    </Typography>
                  </CardContent>
              </CardActionArea>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center">
              No Videos Found in Library. Please contact admin if "403 Error"
              message is not showing
            </Typography>
          </Grid>
        )}
      </Grid>
      <Modal open={hideVideo} 
             onClose={closeVideo}
              className={classes.modal}
              >
        <Card xs={12} sm={6} md={3} className={classes.modalCard}>
              <CardMedia className={classes.modalMedia} 
                         component="iframe" title={videoInfo.title} 
                         src={videoInfo.src} 
                         allowFullScreen
                         allow="autoPlay" 
                         />
        </Card>
      </Modal>
      {/* <Grid container direction="column">
        <Grid item xs={12} sm={6} md={9} component={Card} className={classes.card}>
          <CardMedia component="iframe" title={videoInfo.title} src={videoInfo.src} allowFullScreen/>
        </Grid>
      </Grid> */}
    </div>
  );
}
