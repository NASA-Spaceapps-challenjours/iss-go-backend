package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func sendTestData(c *gin.Context) {
	issCoord := issCoords{Latitude: 0, Longitude: 0, Altitude: 0}
	c.JSON(http.StatusOK, issCoord)
}
