import React, {useState, useEffect} from 'react';
import Header from "./Header";
import {alpha,
        Grid, 
        Card,
        CardContent,
        CardMedia,
        InputBase,
        makeStyles,
        Typography
    } from '@material-ui/core';
import youtubeAPI from '../apis/youtube';
import SearchIcon from '@material-ui/icons/Search'
//const playlistId = 'PLogA9DP2_vSekxHP73PXaKD6nbOK56CJw';
 const useStyles = makeStyles((theme) =>({
    toolbar: theme.mixins.toolbar,
    gridContainer:{
        minHeight:"100vh",
    },
    media:{
        width:"80%",
    },
    search:{
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        border: "1px solid orange",
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
        }
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
        width: '20ch',
        },
    },
 }));
export default function CovidVideos(){
    const [data,setData] = useState([]);
    useEffect(()=>{
       const stored = sessionStorage.getItem("covidVidData");
       if(stored && data.length === 0){
         console.log("GETTING FROM COVID SESSION STORED");
         const resData = JSON.parse(stored);
         setData(resData.items);
       }
       else if(data.length === 0 && !stored){
            async function getCovidVids(){
                console.log("GETTING COVID VIDS")
                let response = await youtubeAPI.get('/search', {params:{
                    q:'COVID-19 Vaccine Podcast',
                }}).catch(function(error){
                       console.log("ERROR!!", error.response);
                });
                sessionStorage.setItem("covidVidData", JSON.stringify(response.data));
                setData(response.data.items);
            }
           getCovidVids();
       }
    },[data]);
    const classes  = useStyles();
    const keyPress = (event) =>{
        if(event.key === 'Enter'){
            event.preventDefault();
            console.log("EVENT: ", event.target.value);
            const keywords = event.target.value;
            let filteredVids = data.filter(item => item.snippet.title.includes(keywords));
            if(filteredVids.length === 0){
                alert("No Videos in this List match this description, please try other list.")
                setData([]);
            }else{
                console.log("DATA1:", filteredVids);
                setData(filteredVids);
            }
            
        }
    }
    return(
        <div className="container">
            <Header />
            {/*Create space between grid & app bar*/}
            <div className={classes.toolbar}> </div>
                <Grid container 
                      direction="column"
                      spacing={3}
                      justifyContent='center'
                      alignItems='center'
                      className={classes.gridContainer}
                >
                <Grid xs={12} sm={6} md={3}>
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
                    onKeyDown={keyPress}
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </div>
                </Grid>
                {/**Take Json input from search term and display items in Card. */}
                {data.length > 0 ?(
                    data.map((item) => (
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                  <CardMedia 
                                             component="iframe"
                                             title="test"
                                             src={`https://www.youtube.com/embed/${item.id.videoId}`}  
                                    />
                                    <CardContent>
                                        <Typography align="center" gutterBottom variant="h5">{item.snippet.title}</Typography>
                                        <Typography align="left" variant="subtitle">Description:{item.snippet.description !==""? 
                                                            item.snippet.description : "Not Available"}</Typography> 
                                        <Typography align="left" paragraph>Date: {item.snippet.publishedAt.substring(0,10)}</Typography>
                                    </CardContent>
                            </Card>
                        </Grid>
                ))   
                ):(
                    <Grid item xs={12}>
                        <Typography variant="h5">No Such Videos Exist in this Category. Please try the Other List.</Typography>
                    </Grid>
                    
                )}
                </Grid>
        </div>
    );
}