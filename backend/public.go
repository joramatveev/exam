package main

import (
	"crypto/md5"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/openware/rango/pkg/auth"
)

type userParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func UserSignUp(c *gin.Context) {
	todoService, err := GetTodoService(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var params userParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid params"})
		return
	}

	if err := todoService.AddUser(params.Email, params.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.String(http.StatusCreated, "registered")
}

func UserSignIn(c *gin.Context) {
	todoService, err := GetTodoService(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var params userParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid params"})
		return
	}

	user, err := todoService.GetUserInfo(params.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	passwordDigest := string(md5.New().Sum([]byte(params.Password)))
	if user.PasswordDigest != passwordDigest {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid password"})
		return
	}

	keys, err := auth.LoadOrGenerateKeys(privkeyPath, pubkeyPath)
	if err != nil {
		panic(err)
	}

	token, err := auth.ForgeToken("empty", params.Email, "empty", 0, keys.PrivateKey, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.String(http.StatusOK, token)
}
