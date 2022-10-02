package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// r.Static("/out", "./out")
	// r.Use(static.Serve("/", static.LocalFile("./out", true)))
	r.GET("/getIssLocation", getIssLocation)
	r.GET("/getPastFuturePresentIssLocation", getPastPresentFutureLoc)
	r.Run()
}
