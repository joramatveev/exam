package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/openware/rango/pkg/auth"
)

const (
	privkeyPath = "./privkey.rsa"
	pubkeyPath  = "./pubkey.rsa"
)

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Content-Type", "application/json")
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Max-Age", "86400")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Max")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(200)
			return
        }

		c.Next()
    }
}

func TodoServiceMiddleware() gin.HandlerFunc {
	todoService := NewTodoService()

	return func(c *gin.Context) {
		c.Set("todo", todoService)
		c.Next()
	}
}

func AuthMiddleware() gin.HandlerFunc {
	keys, err := auth.LoadOrGenerateKeys(privkeyPath, pubkeyPath)
	if err != nil {
		panic(err)
	}

	return func(c *gin.Context) {
		authHeader := strings.Split(c.GetHeader("Authorization"), "Bearer ")
		if len(authHeader) != 2 {
			c.Abort()
			c.JSON(http.StatusBadRequest, gin.H{"error": "No JWT passed"})
			return
		}

		token := authHeader[1]
		authData, err := auth.ParseAndValidate(token, keys.PublicKey)
		if err != nil {
			c.Abort()
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		c.Set("auth", &authData)
		c.Next()
	}
}
