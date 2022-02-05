import React from 'react';
import {Link} from "react-router-dom";
import { AppBar, 
         CssBaseline,   
         makeStyles, 
         Toolbar,
         Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justify: 'space-between',
  },
  appBar:{
    backgroundColor: "#e05929",
    color: "#fff",
    position: "static",
  },
  barItems:{
    paddingLeft: 13,
    color: 'inherit',
    textDecoration: 'inherit'
  }, 
  title: {
    marginRight: theme.spacing(2),
    flexGrow: 1
  },
}));

export default function Header() {
    //#e05929;
    const classes = useStyles();
   
    //console.log("KEY WORD: ", keyword);
      return(
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h5" noWrap className={classes.title}>
                        HCA Healthcare Video Library
                    </Typography>
                    <Link to="/" className={classes.barItems}>
                      <Typography variant="h6" textAlign="center">Covid Videos</Typography>
                    </Link>
                    <Link to="/:otherVideos" className={classes.barItems}>
                      <Typography variant="h6" textAlign="center" >Other Videos</Typography>
                    </Link>
                </Toolbar>
            </AppBar>
        </div> 
    );
}
