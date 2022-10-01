package main

import (
	"time"

	"github.com/joshuaferrara/go-satellite"
)

func getIssLocation() issCoords {
	iss := satellite.TLEToSat(ISS_LINE_1, ISS_LINE_2, ISS_GRAVITY)
	currentTime := time.Now().UTC()
	position, _ := satellite.Propagate(iss, currentTime.Year(), int(currentTime.Month()), currentTime.Day(), currentTime.Hour(),
		currentTime.Minute(), currentTime.Second())
	jday := satellite.JDay(currentTime.Year(), int(currentTime.Month()), currentTime.Day(), currentTime.Hour(), currentTime.Minute(), currentTime.Second())
	theta := satellite.ThetaG_JD(jday)
	altitude, _, latLong := satellite.ECIToLLA(position, theta)
	latitudeInDeg := latLong.Latitude * satellite.RAD2DEG
	longitudeInDeg := latLong.Longitude * satellite.RAD2DEG
	return issCoords{Latitude: latitudeInDeg, Longitude: longitudeInDeg, Altitude: altitude}
}
