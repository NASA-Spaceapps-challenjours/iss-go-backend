package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joshuaferrara/go-satellite"
)

func getIssLocation(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	c.JSON(http.StatusOK, calculateIssLocation(time.Now().UTC()))
}

func getPastPresentFutureLoc(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	var locations []issCoords
	timeOfRequest := time.Now().UTC().UnixMilli()

	for lookForTime := timeOfRequest - 90*60000; lookForTime < timeOfRequest+90*60000; lookForTime += 5000 {
		locations = append(locations, calculateIssLocation(time.UnixMilli(lookForTime).UTC()))
	}
	c.JSON(http.StatusOK, locations)
}

func calculateIssLocation(timeToCheck time.Time) issCoords {
	// Check if we've already calculated the coordinates for this time
	if val, ok := calculatedLocations[timeToCheck]; ok {
		return val
	}

	// Create the Satellite object needed to propagate (calculate) the location at the given time
	iss := satellite.TLEToSat(ISS_LINE_1, ISS_LINE_2, ISS_GRAVITY)
	position, _ := satellite.Propagate(iss, timeToCheck.Year(), int(timeToCheck.Month()), timeToCheck.Day(), timeToCheck.Hour(),
		timeToCheck.Minute(), timeToCheck.Second())
	// Calculate julian day to find theta to calculate latitde, longitude, and altitude
	jday := satellite.JDay(timeToCheck.Year(), int(timeToCheck.Month()), timeToCheck.Day(), timeToCheck.Hour(), timeToCheck.Minute(), timeToCheck.Second())
	theta := satellite.ThetaG_JD(jday)
	altitude, _, latLong := satellite.ECIToLLA(position, theta)

	// Convert latitude and longitude to degrees
	latitudeInDeg := latLong.Latitude * satellite.RAD2DEG

	for latitudeInDeg < -180 {
		latitudeInDeg += 360
	}

	for latitudeInDeg > 180 {
		latitudeInDeg -= 360
	}

	longitudeInDeg := latLong.Longitude*satellite.RAD2DEG + 360
	for longitudeInDeg < -180 {
		longitudeInDeg += 360
	}

	for longitudeInDeg > 180 {
		longitudeInDeg -= 360
	}
	return issCoords{Latitude: latitudeInDeg, Longitude: longitudeInDeg, Altitude: altitude}
}
