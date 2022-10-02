package main

import (
	"time"

	"github.com/gin-gonic/gin"
)

var calculatedLocations map[time.Time]issCoords

func main() {
	r := gin.Default()

	// r.Static("/out", "./out")
	// r.Use(static.Serve("/", static.LocalFile("./out", true)))
	r.GET("/getIssLocation", getIssLocation)
	r.GET("/getPastFuturePresentIssLocation", getPastPresentFutureLoc)
	r.Run()
}
