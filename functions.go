package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func sendTestData(c *gin.Context) {
	c.JSON(http.StatusOK, getIssLocation())
}
