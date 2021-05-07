import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  Typography,
  withStyles,
  Divider,
  Box,
  Badge,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

const useStyles = makeStyles((theme) => ({
  root: {
    // height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: theme.spacing(4, 2),
  },
  paper: {
    padding: theme.spacing(2),
    // textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
    "& div": {
      borderRadius: 4,
      padding: 6,
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
  },
  secondary: {
    color: "#757575",
  },
  discountInput: {
    width: "10%",
    "& > div input": {
      padding: "1px 5px",
    },
  },
  textCenter: {
    textAlign: "center",
    paddingBottom: 16,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  badge: {
    right: 21,
    top: -5,
    fontSize: 8,
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
  const [timeOffHours, setTimeOffHours] = useState("0");
  const [timeOffMinutes, setTimeOffMinutes] = useState("0");
  const [result, setResult] = useState();
  const [rounded, setRounded] = useState();
  const [rate, setRate] = useState(160);
  const [discount, setDiscount] = useState(0);
  const [labourTime, setLabourTime] = useState();
  const [trav, setTrav] = useState();
  const [offTime, setOffTime] = useState();
  const [submit, setSubmit] = useState(false);

  const onlyNumbers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const resetCalculator = () => {
    onChange(["8:00", `${h}:${m}`]);
    setTravelTimeHours("0");
    setTravelTimeMinutes("0");
    setTimeOffHours("0");
    setTimeOffMinutes("0");
    setResult(null);
    setRounded(null);
    setLabourTime(null);
    setTrav(null);
    setRate(120);
    setOffTime(null);
    setSubmit(false);
  };

  const timeStringToFloat = (time) => {
    var hoursMinutes = time.split(":");
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  };

  const calculateTime = (
    start,
    finish,
    travelTimeHours,
    travelTimeMinutes,
    toffh,
    toffm
  ) => {
    let ary1 = start.split(":");
    let ary2 = finish.split(":");
    let minsdiff =
      parseInt(travelTimeHours, 10) * 60 +
      parseInt(travelTimeMinutes, 10) +
      parseInt(ary2[0], 10) * 60 +
      parseInt(ary2[1], 10) -
      parseInt(ary1[0], 10) * 60 -
      parseInt(ary1[1], 10) -
      parseInt(toffh, 10) * 60 -
      parseInt(toffm, 10);
    let labour =
      parseInt(ary2[0], 10) * 60 +
      parseInt(ary2[1], 10) -
      parseInt(ary1[0], 10) * 60 -
      parseInt(ary1[1], 10);
    let travel =
      parseInt(travelTimeHours, 10) * 60 + parseInt(travelTimeMinutes, 10);
    let tOff = parseInt(toffh, 10) * 60 + parseInt(toffm, 10);
    setLabourTime(
      String(100 + Math.floor(labour / 60)).substr(1) +
        ":" +
        String(100 + Math.floor(labour % 60)).substr(1)
    );

    setTrav(
      String(100 + Math.floor(travel / 60)).substr(1) +
        ":" +
        String(100 + (travel % 60)).substr(1)
    );
    setOffTime(
      String(100 + Math.floor(tOff / 60)).substr(1) +
        ":" +
        String(100 + (tOff % 60)).substr(1)
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

  let color = "black";
  if (travelTimeHours === "0" && travelTimeMinutes === "0") {
    color = "red";
  } else {
    color = "black";
  }

  return (
    <Container className={classes.root} maxWidth="sm">
      <Paper className={classes.paper}>
        <Grid
          container
          spacing={2}
          justify="center"
          alignItems="center"
          className={classes.textCenter}
        >
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
          <Grid item xs={12}>
            <Typography
              style={{
                color: `${color}`,
              }}
            >
              Travel time
            </Typography>
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
            <Typography color="textPrimary">Time off</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={timeOffHours}
              inputProps={{
                maxLength: 2,
                inputMode: "numeric",
              }}
              onInput={(e) => onlyNumbers(e)}
              label="hr"
              variant="outlined"
              size="small"
              name="timeOffHours"
              onChange={(e) => setTimeOffHours(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography>:</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={timeOffMinutes}
              inputProps={{
                maxLength: 2,
                inputMode: "numeric",
              }}
              onInput={(e) => onlyNumbers(e)}
              label="min"
              variant="outlined"
              size="small"
              name="timeOffMinutes"
              onChange={(e) => setTimeOffMinutes(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <ColorButton
              color="primary"
              size="small"
              variant="contained"
              disabled={
                !travelTimeHours ||
                !travelTimeMinutes ||
                !value ||
                !timeOffHours ||
                !timeOffMinutes ||
                (travelTimeHours === "0" && travelTimeMinutes === "0")
                  ? true
                  : false
              }
              onClick={() => {
                calculateTime(
                  value[0],
                  value[1],
                  travelTimeHours,
                  travelTimeMinutes,
                  timeOffHours,
                  timeOffMinutes
                );
                setSubmit(true);
              }}
            >
              Calculate
            </ColorButton>
          </Grid>
        </Grid>
        {submit && <Divider className={classes.divider} />}
        {submit && (
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            direction="row"
          >
            {labourTime && (
              <>
                <Grid item xs={6}>
                  <Typography color="textPrimary">Labour Time:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">{labourTime}</Typography>
                </Grid>
              </>
            )}

            {trav && (
              <>
                <Grid item xs={6}>
                  <Typography color="textPrimary">Travel Time:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">{trav}</Typography>
                </Grid>
              </>
            )}

            {offTime && (
              <>
                <Grid item xs={6}>
                  <Typography color="textPrimary">Time off: </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">{offTime}</Typography>
                </Grid>
              </>
            )}
            {result && (
              <>
                <Grid item xs={3}>
                  <Typography color="textPrimary">Total:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Box display="flex">
                    <Badge
                      classes={{ anchorOriginTopRightRectangle: classes.badge }}
                      color="default"
                      badgeContent={<p>labour</p>}
                    >
                      <Typography>{labourTime}</Typography>
                    </Badge>
                    <span style={{ margin: "0px 3px" }}>+</span>
                    <Badge
                      classes={{ anchorOriginTopRightRectangle: classes.badge }}
                      color="default"
                      badgeContent={<p>travel</p>}
                    >
                      <Typography>{trav}</Typography>
                    </Badge>
                    {offTime !== "00:00" ? (
                      <Badge
                        classes={{
                          anchorOriginTopRightRectangle: classes.badge,
                        }}
                        color="default"
                        badgeContent={<p>off</p>}
                      >
                        <Typography>
                          <span style={{ margin: "0px 3px" }}>-</span>
                          {offTime}
                        </Typography>
                      </Badge>
                    ) : null}

                    <Typography>
                      <span style={{ margin: "0px 3px" }}>=</span>
                      {result}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
            {result && (
              <>
                <Grid item xs={6}>
                  <Typography style={{ color: green[500] }}>
                    Time rounded:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{rounded}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        )}
        {rounded && <Divider className={classes.divider} />}
        {rounded && (
          <Grid
            container
            spacing={3}
            justify="center"
            alignItems="center"
            className={classes.textCenter}
          >
            <Grid item xs={12}>
              <Typography color="textPrimary">Total Amount</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {timeStringToFloat(rounded)}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography color="textSecondary">*</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={rate}
                inputProps={{
                  maxLength: 3,
                  inputMode: "numeric",
                }}
                onInput={(e) => onlyNumbers(e)}
                label="rate"
                placeholder="160"
                variant="outlined"
                size="small"
                name="rate"
                onChange={(e) => setRate(e.target.value)}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography color="textSecondary">=</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color="textSecondary">
                {formatPrice(timeStringToFloat(rounded) * rate)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography color="textPrimary">Extra</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                variant="h6"
                style={{ fontSize: 14 }}
              >
                {formatPrice(timeStringToFloat(rounded) * rate)} -{" "}
                <TextField
                  className={classes.discountInput}
                  value={discount}
                  inputProps={{
                    maxLength: 2,
                    inputMode: "numeric",
                  }}
                  onInput={(e) => onlyNumbers(e)}
                  placeholder="0"
                  variant="outlined"
                  size="small"
                  name="discount"
                  onChange={(e) => setDiscount(e.target.value)}
                />{" "}
                % (
                <span className={classes.secondary}>
                  {formatPrice(
                    timeStringToFloat(rounded) * rate * (discount * 0.01)
                  )}
                </span>
                ) ={" "}
                <span className="error">
                  {" "}
                  {formatPrice(
                    timeStringToFloat(rounded) * rate -
                      timeStringToFloat(rounded) * rate * (discount * 0.01)
                  )}
                </span>
              </Typography>
            </Grid>
          </Grid>
        )}
        {result && (
          <Grid item xs={12} style={{ marginTop: "2rem" }}>
            <Button
              color="secondary"
              size="small"
              variant="outlined"
              onClick={() => resetCalculator()}
            >
              Reset
            </Button>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default App;
