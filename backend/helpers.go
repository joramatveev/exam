package main

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/openware/rango/pkg/auth"
)

func GetTodoService(c *gin.Context) (TodoService, error) {
	todoService, ok := c.Get("todo")
	if !ok {
		return nil, fmt.Errorf("Todo is not found")
	}

	return todoService.(TodoService), nil
}

func GetAuth(c *gin.Context) (*auth.Auth, error) {
	authData, ok := c.Get("auth")
	if !ok {
		return nil, fmt.Errorf("Authorization not found")
	}

	return authData.(*auth.Auth), nil
}

func GetUserInfoService(c *gin.Context) (*User, error) {
	todoService, err := GetTodoService(c)
	if err != nil {
		return nil, err
	}

	authData, err := GetAuth(c)
	if err != nil {
		return nil, err
	}

	user, err := todoService.GetUserInfo(authData.Email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func GetListService(c *gin.Context) (*TodoList, error) {
	user, err := GetUserInfoService(c)
	if err != nil {
		return nil, err
	}

	listId, err := strconv.Atoi(c.Params.ByName("list_id"))
	if err != nil {
		return nil, fmt.Errorf("Invalid number")
	}

	list, err := user.GetList(listId)
	if err != nil {
		return nil, err
	}

	return list, nil
}
