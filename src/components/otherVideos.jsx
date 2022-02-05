/**
 * Purpose: Display All other videos in YouTube channel besides Covid-19 related ones.
 * 
 */

//Imports
import React, {useState, useEffect} from 'react';
import Header from "./Header";
import youtubeAPI from '../apis/youtube';
import {alpha,
        Grid, 
        Card,
        CardContent,
        CardMedia,
        InputBase,
        makeStyles,
        Typography,
        Collapse,
        IconButton
    } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';


//Styling
const useStyles = makeStyles((theme) =>({
    toolbar: theme.mixins.toolbar,
    gridContainer:{
        minHeight:"100vh",
    },
    gridItem:{
        alignContent:"stretch",
    },
    search:{
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        border: '1px solid orange',
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

export default function OtherVideos(){
    //Constructors
    const [data,setData] = useState([]);
    const [alert, setAlert] = useState(false);

    //Error Code 403 Message
    const timeOutMsg = "403 Error: The maximum number of Requests to be made for the Day, has been reached."
                       + "Please try again tommorrow.";

    //If app loads or reloads: Populate either from API or from Session Storage.
    useEffect(()=>{
        const stored = sessionStorage.getItem("otherVidData");
        if(stored && data.length === 0){
            //console.log("GETTING NON-COVID SESSION STORED");
            const resData = JSON.parse(stored);
            setData(resData.items);
        }
        else if(data.length === 0 && !stored){
            //console.log("GETTING NON-COVID VIDS");
            async function getOtherVids(){
                // Make sure to filter query so it has nothing to do with keywords used in previous query
                let response = await youtubeAPI.get('search', {params:{
                q:'-COVID -19 -Vaccine -Podcast',
                }}).catch(function(error){
                       console.log("ERROR!!", error.response);
                        if(error.response.error.code === 403){
                           setAlert(true);
                        }
                });
                sessionStorage.setItem("otherVidData", JSON.stringify(response.data));
                setData(response.data.items);
            }
            getOtherVids();
        }
       
    },[data]);

    const classes  = useStyles();

    //If user Searches something, filter data.
    const keyPress = (event) =>{
        if(event.key === 'Enter'){
            event.preventDefault();
            //console.log("EVENT: ", event.target.value);
            const keywords = event.target.value;
            let filteredVids = data.filter(item => item.snippet.title.includes(keywords));
            if(filteredVids.length === 0){
                alert("No Videos in this List match this description, please try other list.")
                setData([]);
            }else{
                
                setData(filteredVids);
            }
            
        }
    }
    return(

         <div className="container">
            
            <Header />

            {/*Alert User in case, nothing is populated in storage and 
            Max API calls are reached */}
            <Collapse in={alert}>
                <Alert action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() =>{
                            setAlert(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                }
                severity="error"
                variant="filled"
                >
                    {timeOutMsg}
                </Alert>
            </Collapse>
             {/*Create space between grid & app bar*/}
            <div className={classes.toolbar}></div>

            {/*Grid Component */}
            <Grid container 
                  direction="column"
                  spacing={3}
                  justifyContent='center'
                  alignItems='center'
            >
            <Grid item xs={12} sm={6} md={3}>
                  <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onKeyDown={keyPress}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
            </Grid>
            {data.length > 0 ?(
                    data.map((item) => (
                        <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
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