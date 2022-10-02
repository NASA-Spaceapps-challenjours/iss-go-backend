package main

import (
	"sync"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

var calculatedLocations sync.Map

func main() {
	r := gin.Default()

	r.Static("/out", "./out")
	r.Use(static.Serve("/", static.LocalFile("./out", true)))
	r.GET("/getIssLocation", getIssLocation)
	r.GET("/getPastFuturePresentIssLocation", getPastPresentFutureLoc)
	r.Run()
}
