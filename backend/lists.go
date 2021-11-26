package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type listParams struct {
	Name string `json:"name"`
}

func CreateTodoList(c *gin.Context) {
	user, err := GetUserInfoService(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var params listParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parameters"})
		return
	}

	list := user.AddList(params.Name)
	c.JSON(http.StatusCreated, gin.H{"id": list.Id, "name": list.Name})
}

func GetTodoList(c *gin.Context) {
	user, err := GetUserInfoService(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	listId, err := strconv.Atoi(c.Params.ByName("list_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number"})
		return
	}

	list, err := user.GetList(listId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": list.Id, "name": list.Name})
}

func RenameTodoList(c *gin.Context) {
	user, err := GetUserInfoService(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	listId, err := strconv.Atoi(c.Params.ByName("list_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number"})
		return
	}

	var params listParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parameters"})
		return
	}

	list, err := user.RenameList(listId, params.Name)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": list.Id, "name": list.Name})
}

func DeleteTodoList(c *gin.Context) {
	user, err := GetUserInfoService(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	listId, err := strconv.Atoi(c.Params.ByName("list_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number"})
		return
	}

	err = user.DeleteList(listId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.String(http.StatusNoContent, "")
}

func GetTodoLists(c *gin.Context) {
	user, err := GetUserInfoService(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	lists := user.GetLists()

	c.JSON(http.StatusOK, lists)
}
