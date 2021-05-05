import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  picker: {
    width: "100%",
    "& div": {
      borderRadius: 4,
      padding: 6,
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
}))(Button);

const now = new Date();
const h = now.getHours();
const m = now.getMinutes();

const App = () => {
  const classes = useStyles();
  const [value, onChange] = useState(["8:00", `${h}:${m}`]);
  const [travelTimeHours, setTravelTimeHours] = useState("0");
  const [travelTimeMinutes, setTravelTimeMinutes] = useState("0");
  const [result, setResult] = useState();
  const [rounded, setRounded] = useState();
  const [rate, setRate] = useState(120);
  const [labourTime, setLabourTime] = useState();
  const [trav, setTrav] = useState();

  const onlyNumbers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const resetCalculator = () => {
    onChange(["8:00", `${h}:${m}`]);
    setTravelTimeHours("0");
    setTravelTimeMinutes("0");
    setResult(null);
    setRounded(null);
    setRate(120);
  };

  const timeStringToFloat = (time) => {
    var hoursMinutes = time.split(":");
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  };

  const calculateTime = (start, finish, travelTimeHours, travelTimeMinutes) => {
    let ary1 = start.split(":");
    let ary2 = finish.split(":");
    // let ary3 = travel.split(":");
    let minsdiff =
      parseInt(travelTimeHours, 10) * 60 +
      parseInt(travelTimeMinutes, 10) +
      parseInt(ary2[0], 10) * 60 +
      parseInt(ary2[1], 10) -
      parseInt(ary1[0], 10) * 60 -
      parseInt(ary1[1], 10);
    let labour =
      parseInt(ary2[0], 10) * 60 +
      parseInt(ary2[1], 10) -
      parseInt(ary1[0], 10) * 60 -
      parseInt(ary1[1], 10);
    let travel =
      parseInt(travelTimeHours, 10) * 60 + parseInt(travelTimeMinutes, 10);
    setLabourTime(
      String(100 + Math.floor(labour / 60)).substr(1) +
        ":" +
        String(100 + (labour % 60)).substr(1)
    );
    setTrav(
      String(100 + Math.floor(travel / 60)).substr(1) +
        ":" +
        String(100 + (travel % 60)).substr(1)
    );
    roundTime(
      String(100 + Math.floor(minsdiff / 60)).substr(1) +
        ":" +
        String(100 + (minsdiff % 60)).substr(1),
      15
    );

    setResult(
      String(100 + Math.floor(minsdiff / 60)).substr(1) +
        ":" +
        String(100 + (minsdiff % 60)).substr(1)
    );
  };

  const roundTime = (time, minutesToRound) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    // Convert hours and minutes to time in minutes
    time = hours * 60 + minutes;

    let rounded = Math.ceil(time / minutesToRound) * minutesToRound;
    let rHr = "" + Math.floor(rounded / 60);
    let rMin = "" + (rounded % 60);

    setRounded(rHr.padStart(2, "0") + ":" + rMin.padStart(2, "0"));
  };

  const formatPrice = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  };

  console.log(value);

  return (
    <Container fixed className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="textPrimary">
              Time Duration Calculator
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TimeRangePicker
              className={classes.picker}
              onChange={onChange}
              value={value}
              clockIcon={null}
              disableClock
            />
          </Grid>
          <Grid item xs={2}>
            <Typography color="textPrimary">Rate: </Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={rate}
              inputProps={{
                maxLength: 3,
                inputMode: "numeric",
              }}
              onInput={(e) => onlyNumbers(e)}
              label=""
              placeholder="160"
              variant="outlined"
              size="small"
              name="rate"
              onChange={(e) => setRate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography color="textPrimary">Travel time</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={travelTimeHours}
              inputProps={{
                maxLength: 2,
                inputMode: "numeric",
              }}
              onInput={(e) => onlyNumbers(e)}
              label="hr"
              variant="outlined"
              size="small"
              name="travelTimeHours"
              onChange={(e) => setTravelTimeHours(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>:</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={travelTimeMinutes}
              inputProps={{
                maxLength: 2,
                inputMode: "numeric",
              }}
              onInput={(e) => onlyNumbers(e)}
              label="min"
              variant="outlined"
              size="small"
              name="travelTimeMinutes"
              onChange={(e) => setTravelTimeMinutes(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <ColorButton
              color="primary"
              size="small"
              variant="contained"
              disabled={
                !travelTimeHours || !travelTimeMinutes || !value ? true : false
              }
              onClick={() => {
                calculateTime(
                  value[0],
                  value[1],
                  travelTimeHours,
                  travelTimeMinutes
                );
              }}
            >
              Calculate
            </ColorButton>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textPrimary">
              Labour Time: {labourTime}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textPrimary">Travel Time: {trav}</Typography>
          </Grid>
          {result && (
            <Grid item xs={5}>
              <Typography color="textPrimary">Total time</Typography>
              <Typography>{result}</Typography>
            </Grid>
          )}
          {result && (
            <Grid item xs={5}>
              <Typography style={{ color: green[500] }}>
                Total rounded
              </Typography>
              <Typography>{rounded}</Typography>
            </Grid>
          )}
          {rounded && (
            <Grid item xs={12}>
              <Typography color="textPrimary">Total Amount</Typography>
              <Typography>
                {timeStringToFloat(rounded)} * {rate} ={" "}
                {formatPrice(timeStringToFloat(rounded) * rate)}
              </Typography>
            </Grid>
          )}
          {result && (
            <Grid item xs={12}>
              <Button
                color="secondary"
                size="small"
                variant="contained"
                onClick={() => resetCalculator()}
              >
                Reset
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;
