package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type createTaskParams struct {
	Name        string `json:"task_name"`
	Description string `json:"description"`
}

type updateTaskParams struct {
	Name        string `json:"task_name"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

func CreateTodoTask(c *gin.Context) {
	list, err := GetListService(c)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var params createTaskParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid params"})
		return
	}

	task := list.AddTask(params.Name, params.Description)
	c.JSON(http.StatusCreated, task)
}

func GetTodoTask(c *gin.Context) {
	list, err := GetListService(c)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	taskId, err := strconv.Atoi(c.Params.ByName("task_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not a number"})
		return
	}

	task, err := list.GetTask(taskId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, task)
}

func UpdateTodoTask(c *gin.Context) {
	list, err := GetListService(c)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	taskId, err := strconv.Atoi(c.Params.ByName("task_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not a number"})
		return
	}

	var params updateTaskParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid params"})
		return
	}

	taskOld, err := list.GetTask(taskId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

    if len(params.Description) < 1 {
        params.Description = taskOld.Description
    }

    if params.Status == "" {
        params.Status = "open"
    }

	task, err := list.UpdateTask(taskId, params.Name, params.Description, params.Status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, task)
}

func DeleteTodoTask(c *gin.Context) {
	list, err := GetListService(c)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	taskId, err := strconv.Atoi(c.Params.ByName("task_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not a number"})
		return
	}

	err = list.DeleteTask(taskId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.String(http.StatusNoContent, "")
}

func GetTodoTasks(c *gin.Context) {
	list, err := GetListService(c)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	tasks := list.GetTasks()

	c.JSON(http.StatusOK, tasks)
}
