package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func updateIssLocation(c *gin.Context) {
	c.JSON(http.StatusOK, getIssLocation())
}
