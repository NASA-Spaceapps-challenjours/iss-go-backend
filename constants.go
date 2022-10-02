package main

// ISS_LINE_1 and ISS_LINE_2 taken from https://isstracker.spaceflight.esa.int/tledata.txt
const ISS_LINE_1 = "1 25544U 98067A   22274.19759479  .00014979  00000+0  26577-3 0  9997"
const ISS_LINE_2 = "2 25544  51.6446 171.3620 0002537 314.8685 180.8010 15.50443271361628"

// Gravity taken from joshuaferrara/go-satellite satellite_suite_test.go line 43
const ISS_GRAVITY = "wgs84"

const NINETY_MINS_IN_MILLIS = 90 * 60000
