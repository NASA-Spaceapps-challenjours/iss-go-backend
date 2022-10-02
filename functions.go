package main

import (
	"encoding/csv"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"
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
	var locations []coords
	timeOfRequest := time.Now().UTC().UnixMilli()

	for lookForTime := timeOfRequest - NINETY_MINS_IN_MILLIS; lookForTime < timeOfRequest+NINETY_MINS_IN_MILLIS; lookForTime += 5000 {
		locations = append(locations, calculateIssLocation(time.UnixMilli(lookForTime).UTC()))
	}

	// Check for up to 20 seconds before the 90 mins and delete any values in map
	for outOfRange := timeOfRequest - (NINETY_MINS_IN_MILLIS + 20000); outOfRange < timeOfRequest-NINETY_MINS_IN_MILLIS; outOfRange++ {
		calculatedLocations.Delete(outOfRange)
	}
	c.JSON(http.StatusOK, locations)
}

func getClosestCity(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	loc := calculateIssLocation(time.Now())
	minDist := 1.6e307
	closestCity := cities[0]
	for _, ciudad := range cities {
		distanceFromLocation := math.Sqrt(math.Pow(ciudad.Latitude-loc.Longitude, 2) + math.Pow(ciudad.Longitude-loc.Longitude, 2))
		if distanceFromLocation < minDist {
			closestCity = ciudad
		}
	}
	c.JSON(http.StatusOK, closestCity)

}

func getCities() {
	csvFile, err := os.Open("./worldcities.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer csvFile.Close()

	r := csv.NewReader(csvFile)

	if _, err := r.Read(); err != nil {
		log.Fatal(err)
	}

	csvCities, err := r.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	for _, csvCity := range csvCities {
		latitude, _ := strconv.ParseFloat(csvCity[2], 64)
		longitude, _ := strconv.ParseFloat(csvCity[3], 64)
		cityName := csvCity[0]
		newCity := city{Latitude: latitude, Longitude: longitude, Name: cityName}
		cities = append(cities, newCity)
	}
}

func calculateIssLocation(timeToCheck time.Time) coords {
	// Check if we've already calculated the coordinates for this time
	if val, ok := calculatedLocations.Load(timeToCheck); ok {
		coords, isCoords := val.(coords)
		if isCoords {
			return coords
		}
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

	foundCoords := coords{Latitude: latitudeInDeg, Longitude: longitudeInDeg, Altitude: altitude * 1000}
	calculatedLocations.Store(timeToCheck, foundCoords)
	return foundCoords
}
